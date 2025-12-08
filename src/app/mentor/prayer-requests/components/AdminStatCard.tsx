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
        p-4 sm:p-5 md:p-6 lg:p-8
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
      "
    >
      <div className="flex items-center">
        <div
          className={`
            p-2 sm:p-3 md:p-4
            rounded-lg
            ${iconBgClass}
          `}
        >
          <Icon
            className={`
              h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8
              ${colorClass}
            `}
          />
        </div>

        <div className="ml-3 sm:ml-4 md:ml-5">
          <p
            className="
              text-xs sm:text-sm md:text-base lg:text-lg
              font-medium text-gray-600
            "
          >
            {title}
          </p>

          <p
            className="
              text-lg sm:text-xl md:text-2xl lg:text-3xl
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
