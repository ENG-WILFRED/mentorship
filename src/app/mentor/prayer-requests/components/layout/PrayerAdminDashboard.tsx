import React, { useState } from "react";
import { data } from "../../constants/data";
import { Activity, CheckCircle, Heart, TrendingUp, Users } from "lucide-react";
import SideBar from "../admin/SideBar";
import Button from "../Button";
import AdminStatCard from "../AdminStatCard";
import RequestTable from "../admin/RequestTable";
import ProgressBar from "../admin/ProgressBar";
import { PrayerRequest, Status, Tabs } from "../../types";

interface Stats {
  totalRequests: number;
  pending: number;
  inProgress: number;
  fulfilled: number;
  totalPrayed: number;
  totalStudents: number;
}

/**
 * Prayer Admin Dashboard Component
 * Administrative dashboard for managing prayer requests.
 */
export default function PrayerAdminDashboard() {
  const [requests, setRequests] = useState<PrayerRequest[]>(data);
  const [activeTab, setActiveTab] = useState<Tabs>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats: Stats = {
    totalRequests: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    fulfilled: requests.filter((r) => r.status === "fulfilled").length,
    totalPrayed: requests.reduce((sum, req) => sum + req.prayedBy.length, 0),
    totalStudents: new Set(requests.map((r) => r.studentId)).size,
  };

  const updateRequestStatus = (id: number, newStatus: Status) => {
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
    <div className="min-h-screen bg-gray-50">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div
        className={`${
          sidebarCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300 pt-16`}
      >
        <header
          className="bg-white shadow-sm border-b p-4 fixed top-0 right-0 left-0 z-0"
          style={{ marginLeft: sidebarCollapsed ? "16px" : "64px" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab} {activeTab === "requests" && "Management"}
            </h2>
            <div className="flex items-center space-x-4">
              <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                <span>
                  Notification{" "}
                  {requests.filter((r) => r.status === "pending").length}
                </span>
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 mt-16">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Prayer Requests
                </h3>
                <RequestTable
                  requests={requests.slice(0, 5)}
                  updateRequestStatus={updateRequestStatus}
                  deleteRequest={deleteRequest}
                />
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <RequestTable
                requests={requests}
                updateRequestStatus={updateRequestStatus}
                deleteRequest={deleteRequest}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <ProgressBar
                label="Pending"
                value={stats.pending}
                colorClass="purple-500"
              />
              <ProgressBar
                label="In Progress"
                value={stats.inProgress}
                colorClass="blue-500"
              />
              <ProgressBar
                label="Fulfilled"
                value={stats.fulfilled}
                colorClass="green-500"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
