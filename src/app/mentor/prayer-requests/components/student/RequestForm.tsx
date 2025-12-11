"use client";

import React, { useState } from "react";
import InputField from "../form fields/InputField";
import SelectField from "../form fields/SelectField";
import TextAreaField from "../form fields/TextAreaField";
import Button from "../Button";
import { useToast } from "@/components/Toast";
import { getSession } from "@/lib/session";
import { createPrayerRequest } from "@/actions/prayer/createPrayerRequest";
import { FormData, PriorityOptions } from "../../lib/types";
import { fields } from "../../lib/formSchema";
import { validators } from "../../lib/formValidation";

interface RequestFormProps {
  setShowModal: (show: boolean) => void;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  studentId: "",
  grade: "",
  school: "",
  subject: "",
  prayerRequest: "",
  priority: "",
  category: "",
  additionalNotes: "",
};

export default function RequestForm({ setShowModal }: RequestFormProps) {
  const toast = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle field changes dynamically
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    for (const key in validators) {
      const field = key as keyof FormData;
      const error = validators[field](formData[field]);
      if (error) {
        setError(error);
        toast(error, "error");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const session = getSession();
      const emailToUse = session.email ?? formData.email;
      const nameToUse =
        formData.fullName || (session.email ? session.email.split("@")[0] : "");

      await createPrayerRequest({
        request: formData.prayerRequest,
        name: nameToUse,
        email: emailToUse,
        studentId: formData.studentId,
        grade: formData.grade,
        school: formData.school,
        subject: formData.subject,
        priority: formData.priority as PriorityOptions,
        category: formData.category,
        notes: formData.additionalNotes,
      });

      setSuccess(true);
      toast("Prayer request submitted — thank you!", "success");
      setFormData(initialFormData);
    } catch (err) {
      console.error("Prayer request submission error:", err);
      const userMessage =
        "Failed to submit your request. Please try again later.";
      setError(userMessage);
      toast(userMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically render a field
  const renderField = (field: (typeof fields)[0]) => {
    const commonProps = {
      label: field.label,
      name: field.name,
      value: formData[field.name],
      onChange: handleChange,
      placeholder: field.placeholder,
      required: field.required,
    };

    // const errorMessage = validators[field.name as keyof FormData](formData[field.name]);

    return (
      <div key={field.name} className="relative">
        {field.type === "select" ? (
          <SelectField {...commonProps} options={field.options || []} />
        ) : field.type === "textarea" ? (
          <TextAreaField {...commonProps} />
        ) : (
          <InputField {...commonProps} type={field.type} />
        )}
        {/* {errorMessage && <p className="absolute text-red-500 text-sm m">{errorMessage}</p>} */}
      </div>
    );
  };

  // Group fields by row for layout
  const rows: { [key: number]: typeof fields } = {};
  fields.forEach((f) => {
    const row = f.row || 0;
    if (!rows[row]) rows[row] = [];
    rows[row].push(f);
  });

  return (
    <form className="space-y-2.5 md:space-y-4" onSubmit={handleSubmit}>
      {Object.values(rows).map((rowFields, idx) => {
        if (rowFields.length === 1) {
          // Single column
          return <div key={idx}>{renderField(rowFields[0])}</div>;
        } else {
          // 2-column grid
          return (
            <div key={idx} className="grid grid-cols-2 gap-2 md:gap-4">
              {rowFields.map((f) => renderField(f))}
            </div>
          );
        }
      })}

      {/* Buttons */}
      <div className="flex space-x-3">
        <Button
          type="button"
          onClick={() => setShowModal(false)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 rounded-lg font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex-1 rounded-lg font-medium"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>

      {/* Error/Success messages */}
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">
          Your prayer request was submitted successfully!
        </p>
      )}
    </form>
  );
}
