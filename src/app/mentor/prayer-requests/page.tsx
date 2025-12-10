"use client";

import React, { useState } from "react";
import PrayerRequestsView from "./components/layout/PrayerRequestsView";
import PrayerAdminDashboard from "./components/layout/PrayerAdminDashboard";
import Button from "./components/Button";

export default function App() {
  const [view, setView] = useState<"requests" | "admin">("requests");

  return (
    <div className="font-sans min-h-screen relative">
      {/* Main View */}
      <div className="transition-all duration-300">
        {view === "requests" ? (
          <PrayerRequestsView />
        ) : (
          <PrayerAdminDashboard />
        )}
      </div>

      {/* Floating Toggle */}
      <div
        className="fixed bottom-6 right-6 flex bg-white rounded-full shadow-lg overflow-hidden border border-gray-200 z-50"
        style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Button
          type="button"
          onClick={() => setView(view === "requests" ? "admin" : "requests")}
          className={`px-4 py-2 font-medium text-sm transition-colors rounded-full ${
            view === "requests"
              ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
              : "bg-linear-to-r from-purple-600 to-pink-600 text-white"
          }`}
        >
          {view === "requests" ? "Admin Dashboard" : "Student View"}
        </Button>
      </div>
    </div>
  );
}
