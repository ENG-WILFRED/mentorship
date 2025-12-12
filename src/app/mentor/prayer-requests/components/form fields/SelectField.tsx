// src/components/SelectField.tsx
import React from "react";

interface SelectFieldProps {
  label?: string;
  options: string[] | { label: string; value: string }[];
  name: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export default function SelectField({
  label,
  options,
  name,
  required = false,
  value,
  onChange,
  className = "", 
}: SelectFieldProps) {
 const optionsWithDefault = [
    { label: "Select...", value: "" },
    ...(Array.isArray(options)
      ? options.map((option) => {
          if (typeof option === "string") {
            return { label: option, value: option };
          } else {
            return option; 
          }
        })
      : []),
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full  px-1.5 py-2
          text-gray-600 
          text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
      >
        
        {optionsWithDefault.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
