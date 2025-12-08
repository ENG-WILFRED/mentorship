import React, { ReactNode } from "react";

interface ButtonProps {
  type: 'submit' | 'button';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Button Component
 * Displays a reusable button.
 */

export default function Button({
  children,
  className,
  type,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
     type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-4 focus:outline-none transition-all duration-300 ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}
