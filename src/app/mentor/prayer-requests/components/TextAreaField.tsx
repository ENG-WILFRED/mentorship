// src/components/TextareaField.tsx
import React from "react";

interface TextareaFieldProps {
  label: string;
  placeholder: string;
  required?: boolean;
}

export default function TextAreaField({
  label,
  placeholder,
  required = false,
}: TextareaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        required={required}
        rows={4}
        className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );
}
