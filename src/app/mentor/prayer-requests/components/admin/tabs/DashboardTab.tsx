"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { PrayerRequestResponse } from "../../../lib/types";
import ProgressBar from "../ProgressBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "../../Button";
import QuickActions from "../QuickActions";
import RecentActivity from "../RecentActivity";
import MentorStats from "../MentorStats";
import AnalyticsStats from "../AnalyticsStats";
import AdminStats from "../AdminStats";

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  fulfilled: number;
  totalStudents: number;
}

interface DashboardTabProps {
  stats: Stats | undefined;
  requests: PrayerRequestResponse[];
  updateRequestStatus: (id: number, status: string) => void;
  deleteRequest: (id: number) => void;
  isLoading?: boolean;
}

export default function DashboardTab({
  stats,
  requests,
  updateRequestStatus,
  deleteRequest,
  isLoading = false,
}: DashboardTabProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  // Get recent activity (last 5 requests)
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get top mentors (by assigned requests)
  const mentorStats = requests.reduce((acc, req) => {
    if (req.assignedMentor) {
      const mentorId = req.assignedMentor.id;
      if (!acc[mentorId]) {
        acc[mentorId] = {
          name: req.assignedMentor.name,
          count: 0,
          fulfilled: 0,
        };
      }
      acc[mentorId].count++;
      if (req.status === "FULFILLED") {
        acc[mentorId].fulfilled++;
      }
    }
    return acc;
  }, {} as Record<number, { name: string; count: number; fulfilled: number }>);

  const topMentors = Object.values(mentorStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Export data function
  const handleExportData = () => {
    const csvContent = [
      ["Date", "Name", "Request", "Status", "Priority", "School"],
      ...requests.map((req) => [
        new Date(req.date).toLocaleDateString(),
        req.name || "",
        req.request,
        req.status || "",
        req.priority || "",
        req.school || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prayer-requests-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and manage prayer requests
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onValueChange={(value: any) => setTimeRange(value)}
          >
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleExportData}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <AdminStats stats={stats} />

      {/* Analytics Stats */}
      <AnalyticsStats
        stats={stats}
        requests={requests}
        topMentors={topMentors}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <ProgressBar stats={stats} />

        {/* Top Mentors */}
        <MentorStats topMentors={topMentors} />
      </div>

      {/* Quick Actions */}
      <QuickActions handleExportData={handleExportData} />

      {/* Recent Activity */}
      <RecentActivity recentRequests={recentRequests} />
    </div>
  );
}
