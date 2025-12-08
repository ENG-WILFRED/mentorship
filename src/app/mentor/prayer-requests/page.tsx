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
        {view === "requests" ? <PrayerRequestsView /> : <PrayerAdminDashboard />}
      </div>

      {/* Floating Toggle */}
      <div className="fixed bottom-6 right-6 flex bg-white rounded-full shadow-lg overflow-hidden border border-gray-200">
        <Button
         type='button'
          onClick={() => setView("requests")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            view === "requests"
              ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Student View
        </Button>
        <Button
        type='button'
          onClick={() => setView("admin")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            view === "admin"
              ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Admin Dashboard
        </Button>
      </div>
    </div>
  );
}
