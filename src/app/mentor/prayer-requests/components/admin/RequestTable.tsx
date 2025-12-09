import React from "react";
import StatusBadge from "../StatusBadge";
import { Trash2 } from "lucide-react";
import { PrayerRequest, Status } from "../../types";

interface RequestTableProps {
  requests: PrayerRequest[];
  updateRequestStatus: (id: number, status: Status) => void;
  deleteRequest: (id: number) => void;
}

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
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Student
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Request
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              School
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Status
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Priority
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Actions
            </th>
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
                  <p className="font-medium text-gray-900">{request.name}</p>
                  <p className="text-sm text-gray-600">{request.studentId}</p>
                </div>
              </td>
              <td className="py-3 px-4 lg:w-1/2">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {request.request}
                </p>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-500">{request.school}</p>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={request.status} />
              </td>
              <td className="py-3 px-4">
                <span className="text-sm font-medium capitalize text-gray-500">
                  {request.priority}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <select
                    value={request.status}
                    onChange={(e) =>
                      updateRequestStatus(request.id, e.target.value as Status)
                    }
                    className="text-sm border border-gray-300 rounded px-1.5 py-1 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>
                  <button
                    onClick={() => deleteRequest(request.id)}
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
