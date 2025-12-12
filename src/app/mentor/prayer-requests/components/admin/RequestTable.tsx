import React from "react";
import StatusBadge from "../StatusBadge";
import { Trash2 } from "lucide-react";
import { PrayerRequest, StatusOptions } from "../../lib/types";

interface RequestTableProps {
  requests: PrayerRequest[];
  updateRequestStatus: (id: number, status: StatusOptions) => void;
  deleteRequest: (id: number) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toUpperCase()) {
    case 'HIGH':
      return 'text-red-700';
    case 'MEDIUM':
      return 'text-yellow-500';
    case 'LOW':
      return 'text-green-700';
    default:
      return 'text-gray-700';
  }
};

/**
 * RequestTable Component
 * Displays a request table for the admin dashboard.
 */

export default function RequestTable({
  requests,
  updateRequestStatus,
  deleteRequest,
}: RequestTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Request</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">School</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{request.name}</p>
                  <p className="text-xs text-gray-600">{request.studentId}</p>
                </div>
              </td>
              <td className="py-3 px-4 sm:w-1/3 lg:w-1/4 xl:w-1/6">
                <p className="text-sm sm:text-base text-gray-700 line-clamp-2">
                  {request.request}
                </p>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-500">{request.school}</p>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={request.status ?? 'PENDING'} />
              </td>
              <td className="py-3 px-4">
                 <span className={`text-sm font-medium capitalize ${getPriorityColor(request.priority ?? 'LOW')}`}>
                  {request.priority?.toLowerCase()}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2">
                  <select
                    value={request.status}
                    onChange={(e) =>
                      updateRequestStatus(request.id ?? -1, e.target.value as StatusOptions)
                    }
                    className="text-sm border border-gray-300 rounded px-1.5 py-1 bg-white mb-2 sm:mb-0"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="FULFILLED">Fulfilled</option>
                  </select>
                  <button
                    onClick={() => deleteRequest(request.id ?? -1)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
