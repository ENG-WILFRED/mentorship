import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Heart,
  Activity,
  Settings,
} from "lucide-react";
import { Tabs } from "../../types";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: Tabs) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/**
 * Sidebar Component
 * Displays a sidebar for the admin dashboard.
 */

export default function SideBar({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
}: SideBarProps) {
  const tabs: { key: Tabs; name: string }[] = [
    { key: "dashboard", name: "Dashboard" },
    { key: "requests", name: "Requests" },
    { key: "analytics", name: "Analytics" },
    { key: "settings", name: "Settings" },
  ];

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-64"
      } bg-white shadow-lg border-r transition-all duration-300 fixed h-full z-10`}
    >
      <div className="p-4 border-b">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Prayer Admin</h1>
              <p className="text-xs text-gray-600">Mentorship System</p>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="w-full p-4 text-gray-600 hover:bg-gray-50 border-b"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-5 w-5 mx-auto" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
      {!sidebarCollapsed && (
        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                activeTab === tab.key
                  ? "bg-purple-50 text-purple-700 border-r-2 border-purple-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.key === "dashboard" && (
                <TrendingUp className="h-5 w-5 text-purple-600" />
              )}
              {tab.key === "requests" && (
                <Heart className="h-5 w-5 text-purple-600" />
              )}
              {tab.key === "analytics" && (
                <Activity className="h-5 w-5 text-purple-600" />
              )}
              {tab.key === "settings" && (
                <Settings className="h-5 w-5 text-purple-600" />
              )}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
