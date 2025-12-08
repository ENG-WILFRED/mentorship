import React from "react";
import { Priority } from "../types";

interface PriorityBadgeProps {
  priority: Priority;
}

/**
 * Priority Badge Component
 * Renders a styled badge for request priority.
 */

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-orange-400";
      case "low":
        return "text-green-400";
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
      {priority}
    </span>
  );
}
