"use client";

import StatusBadge from "../StatusBadge";
import { Trash2, MoreHorizontal } from "lucide-react";

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
          <p className="text-sm font-medium text-gray-900">
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
        <div className="max-w-md">
          <p className="text-sm text-gray-700 line-clamp-2">{request}</p>
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

      return (
        <div className="flex items-center gap-2">
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
            onClick={() => deleteRequest(request.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];