// src/components/SelectField.tsx
import React from "react";

interface SelectFieldProps {
  label?: string;
  options: string[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export default function SelectField({
  label,
  options,
  required = false,
  value,
  onChange,
  className = "", 
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 text-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
