"use client";

import StatusBadge from "../StatusBadge";
import { Trash2, MoreHorizontal, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { PrayerRequestResponse, StatusOptions } from "../../lib/types";
import Button from "../Button";

const getPriorityColor = (priority: string) => {
  switch (priority.toUpperCase()) {
    case "HIGH":
      return "text-red-700 font-semibold";
    case "MEDIUM":
      return "text-yellow-600 font-medium";
    case "LOW":
      return "text-green-700";
    default:
      return "text-gray-700";
  }
};

type ColumnsProps = {
  updateRequestStatus: (id: number, status: StatusOptions) => void;
  deleteRequest: (id: number) => void;
};

export const createColumns = ({
  updateRequestStatus,
  deleteRequest,
}: ColumnsProps): ColumnDef<PrayerRequestResponse>[] => [
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => {
      const name = row.original.name;
      const studentId = row.original.studentId;
      const createdBy = row.original.createdBy;

      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900 break-words">
            {name || `${createdBy?.firstName} ${createdBy?.lastName}` || "N/A"}
          </p>
          {studentId && (
            <p className="text-xs text-gray-600">{studentId}</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "request",
    header: "Request",
    cell: ({ row }) => {
      const request = row.getValue("request") as string;
      return (
        <div className="max-w-xs sm:max-w-md min-w-0">
          <p className="text-sm text-gray-700 break-words line-clamp-2 sm:line-clamp-2">
            {request}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "school",
    header: "School",
    cell: ({ row }) => {
      const school = row.getValue("school") as string | null;
      return (
        <p className="text-sm text-gray-500">{school || "N/A"}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as StatusOptions;
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <span className={`text-sm capitalize ${getPriorityColor(priority)}`}>
          {priority.toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "assignedMentor",
    header: "Mentor",
    cell: ({ row }) => {
      const mentor = row.original.assignedMentor;
      return (
        <p className="text-sm text-gray-600">
          {mentor?.name || "Unassigned"}
        </p>
      );
    },
  },
  {
    accessorKey: "prayedByUsers",
    header: "Prayed By",
    cell: ({ row }) => {
      const prayedBy = row.original.prayedByUsers || [];
      return (
        <p className="text-sm text-gray-600">
          {prayedBy.length} {prayedBy.length === 1 ? "person" : "people"}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const request = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      const handleDelete = () => {
        deleteRequest(request.id);
        setShowDeleteDialog(false);
      };

      return (
        <>
          <div className="flex items-center gap-2 min-w-0">
            <Select
              value={request.status || "PENDING"}
              onValueChange={(value) =>
                updateRequestStatus(request.id, value as StatusOptions)
              }
            >
              <SelectTrigger className="w-32.5 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="FULFILLED">Fulfilled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type='button'
              className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteDialog && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl md:max-w-2xl sm:max-w-sm transform transition-all animate-in scale-in-95 duration-200 my-8">
                {/* Header - Danger Theme */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-t-xl">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-red-500/30 rounded-lg flex-shrink-0">
                      <AlertTriangle className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-white">Delete Prayer Request</h2>
                      <p className="text-red-100 text-xs sm:text-sm mt-1">This action cannot be undone</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="text-red-100 hover:text-white transition p-1 hover:bg-red-500/20 rounded flex-shrink-0"
                    >
                      <X className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                  </div>
                </div>

                {/* Warning Banner */}
                <div className="bg-red-50 border-l-4 border-red-600 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-red-900 text-sm sm:text-base mb-1">Warning</h3>
                      <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                        Deleting this prayer request will permanently remove it from the system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-gray-50 border-b space-y-4 sm:space-y-5 max-h-64 sm:max-h-72 md:max-h-80 overflow-y-auto">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Student Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 mt-1 sm:mt-2 break-words">
                      {request.name || `${request.createdBy?.firstName} ${request.createdBy?.lastName}` || "N/A"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Prayer Request</p>
                    <p className="text-xs sm:text-sm text-gray-700 mt-1 sm:mt-2 leading-relaxed break-words whitespace-normal">
                      {request.request}
                    </p>
                  </div>
                </div>

                {/* Confirmation Text */}
                <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-white">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Are you absolutely sure? This action cannot be reversed.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 md:p-8 bg-white rounded-b-xl border-t">
                  <Button
                    type="button"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm md:text-base"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 text-xs sm:text-sm md:text-base whitespace-nowrap"
                    onClick={handleDelete}
                  >
                    <Trash2 className="inline mr-1 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
];