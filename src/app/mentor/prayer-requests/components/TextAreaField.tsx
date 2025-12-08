// src/components/TextareaField.tsx
import React from "react";

interface TextareaFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string; 
}

export default function TextAreaField({
  label,
  placeholder,
  required = false,
  value,
  onChange,
  className = "", 
}: TextareaFieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        required={required}
        value={value}
        onChange={onChange}
        rows={4}
        className={`w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`} // Append passed className
        placeholder={placeholder}
      />
    </div>
  );
}
