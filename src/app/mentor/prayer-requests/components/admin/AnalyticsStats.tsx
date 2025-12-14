import { Heart, UserPlus, Target, Award } from "lucide-react";
import { PrayerRequestResponse } from "../../lib/types";

interface AnalyticsStatsProps {
  requests: PrayerRequestResponse[];
  stats: {
    total: number;
    fulfilled: number;
  } | undefined;
  topMentors: { count: number }[];
}

export default function AnalyticsStats({
  requests,
  stats,
  topMentors,
}: AnalyticsStatsProps) {
  // Calculate additional analytics
  const totalPrayedBy = requests.reduce(
    (sum, req) => sum + (req.prayedByUsers?.length || 0),
    0
  );

  const averagePrayersPerRequest =
    requests.length > 0 ? (totalPrayedBy / requests.length).toFixed(1) : 0;

  const fulfillmentRate = stats?.total
    ? ((stats.fulfilled / stats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnalyticsCard
        title="Total Prayers"
        value={totalPrayedBy}
        icon={Heart}
        trend="+12.5%"
        trendUp={true}
      />
      <AnalyticsCard
        title="Avg Prayers/Request"
        value={averagePrayersPerRequest}
        icon={Target}
        trend="+8.2%"
        trendUp={true}
      />
      <AnalyticsCard
        title="Fulfillment Rate"
        value={`${fulfillmentRate}%`}
        icon={Award}
        trend="+5.3%"
        trendUp={true}
      />
      <AnalyticsCard
        title="Active Mentors"
        value={topMentors.length}
        icon={UserPlus}
        trend="+2"
        trendUp={true}
      />
    </div>
  );
}

// Analytics Card Component
interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

function AnalyticsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
      </div>
    </div>
  );
}
