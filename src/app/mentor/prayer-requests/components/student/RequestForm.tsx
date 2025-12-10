import React, { useState } from "react";
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

    try {
      // Simulate form submission (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // On success
      setSuccess(true);
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
    } catch (error) {
      setError("There was an error submitting your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-2.5 md:space-y-4" onSubmit={handleSubmit}>
      {/* Full Name and Email */}
      <div className="grid grid-cols-2 gap-2 md:gap-4">
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
      <div className="grid grid-cols-2 gap-2 md:gap-4">
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
      <div className="grid grid-cols-2 gap-2 md:gap-4">
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
      <div className="grid grid-cols-2 gap-2 md:gap-4">
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
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 rounded-lg font-medium "
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
