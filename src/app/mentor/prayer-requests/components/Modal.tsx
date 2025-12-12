import React, { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

/**
 * Modal Component
 * Displays a reusable modal to display other components.
 */

export default function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
    onClick={onClose}
      className="
        fixed inset-0 bg-black/50 flex items-center justify-center 
        p-4 sm:p-6 md:p-8 z-50
      "
    >
      <div
       onClick={(e) => e.stopPropagation()} 
        className="
          bg-white rounded-xl 
          w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl
          p-4 sm:p-5 md:p-6 lg:p-8
          max-h-screen overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
          <h2
            className="
              text-lg sm:text-xl md:text-2xl lg:text-3xl 
              font-bold text-gray-900
            "
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X
              className="
                h-5 w-5
              "
            />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

