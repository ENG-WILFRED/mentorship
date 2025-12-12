import React from "react";
import clsx from "clsx";

interface ProgressBarProps {
  label: string;
  value: number;
  colorClass: string;
}

/**
 * ProgressBar Component
 * Displays a progress bar for the admin dashboard.
 */

export default function ProgressBar({
  label,
  value,
  colorClass,
}: ProgressBarProps) {
  // Ensure the value is between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm text-gray-400 font-medium">{clampedValue} requests</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={clsx("h-2 rounded-full", colorClass)}
          style={{ width: `${clampedValue}%` }}
        ></div>
      </div>
    </div>
  );
}
