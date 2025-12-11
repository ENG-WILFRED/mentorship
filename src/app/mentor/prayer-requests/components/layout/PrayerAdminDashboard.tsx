import React, { useEffect, useState } from "react";
import { Activity, CheckCircle, Heart, TrendingUp, Users } from "lucide-react";
import SideBar from "../admin/SideBar";
import Button from "../Button";
import AdminStatCard from "../AdminStatCard";
import RequestTable from "../admin/RequestTable";
import ProgressBar from "../admin/ProgressBar";
import { PrayerRequest, StatusOptions, TabsOptions } from "../../lib/types";
import Settings from "../admin/Settings";
import { fetchPrayerRequests } from "@/actions/prayer/fetchPrayerRequests";

interface Stats {
  totalRequests: number;
  pending: number;
  inProgress: number;
  fulfilled: number;
  totalPrayed: number;
  totalStudents: number;
}

interface PrayerAdminDashboardProps {
  setView: React.Dispatch<React.SetStateAction<"requests" | "admin">>;
}

/**
 * Prayer Admin Dashboard Component
 * Administrative dashboard for managing prayer requests.
 */
export default function PrayerAdminDashboard({
  setView,
}: PrayerAdminDashboardProps) {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [activeTab, setActiveTab] = useState<TabsOptions>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch prayer requests from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRequests = await fetchPrayerRequests({});
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching prayer requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const stats = {
      totalRequests: requests.length,
      pending: requests.filter((r) => r.status === "PENDING").length,
      inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
      fulfilled: requests.filter((r) => r.status === "FULFILLED").length,
      totalPrayed: requests.reduce(
        (sum, req) => sum + (req.prayedBy ?? []).length,
        0
      ),
      totalStudents: new Set(requests.map((r) => r.studentId)).size,
    };

    setStats(stats);
  }, [requests]);

  const updateRequestStatus = (id: number, newStatus: StatusOptions) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const deleteRequest = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

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
          <div className="flex flex-row items-center justify-between gap-3">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 capitalize">
              {activeTab} {activeTab === "requests" && "Management"}
            </h2>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                className="
                  flex items-center space-x-2
                  bg-linear-to-r from-purple-600 to-pink-600 text-white
                  px-3 py-2 rounded-lg font-medium text-xs sm:text-sm
                  hover:from-purple-700 hover:to-pink-700 transition-all
                "
              >
                <span>
                  Notification{" "}
                  {requests.filter((r) => r.status === "PENDING").length}
                </span>
              </Button>
              <span className="text-gray-700 text-sm sm:text-base">Admin</span>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="px-6 py-4">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                <AdminStatCard
                  title="Total Students"
                  value={stats.totalStudents}
                  icon={Users}
                  colorClass="text-purple-600"
                  iconBgClass="bg-purple-100"
                />
                <AdminStatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  icon={Heart}
                  colorClass="text-purple-600"
                  iconBgClass="bg-purple-100"
                />
                <AdminStatCard
                  title="Pending"
                  value={stats.pending}
                  icon={Activity}
                  colorClass="text-yellow-600"
                  iconBgClass="bg-yellow-100"
                />
                <AdminStatCard
                  title="In Progress"
                  value={stats.inProgress}
                  icon={TrendingUp}
                  colorClass="text-blue-600"
                  iconBgClass="bg-blue-100"
                />
                <AdminStatCard
                  title="Fulfilled"
                  value={stats.fulfilled}
                  icon={CheckCircle}
                  colorClass="text-green-600"
                  iconBgClass="bg-green-100"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4">
                    Recent Prayer Requests
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <RequestTable
                    requests={requests.slice(0, 5)}
                    updateRequestStatus={updateRequestStatus}
                    deleteRequest={deleteRequest}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="overflow-x-auto">
                <RequestTable
                  requests={requests}
                  updateRequestStatus={updateRequestStatus}
                  deleteRequest={deleteRequest}
                />
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && stats && (
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 md:p-8">
              <ProgressBar
                label="Pending"
                value={stats.pending}
                colorClass="bg-purple-500"
              />
              <ProgressBar
                label="In Progress"
                value={stats.inProgress}
                colorClass="bg-blue-500"
              />
              <ProgressBar
                label="Fulfilled"
                value={stats.fulfilled}
                colorClass="bg-green-500"
              />
            </div>
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
