"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import { getAccessToken } from "../../lib/auth";
import { MediaUpload } from "@/components/MediaGallery/MediaUpload";
import MediaGallery from "../../components/MediaGallery/index";

interface Sermon {
  id: number;
  title: string;
  description?: string | null;
  author?: string | null;
  topic?: string | null;
  youtubeId?: string | null;
  videoUrl?: string | null;
  createdAt?: Date;
}

interface DashboardClientProps {
  sermons: Sermon[];
  schools: any[];
  mentors: any[];
  missions: any[];
  programs: string[];
  reports: any[];
  media: any[];
  plans: any[];
}

export default function DashboardClient({
  sermons,
  schools,
  mentors,
  missions,
  programs,
  reports,
  media,
  plans,
}: DashboardClientProps) {
  const router = useRouter();
  const { role, user } = useAuthContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Check authentication on mount and redirect if needed
  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      if (!token) {
        router.push("/auth/login");
      } else {
        setIsInitialized(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const totalMissions = missions.length;
  const totalSchools = schools.length;
  const totalStudents = schools.reduce((a: number, s: { students: number }) => a + s.students, 0);
  const nextMission = missions.find((m: { status: string }) => m.status === "Upcoming");

  // Handle Media Upload from page upload form
  async function handleUpload(mediaData: any) {
    try {
      setUploadLoading(true);
      const token = getAccessToken();
      if (!token) {
        alert("Please login to upload media");
        return;
      }
      const res = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mediaData),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Upload failed");
      } else {
        alert("Upload successful");
      }
      return result;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
      throw err;
    } finally {
      setUploadLoading(false);
    }
  }

  return (
    <main className="flex-1 w-full px-2 md:px-8 lg:px-16 py-6">
      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon="✅" label="Total Missions" value={totalMissions} />
        <StatCard icon="🏫" label="Schools Reached" value={totalSchools} />
        <StatCard icon="👥" label="Students Impacted" value={totalStudents} />
        <StatCard icon="📅" label="Next Mission" value={nextMission ? nextMission.date : "-"} />
      </section>

      {user && <MediaUpload userId={user.id} onUpload={handleUpload} />}

      <section className="mb-12">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Mission Timeline</h2>
        <div className="border-l-4 border-purple-300 pl-6">
          {missions.map((m: { date: string; status: string; schools: string[]; topic: string; mentors: string[]; students: number }, i: number) => (
            <div key={i} className="mb-6 relative">
              <div className="absolute -left-7 top-2 w-4 h-4 bg-purple-400 rounded-full border-2 border-white"></div>
              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-purple-700">{m.date}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${m.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {m.status}
                  </span>
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
        <ActionButton label="New Mission" router={router} />
        <ActionButton label="View Schools" router={router} />
        <ActionButton label="View Mentors" router={router} />
        <ActionButton label="View Sermons" router={router} />
        <ActionButton label="Upload Report" router={router} />
        <ActionButton label="Prayer Requests" router={router} />
      </section>

      {/* Schools */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Schools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {schools.map((s: any, i: number) => (
            <SchoolCard key={i} school={s} />
          ))}
        </div>
      </section>

      {/* Mentors */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Mentors</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {mentors.map((m: any, i: number) => (
            <MentorCard key={i} mentor={m} />
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Programs & Topics</h2>
        <div className="flex gap-4 flex-wrap">
          {programs.map((p: string, i: number) => (
            <span key={i} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold shadow-sm">
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Sermons - Real Data */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">Latest Sermons</h2>
          <button onClick={() => window.location.href = "/mentor/sermons"} className="text-purple-600 hover:text-purple-800 font-semibold text-sm">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.slice(0, 3).map((sermon) => (
            <div key={sermon.id} className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer hover:scale-105 transform">
              <div className="h-40 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-5xl">🎙️</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-2">{sermon.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  By {sermon.author || "Unknown"} • {sermon.createdAt ? new Date(sermon.createdAt).toLocaleDateString() : "Recently"}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{sermon.description || "A powerful sermon message."}</p>
                <button onClick={() => window.location.href = `/mentor/sermons/${sermon.id}`} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all">
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {sermons.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No sermons available yet.</p>
          </div>
        )}
      </section>

      {/* Reports */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Mission Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports.map((r: any, i: number) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6">
              <div className="font-bold text-purple-700 mb-1">
                {r.school} ({r.date})
              </div>
              <div className="text-gray-700 mb-1">Topic: {r.topic}</div>
              <div className="text-gray-600 text-sm">Students: {r.students}</div>
              <div className="text-gray-600 mt-2">Outcome: {r.outcome}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-purple-700 mb-4">Media Upload</h2>
        {user && <MediaUpload userId={user.id} onUpload={handleUpload} />}
      </section>

      {/* Media Gallery */}
      <MediaGallery title="Mission Gallery" showFilters={true} showStats={true} />

      {/* Future Plans */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Upcoming Missions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((p: any, i: number) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6">
              <div className="font-bold text-purple-700 mb-1">
                {p.school} ({p.date})
              </div>
              <div className="text-gray-700 mb-1">Topic: {p.topic}</div>
              <div className="text-gray-600 text-sm">Mentors: {p.mentors.join(", ")}</div>
              <div className="text-gray-600 mt-2">Goal: {p.goal}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-gray-600 text-sm font-semibold">{label}</div>
      <div className="text-2xl font-bold text-purple-700 mt-1">{value}</div>
    </div>
  );
}

function ActionButton({ label, router }: { label: string; router: any }) {
  const handleClick = () => {
    const routes: { [key: string]: string } = {
      "New Mission": "/mentor/missions",
      "View Schools": "/mentor/schools",
      "View Mentors": "/mentor/mentors",
      "View Sermons": "/mentor/sermons",
      "Upload Report": "/mentor/report/upload",
      "Prayer Requests": "/mentor/prayer-requests",
    };
    
    const route = routes[label];
    if (route) {
      router.push(route);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl cursor-pointer"
    >
      {label}
    </button>
  );
}

function SchoolCard({ school }: { school: { name: string; principal: string; students: number; location: string } }) {
  return (
    <div className="bg-white/80 border border-purple-200 rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition-transform">
      <div className="text-4xl mb-2">🏫</div>
      <h3 className="text-lg font-bold text-purple-800 mb-1">{school.name}</h3>
      <p className="text-gray-700 text-sm mb-3">Principal: {school.principal}</p>
      <p className="text-gray-600 text-sm mb-1">Students: {school.students}</p>
      <p className="text-gray-600 text-sm">Location: {school.location}</p>
    </div>
  );
}

function MentorCard({ mentor }: { mentor: { img: string; name: string; role: string; phone: string; missions?: string | number } }) {
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
