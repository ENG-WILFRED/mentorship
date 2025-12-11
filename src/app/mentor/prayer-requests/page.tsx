"use client";

import { useState } from "react";
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
          <PrayerAdminDashboard setView={setView} />
        )}
      </div>

      {/* Floating Toggle - switch content and visibility based on view */}
      <div className={`fixed bottom-6 right-6 z-50`}>
        <Button
          type="button"
          onClick={() => setView(view === "requests" ? "admin" : "requests")}
          className={`px-4 py-2 font-medium text-sm rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white
      ${view === "requests" ? "flex" : "hidden md:flex"}
    `}
        >
          {view === "requests" ? "Admin Dashboard" : "Student View"}
        </Button>
      </div>
    </div>
  );
}
