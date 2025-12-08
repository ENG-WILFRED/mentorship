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

export default function SideBar({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
}: SideBarProps) {
  const tabs: {
    key: Tabs;
    name: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[] = [
    { key: "dashboard", name: "Dashboard", Icon: TrendingUp },
    { key: "requests", name: "Requests", Icon: Heart },
    { key: "analytics", name: "Analytics", Icon: Activity },
    { key: "settings", name: "Settings", Icon: Settings },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-full z-20 flex flex-col
        bg-white shadow-lg border-r transition-all duration-300
        ${sidebarCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Branding */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 p-2 rounded-lg shrink-0">
            <Heart className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">Prayer Admin</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Mentorship System
              </p>
            </div>
          )}
        </div>
        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded focus:outline-none cursor-pointer"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              w-full flex items-center
              ${sidebarCollapsed ? "justify-center" : "justify-start"}
              px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-colors
              rounded-r-lg
              ${
                activeTab === tab.key
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {/* Tab Icon */}
            <span className={`shrink-0 ${sidebarCollapsed ? "" : "mr-3"}`}>
              <tab.Icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </span>

            {/* Tab Label */}
            {!sidebarCollapsed && <span>{tab.name}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
