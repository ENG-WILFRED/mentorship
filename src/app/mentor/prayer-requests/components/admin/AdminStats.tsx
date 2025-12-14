import React from "react";
import {
  Activity,
  CheckCircle,
  Heart,
  TrendingUp,
  Users,
} from "lucide-react";

interface AdminStatsProps {
  stats:
    | {
        total: number;
        pending: number;
        inProgress: number;
        fulfilled: number;
        totalStudents: number;
      }
    | undefined;
}
export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <AdminStatCard
        title="Total Students"
        value={stats?.totalStudents || 0}
        icon={Users}
        colorClass="text-purple-600"
        iconBgClass="bg-purple-100"
      />
      <AdminStatCard
        title="Total Requests"
        value={stats?.total || 0}
        icon={Heart}
        colorClass="text-purple-600"
        iconBgClass="bg-purple-100"
      />
      <AdminStatCard
        title="Pending"
        value={stats?.pending || 0}
        icon={Activity}
        colorClass="text-yellow-600"
        iconBgClass="bg-yellow-100"
      />
      <AdminStatCard
        title="In Progress"
        value={stats?.inProgress || 0}
        icon={TrendingUp}
        colorClass="text-blue-600"
        iconBgClass="bg-blue-100"
      />
      <AdminStatCard
        title="Fulfilled"
        value={stats?.fulfilled || 0}
        icon={CheckCircle}
        colorClass="text-green-600"
        iconBgClass="bg-green-100"
      />
    </div>
  );
}

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

function AdminStatCard({
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
