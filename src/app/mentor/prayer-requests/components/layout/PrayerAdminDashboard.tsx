"use client";

import React, { useState } from "react";
import SideBar from "../admin/SideBar";
import Button from "../Button";
import { TabsOptions } from "../../lib/types";
import Settings from "../admin/tabs/Settings";
import LoadingSpinner from "../LoadingSpinner";
import {
  usePrayerRequests,
  usePrayerStats,
  useUpdatePrayerRequest,
  useRemovePrayer,
} from "@/app/mentor/prayer-requests/hooks";
import DashboardTab from "../admin/tabs/DashboardTab";
import AnalyticsTab from "../admin/AnalyticsStats";
import RequestsTab from "../admin/tabs/RequestsTab";

type ViewType = "requests" | "admin";

interface PrayerAdminDashboardProps {
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  currentUserId?: number;
  filterByUserId?: number;
  filterByMentorId?: number;
}

export default function PrayerAdminDashboard({
  setView,
  currentUserId,
  filterByUserId,
  filterByMentorId,
}: PrayerAdminDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabsOptions>("dashboard");

  // ==================== CENTRALIZED HOOKS ====================

  // Fetch prayer statistics
  const { stats, isLoading: statsLoading } = usePrayerStats({
    userId: filterByUserId,
    mentorId: filterByMentorId,
  });

  // Fetch all prayer requests
  const { data: requests, isLoading: requestsLoading } = usePrayerRequests({
    status: "all",
    createdById: filterByUserId,
    assignedMentorId: filterByMentorId,
    includePrayedBy: true,
  });

  // Update prayer request mutation
  const { updatePrayerRequest, isLoading: isUpdating } =
    useUpdatePrayerRequest();

  // Remove prayer mutation
  const { removePrayer, isLoading: isRemoving } = useRemovePrayer();

  // ==================== HANDLERS ====================

  const handleUpdateStatus = (id: number, status: string) => {
    updatePrayerRequest({ id, status: status as any });
  };

  const handleDeleteRequest = (prayerRequestId: number) => {
    if (!currentUserId) {
      console.error("No current user ID provided");
      return;
    }

    removePrayer({
      prayerRequestId,
      userId: currentUserId,
    });
  };

  // ==================== LOADING & ERROR STATES ====================

  const isLoading = statsLoading || requestsLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Get pending count for notification badge
  const pendingCount = stats?.pending || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Sidebar */}
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        setView={setView}
      />

      {/* Main Content */}
      <div
        className={`
          flex-1 transition-all duration-300
          ${sidebarCollapsed ? "md:ml-16" : "md:ml-60"}
        `}
      >
        {/* Header */}
        <header className="bg-white border-b px-6 py-4.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 capitalize">
              {activeTab} {activeTab === "requests" && "Management"}
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="/mentor/dashboard"
                className="
                  flex items-center justify-center space-x-2
                  bg-gray-100 hover:bg-gray-200 text-gray-700
                  px-3 py-2 rounded-lg font-medium text-xs sm:text-sm
                  transition-all
                "
              >
                <span>← Back to Dashboard</span>
              </a>
              <Button
                type="button"
                className="
                  flex items-center space-x-2
                  bg-linear-to-r from-purple-600 to-pink-600 text-white
                  px-3 py-2 rounded-lg font-medium text-xs sm:text-sm
                  hover:from-purple-700 hover:to-pink-700 transition-all
                "
              >
                <span>Notification {pendingCount}</span>
              </Button>
              <span className="text-gray-700 text-sm sm:text-base">Admin</span>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="px-6 py-4">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <DashboardTab
              stats={stats}
              requests={requests?.slice(0, 5) || []}
              updateRequestStatus={handleUpdateStatus}
              deleteRequest={handleDeleteRequest}
              isLoading={isLoading}
            />
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <RequestsTab
              requests={requests || []}
              updateRequestStatus={handleUpdateStatus}
              deleteRequest={handleDeleteRequest}
            />
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 md:p-8">
              <Settings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
