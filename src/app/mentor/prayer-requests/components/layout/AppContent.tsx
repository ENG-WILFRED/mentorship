import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PrayerRequestsView from "./PrayerRequestsView";
import PrayerAdminDashboard from "./PrayerAdminDashboard";
import Button from "../Button";

type ViewType = "requests" | "admin";

export default function AppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rememberView =
    typeof window !== "undefined"
      ? localStorage.getItem("rememberView") === "true"
      : false;

  const [activeView, setActiveView] = useState(() => {
    const usrlSection = searchParams?.get("view") as ViewType | null;
    if (usrlSection) return usrlSection;

    if (rememberView) {
      const saved = localStorage.getItem("activeView") as ViewType | null;
      if (saved) return saved;
    }

    return "requests";
  });

  // Sync to
  useEffect(() => {
    // Local Storage
    if (rememberView) {
      localStorage.setItem("activeView", activeView);
    }

    // URL params
    const params = new URLSearchParams(window.location.search);
    params.set("view", activeView);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [activeView, rememberView, router]);

  return (
    <div className="font-sans min-h-screen relative">
      {/* Main View */}
      <div className="transition-all duration-300">
        {activeView === "requests" ? (
          <PrayerRequestsView />
        ) : (
          <PrayerAdminDashboard setView={setActiveView} />
        )}
      </div>

      {/* Floating Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          type="button"
          onClick={() =>
            setActiveView(activeView === "requests" ? "admin" : "requests")
          }
          className={`px-4 py-2 font-medium text-sm rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white
            ${activeView === "requests" ? "flex" : "hidden md:flex"}
          `}
        >
          {activeView === "requests" ? "Admin Dashboard" : "Student View"}
        </Button>
      </div>
    </div>
  );
}
