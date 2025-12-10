"use client";

import React, { useState } from "react";
import { useToast } from "@/components/Toast";
import { createPrayerRequest } from "@/actions/prayer/createPrayerRequest";
import { getSession } from "@/lib/session";
import InputField from "../InputField";
import SelectField from "../SelectField";
import TextAreaField from "../TextAreaField";
import Button from "../Button";

interface RequestFormProps {
  setShowModal: (show: boolean) => void;
}

const gradeOptions = [
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "College Freshman",
  "College Sophomore",
  "College Junior",
  "College Senior",
];

const categoryOptions = [
  "Academic",
  "Mentorship",
  "Career",
  "Relationship",
  "Wisdom",
  "Health",
  "Family",
  "Spiritual Growth",
];

const priorityOptions = [
  "Low - General support",
  "Medium - Important guidance needed",
  "High - Urgent prayer needed",
];

export default function RequestForm({ setShowModal }: RequestFormProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic client-side validation
    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      toast("Please enter your full name.", "error");
      setLoading(false);
      return;
    }
    if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      toast("Please enter a valid email address.", "error");
      setLoading(false);
      return;
    }
    if (!formData.prayerRequest.trim()) {
      setError("Please enter your prayer request.");
      toast("Please enter your prayer request.", "error");
      setLoading(false);
      return;
    }

    try {
      const session = getSession();
      // prefer logged-in user's email/name if available
      const emailToUse = session.email ?? formData.email;
      const nameToUse = formData.fullName || (session.email ? session.email.split('@')[0] : '');
      const priority = (formData.priority || "").toLowerCase().includes("high")
        ? "high"
        : (formData.priority || "").toLowerCase().includes("low")
        ? "low"
        : "medium";

      await createPrayerRequest({
        request: formData.prayerRequest,
        name: nameToUse,
        email: emailToUse,
        studentId: formData.studentId,
        grade: formData.grade,
        school: formData.school,
        subject: formData.subject,
        priority: priority as any,
        category: formData.category,
        notes: formData.additionalNotes,
      });

      setSuccess(true);
      toast("Prayer request submitted — thank you!", "success");
      setFormData({
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
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "There was an error submitting your request. Please try again.";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Full Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name *"
          type="text"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <InputField
          label="Email Address *"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Student ID and Grade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Student ID"
          type="text"
          placeholder="STU-2025-XXX"
          value={formData.studentId}
          onChange={handleChange}
        />
        <SelectField
          label="Grade Level *"
          value={formData.grade}
          options={gradeOptions}
          onChange={handleChange}
          required
        />
      </div>

      {/* School/Institution and Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="School/Institution *"
          type="text"
          placeholder="Your school name"
          value={formData.school}
          onChange={handleChange}
          required
        />
        <InputField
          label="Subject/Field of Study *"
          type="text"
          placeholder="e.g., Mathematics"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>

      {/* Prayer Request */}
      <TextAreaField
        label="Prayer Request *"
        value={formData.prayerRequest}
        onChange={handleChange}
        placeholder="What would you like us to pray for?"
        required
      />

      {/* Priority & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Priority Level *"
          value={formData.priority}
          options={priorityOptions}
          onChange={handleChange}
          required
        />
        <SelectField
          label="Category *"
          value={formData.category}
          options={categoryOptions}
          onChange={handleChange}
          required
        />
      </div>

      {/* Additional Notes */}
      <TextAreaField
        label="Additional Notes"
        value={formData.additionalNotes}
        onChange={handleChange}
        placeholder="Any additional information or context"
      />

      {/* Buttons */}
      <div className="flex space-x-3">
        <Button
          type="button"
          onClick={() => setShowModal(false)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 rounded-lg font-medium py-3 px-4"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex-1 rounded-lg font-medium py-3 px-4"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>

      {/* Error/Success message */}
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">
          Your prayer request was submitted successfully!
        </p>
      )}
    </form>
  );
}
