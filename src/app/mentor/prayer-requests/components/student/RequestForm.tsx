// src/components/RequestForm.tsx
import React from "react";
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

/**
 * Request Card Component
 * Displays a single prayer request in a card format.
 */

export default function RequestForm({ setShowModal }: RequestFormProps) {
  return (
    <form className="space-y-6">
      {/* Full Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name *"
          type="text"
          placeholder="Your full name"
          required
        />
        <InputField
          label="Email Address *"
          type="email"
          placeholder="your@email.com"
          required
        />
      </div>

      {/* Student ID and Grade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Student ID" type="text" placeholder="STU-2025-XXX" />
        <SelectField label="Grade Level *" options={gradeOptions} required />
      </div>

      {/* School/Institution and Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="School/Institution *"
          type="text"
          placeholder="Your school name"
          required
        />
        <InputField
          label="Subject/Field of Study *"
          type="text"
          placeholder="e.g., Mathematics"
          required
        />
      </div>

      {/* Prayer Request */}
      <TextAreaField
        label="Prayer Request *"
        placeholder="What would you like us to pray for?"
        required
      />

      {/* Priority & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Priority Level *"
          options={priorityOptions}
          required
        />
        <SelectField label="Category *" options={categoryOptions} required />
      </div>

       {/* Prayer Request */}
      <TextAreaField
        label="Additional Notes"
        placeholder="Any additional information or context"
        required
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
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex-1 rounded-lg font-medium py-3 px-4"
        >
          Submit Request
        </Button>
      </div>
    </form>
  );
}
