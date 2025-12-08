import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
  iconBgClass: string;
}

/**
 * Stats Card Component
 * Displays a single statistic card.
 */

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  iconBgClass,
}: StatCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-4 border border-white/30">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
        <div className="ml-3">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
