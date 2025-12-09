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
    <div
      className="
        bg-white rounded-xl shadow-sm border
        p-3
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
      "
    >
      <div className="flex items-center">
        <div
          className={`
            p-2
            rounded-lg
            ${iconBgClass}
          `}
        >
          <Icon
            className={`
              h-4 w-4
              ${colorClass}
            `}
          />
        </div>

        <div className="ml-3 sm:ml-4 md:ml-5">
          <p
            className="
              text-xs sm:text-sm
              font-medium text-gray-600
            "
          >
            {title}
          </p>

          <p
            className="
       text-sm
              font-bold text-gray-900
            "
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
