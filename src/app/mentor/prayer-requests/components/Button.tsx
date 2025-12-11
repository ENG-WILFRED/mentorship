import React, { ReactNode } from "react";

interface ButtonProps {
  type: 'submit' | 'button';
  children: ReactNode;
  className?: string;
   onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

/**
 * Button Component
 * Displays a reusable button.
 */

export default function Button({
  children,
  className = "",
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        /* Mobile-first */
        text-xs py-1.5 px-3

        /* Tablet (sm) */
        sm:text-sm

        /* Larger Tablets (md) */
        md:text-base

        focus:outline-none cursor-pointer transition-all duration-300
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
