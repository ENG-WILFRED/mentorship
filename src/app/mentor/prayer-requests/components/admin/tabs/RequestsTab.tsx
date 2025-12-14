"use client";

import React, { useState } from "react";
import { createColumns } from "../columns";
import { PrayerRequestResponse } from "../../../lib/types";
import DataTable from "../data-table";

interface RequestsTabProps {
  requests: PrayerRequestResponse[];
  updateRequestStatus: (id: number, status: string) => void;
  deleteRequest: (id: number) => void;
}

export default function RequestsTab({
  requests,
  updateRequestStatus,
  deleteRequest,
}: RequestsTabProps) {
  // Create columns with handlers
  const columns = createColumns({
    updateRequestStatus,
    deleteRequest,
  });

  return (
    <div className="space-y-4">
      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
            All Prayer Requests ({requests.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          {requests.length > 0 ? (
            <DataTable
              columns={columns}
              data={requests}
              searchKey="assignedMentor"
              searchPlaceholder="Search Mentor"
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              No prayer requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
