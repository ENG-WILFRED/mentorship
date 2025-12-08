// src/components/InputField.tsx
import React from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputField({
  label,
  type,
  placeholder,
  required = false,
  value,
  onChange,
  className = "", 
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 text-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
