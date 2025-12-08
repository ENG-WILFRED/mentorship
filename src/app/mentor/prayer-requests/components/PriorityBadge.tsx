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
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <span className={`text-xs font-medium ${getPriorityColor(priority)}`}>
      {priority.toUpperCase()}
    </span>
  );
}
