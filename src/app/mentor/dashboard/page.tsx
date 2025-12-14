import React from "react";
import MentorshipHeader from "../../../components/MentorshipHeader";
import Footer from "../../../components/Footer";
import DashboardClient from "../DashboardClient";
import { getSermons } from "@/actions/sermons";
import { schools, mentors, missions, programs, reports, media, plans } from "../../data";

export default async function DashboardPage() {
  const sermons = await getSermons();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
      <MentorshipHeader />
      <DashboardClient 
        sermons={sermons}
        schools={schools}
        mentors={mentors}
        missions={missions}
        programs={programs}
        reports={reports}
        media={media}
        plans={plans}
      />
      <Footer />
    </div>
  );
}
