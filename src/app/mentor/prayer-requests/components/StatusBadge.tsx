import React from "react";
import { Status } from "../types";

interface StatusBadgeProps {
  status: Status;
}

/**
 * Status Badge Component
 * Renders a styled badge for request status.
 */

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "fulfilled":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`
        inline-flex px-1.5 py-1.5
        font-medium rounded-full
        ${getStatusColor(status)}
        text-xs sm:text-sm
      `}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
