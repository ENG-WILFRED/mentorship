
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
  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm text-gray-400 font-medium">{value} requests</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${colorClass} h-2 rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
