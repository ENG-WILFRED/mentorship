"use client";
import React from "react";
import MentorshipHeader from "../../../components/MentorshipHeader";
import Footer from "../../../components/Footer";
import { schools, mentors, missions, programs, reports, media, plans } from "../../data";

export default function DashboardPage() {
  // Dummy data (same as yours)

  const totalMissions = missions.length;
  const totalSchools = schools.length;
  const totalStudents = schools.reduce((a: number, s: typeof schools[0]) => a + s.students, 0);
  const nextMission = missions.find((m: typeof missions[0]) => m.status === "Upcoming");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
      <MentorshipHeader />
      <main className="flex-1 w-full px-2 md:px-8 lg:px-16 py-6">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon="✅" label="Total Missions" value={totalMissions} />
          <StatCard icon="🏫" label="Schools Reached" value={totalSchools} />
          <StatCard icon="👥" label="Students Impacted" value={totalStudents} />
          <StatCard icon="📅" label="Next Mission" value={nextMission ? nextMission.date : "-"} />
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Mission Timeline</h2>
          <div className="border-l-4 border-purple-300 pl-6">
            {missions.map((m: typeof missions[0], i: number) => (
              <div key={i} className="mb-6 relative">
                <div className="absolute -left-7 top-2 w-4 h-4 bg-purple-400 rounded-full border-2 border-white"></div>
                <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-purple-700">{m.date}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${m.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{m.status}</span>
                  </div>
                  <div className="text-gray-700 mb-1">Schools: {m.schools.join(", ")}</div>
                  <div className="text-gray-600 text-sm">Topic: {m.topic} | Mentors: {m.mentors.join(", ")}</div>
                  <div className="text-gray-600 text-sm">Students: {m.students}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12 flex gap-4 flex-wrap">
          <ActionButton label="New Mission" />
          <ActionButton label="view Schools" />
          <ActionButton label="View Mentors" />
          <ActionButton label="Upload Report" />
        </section>

        {/* Schools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Schools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {schools.map((s: typeof schools[0], i: number) => (
              <SchoolCard key={i} school={s} />
            ))}
          </div>
        </section>

        {/* Mentors */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Mentors</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {mentors.map((m: typeof mentors[0], i: number) => (
              <MentorCard key={i} mentor={m} />
            ))}
          </div>
        </section>

        {/* Programs */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Programs & Topics</h2>
          <div className="flex gap-4 flex-wrap">
            {programs.map((p: string, i: number) => (
              <span key={i} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold shadow-sm">{p}</span>
            ))}
          </div>
        </section>

        {/* Reports */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Mission Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reports.map((r: typeof reports[0], i: number) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6">
                <div className="font-bold text-purple-700 mb-1">{r.school} ({r.date})</div>
                <div className="text-gray-700 mb-1">Topic: {r.topic}</div>
                <div className="text-gray-600 text-sm">Students: {r.students}</div>
                <div className="text-gray-600 mt-2">Outcome: {r.outcome}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery - improved background and less brightness */}
        <section className="mb-12 relative">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Mission Gallery</h2>
          <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-purple-900/60 via-indigo-900/40 to-pink-900/60 opacity-70 rounded-2xl blur-sm"></div>
          <div className="flex gap-8 flex-wrap justify-center py-6">
            {media.map((m: typeof media[0], i: number) => (
              <div key={i} className="bg-white/60 border border-purple-300 rounded-xl shadow-lg p-2 w-56 flex flex-col items-center hover:scale-105 transition-transform backdrop-blur-md">
                <img src={m.url} alt={m.caption} className="w-52 h-36 object-cover rounded-lg mb-2 shadow" />
                <span className="text-xs text-purple-900 text-center font-medium drop-shadow">{m.caption}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Future Plans */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Upcoming Missions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((p: typeof plans[0], i: number) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6">
                <div className="font-bold text-purple-700 mb-1">{p.school} ({p.date})</div>
                <div className="text-gray-700 mb-1">Topic: {p.topic}</div>
                <div className="text-gray-600 text-sm">Mentors: {p.mentors.join(", ")}</div>
                <div className="text-gray-600 mt-2">Goal: {p.goal}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* COMPONENTS */
function StatCard({ icon, label, value }: { icon: string; label: string; value: any }) {
  return (
    <div className="bg-white/70 border border-purple-200 rounded-xl shadow flex flex-col items-center py-6 px-4">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-bold text-purple-800 text-lg">{value}</span>
      <span className="text-gray-700 text-sm">{label}</span>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;
  function handleClick() {
    if (label === "New Mission" && router) {
      router.push("/mentor/missions");
    } else if (label === "view Schools" && router) {
      router.push("/mentor/schools");
    } else if (label === "View Mentors" && router) {
      router.push("/mentor/mentors");
    }
  }
  return (
    <button
      className="bg-gradient-to-r from-purple-700 to-pink-700 text-white font-bold py-2 px-6 rounded-lg shadow hover:opacity-90 transition-transform hover:scale-105"
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

function SchoolCard({ school }: { school: any }) {
  return (
    <div className="bg-white/70 border border-purple-200 rounded-2xl shadow-xl p-6 flex flex-col gap-2 hover:scale-105 transition-transform">
      <div className="flex items-center gap-3 mb-2">
        {school.logo ? (
          <img src={school.logo} alt={school.name} className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">🏫</div>
        )}
        <h3 className="text-lg font-bold text-purple-800">{school.name}</h3>
      </div>
      <p className="text-gray-700">Location: {school.location}</p>
      <p className="text-gray-600 text-sm">Contact: {school.contact}</p>
      <p className="text-gray-600 text-sm">Students: {school.students}</p>
    </div>
  );
}

function MentorCard({ mentor }: { mentor: any }) {
  return (
    <div className="bg-white/70 border border-purple-200 rounded-2xl shadow-xl p-6 flex flex-col items-center w-64 hover:scale-105 transition-transform">
      <img src={mentor.img} alt={mentor.name} className="w-20 h-20 rounded-full border-2 border-purple-400 mb-3 shadow-md object-cover" />
      <h3 className="text-xl font-bold text-purple-800 mb-1">{mentor.name}</h3>
      <p className="text-gray-700 text-center">{mentor.role}</p>
      <p className="text-gray-600 text-sm">Phone: {mentor.phone}</p>
      <p className="text-gray-600 text-sm">Missions: {mentor.missions}</p>
    </div>
  );
}
