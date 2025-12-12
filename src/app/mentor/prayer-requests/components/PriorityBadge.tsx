import React from "react";
import { PriorityOptions } from "../lib/types";

interface PriorityBadgeProps {
  priority: PriorityOptions;
}

/**
 * Priority Badge Component
 * Renders a styled badge for request priority.
 */

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getPriorityColor = (priority: PriorityOptions) => {
    switch (priority) {
      case "HIGH":
        return "text-red-700";
      case "MEDIUM":
        return "text-orange-600";
      case "LOW":
        return "text-green-700";
      default:
        return "text-gray-400";
    }
  };

  return (
    <span
      className={`
        font-medium ${getPriorityColor(priority)}
        text-xs sm:text-sm capitalize
      `}
    >
      {priority.toLowerCase()}
    </span>
  );
}
