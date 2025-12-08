import React from "react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
  iconBgClass: string;
}

/**
 * Admin Stat Card Component
 * Displays a single statistic card for the admin dashboard.
 */

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  iconBgClass,
}: AdminStatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${iconBgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
