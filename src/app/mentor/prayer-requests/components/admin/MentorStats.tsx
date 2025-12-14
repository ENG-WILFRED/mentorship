import React from "react";

interface TopMentorsCardProps {
  topMentors: { name: string; count: number; fulfilled: number }[];
}

export default function MentorStats({ topMentors }: TopMentorsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Mentors</h3>
      <div className="space-y-3">
        {topMentors.length > 0 ? (
          topMentors.map((mentor, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{mentor.name}</p>
                  <p className="text-xs text-gray-500">
                    {mentor.fulfilled}/{mentor.count} fulfilled
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {mentor.count}
                </p>
                <p className="text-xs text-gray-500">requests</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            No mentors assigned yet
          </p>
        )}
      </div>
    </div>
  );
}
