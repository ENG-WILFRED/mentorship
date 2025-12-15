import React from "react";
import MentorshipHeader from "../../../components/MentorshipHeader";
import Footer from "../../../components/Footer";
import DashboardClient from "../DashboardClient";
import { getSermons } from "@/actions/sermons";
import { getDashboardData } from "@/actions/dashboard";
import { programs, media, plans } from "../../data";

export default async function DashboardPage() {
  const [sermons, dashboardData] = await Promise.all([
    getSermons(),
    getDashboardData(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
      <MentorshipHeader />
      <DashboardClient 
        sermons={sermons}
        schools={dashboardData.schools}
        mentors={dashboardData.mentors}
        missions={dashboardData.missions}
        programs={programs}
        reports={dashboardData.reports}
        media={media}
        plans={plans}
        prayerRequests={dashboardData.prayerRequests}
        transactions={dashboardData.transactions || []}
      />
      <Footer />
    </div>
  );
}
