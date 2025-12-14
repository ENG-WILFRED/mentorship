import {
  Heart,
  Clock,
} from "lucide-react";
import { PrayerRequestResponse } from "../../lib/types";

interface RecentActivityProps {
  recentRequests: PrayerRequestResponse[];
}

export default function RecentActivity({recentRequests}: RecentActivityProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentRequests.length > 0 ? (
            recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {request.name ||
                          `${request.createdBy?.firstName} ${request.createdBy?.lastName}`}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {request.request}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            request.status === "FULFILLED"
                              ? "bg-green-100 text-green-700"
                              : request.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {request.status}
                        </span>
                        {request.school && (
                          <span className="text-xs text-gray-500">
                            {request.school}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(request.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.prayedByUsers?.length || 0} prayers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>
  )
}
