"use client";

import React, { useState } from "react";
import InputField from "../form fields/InputField";
import SelectField from "../form fields/SelectField";
import TextAreaField from "../form fields/TextAreaField";
import Button from "../Button";
import { useToast } from "@/components/Toast";
import { useCreatePrayerRequest } from "@/app/mentor/prayer-requests/hooks";
import { FormData, PriorityOptions } from "../../lib/types";
import { fields } from "../../lib/formSchema";
import { validators } from "../../lib/formValidation";

interface RequestFormProps {
  setShowModal: (show: boolean) => void;
  userId: number | null;
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

export default function RequestForm({ setShowModal, userId }: RequestFormProps) {
  const toast = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  // Use the create prayer request hook
  const { createPrayerRequest, isLoading } = useCreatePrayerRequest();

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
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      createPrayerRequest(
        {
          request: formData.prayerRequest,
          name: formData.fullName,
          email: formData.email,
          studentId: formData.studentId,
          grade: formData.grade,
          school: formData.school,
          subject: formData.subject,
          priority: formData.priority as PriorityOptions,
          category: formData.category,
          notes: formData.additionalNotes,
          createdById: userId || undefined,
        },
        {
          onSuccess: () => {
            setFormData(initialFormData);
            setShowModal(false);
          },
        }
      );
    } catch (err) {
      console.error("Prayer request submission error:", err);
      const userMessage = "Failed to submit your request. Please try again later.";
      setError(userMessage);
      toast(userMessage, "error");
    }
  };

  const renderField = (field: (typeof fields)[0]) => {
    const commonProps = {
      label: field.label,
      name: field.name,
      value: formData[field.name],
      onChange: handleChange,
      placeholder: field.placeholder,
      required: field.required,
    };

    return (
      <div key={field.name} className="relative">
        {field.type === "select" ? (
          <SelectField {...commonProps} options={field.options || []} />
        ) : field.type === "textarea" ? (
          <TextAreaField {...commonProps} />
        ) : (
          <InputField {...commonProps} type={field.type} />
        )}
      </div>
    );
  };

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
          return <div key={idx}>{renderField(rowFields[0])}</div>;
        } else {
          return (
            <div key={idx} className="grid grid-cols-2 gap-2 md:gap-4">
              {rowFields.map((f) => renderField(f))}
            </div>
          );
        }
      })}

      <div className="flex space-x-3">
        <Button
          type="button"
          onClick={() => setShowModal(false)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 rounded-lg font-medium"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex-1 rounded-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}