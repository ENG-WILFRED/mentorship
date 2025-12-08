"use client";

import React, { useState } from "react";
import PrayerRequestsView from "./components/layout/PrayerRequestsView";
import PrayerAdminDashboard from "./components/layout/PrayerAdminDashboard";

export default function App() {
  // State to toggle between student and admin views
  const [view, setView] = useState("requests"); // 'requests' or 'admin'

  return (
    <div className="font-sans">
      {/* Render the selected view component */}
      {view === "requests" ? <PrayerRequestsView /> : <PrayerAdminDashboard />}
      {/* Navigation Toggle Button */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4 shadow-lg border">
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="bg-transparent text-white font-medium focus:ring-2 focus:ring-white focus:ring-offset-2 border-none text-sm"
        >
          <option value="requests" className="bg-white text-gray-900">
            Student View
          </option>
          <option value="admin" className="bg-white text-gray-900">
            Admin Dashboard
          </option>
        </select>
      </div>
    </div>
  );
}
