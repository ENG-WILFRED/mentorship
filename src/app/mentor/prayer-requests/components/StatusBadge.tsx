import React from "react";
import { StatusOptions } from "../lib/types";

interface StatusBadgeProps {
  status: StatusOptions;
}

/**
 * Status Badge Component
 * Renders a styled badge for request status.
 */

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: StatusOptions) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-900";
      case "IN_PROGRESS":
        return "bg-blue-200 text-blue-900";
      case "FULFILLED":
        return "bg-green-200 text-green-900";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  return (
    <span
      className={`
        inline-flex px-1.5 py-1.5
        font-medium rounded-full
        ${getStatusColor(status)}
        text-xs sm:text-sm capitalize
      `}
    >
      {status.toLowerCase()}
    </span>
  );
}
