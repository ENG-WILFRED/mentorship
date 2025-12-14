import React from "react";
import clsx from "clsx";

interface ProgressBarCardProps {
  stats: {
    pending: number;
    inProgress: number;
    fulfilled: number;
  } | undefined;
}

export default function ProgressBarCard({ stats }: ProgressBarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Request Status Distribution
      </h3>
      <div className="space-y-4">
        <ProgressBar
          label="Pending"
          value={stats?.pending || 0}
          colorClass="bg-yellow-500"
        />
        <ProgressBar
          label="In Progress"
          value={stats?.inProgress || 0}
          colorClass="bg-blue-500"
        />
        <ProgressBar
          label="Fulfilled"
          value={stats?.fulfilled || 0}
          colorClass="bg-green-500"
        />
      </div>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  colorClass: string;
}

/**
 * ProgressBar Component
 * Displays a progress bar for the admin dashboard.
 */

function ProgressBar({ label, value, colorClass }: ProgressBarProps) {
  // Ensure the value is between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm text-gray-400 font-medium">
          {clampedValue} requests
        </span>
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
