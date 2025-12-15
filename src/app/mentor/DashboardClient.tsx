"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import { getAccessToken } from "../../lib/auth";
import { useToast } from "@/components/Toast";
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
  prayerRequests: any[];
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
  prayerRequests,
}: DashboardClientProps) {
  const router = useRouter();
  const toast = useToast();
  const { role, user } = useAuthContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [selectedPrayerRequest, setSelectedPrayerRequest] = useState<any | null>(null);

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
  const totalStudents = schools.reduce((a: number, s: { population?: number }) => a + (s.population || 0), 0);
  const nextMission = missions.find((m: any) => {
    const st = String(m.status || "").toLowerCase();
    return st === "upcoming" || st === "upcoming".toLowerCase();
  });

  const handleViewAll = (section: string, path: string) => {
    setLoadingSection(section);
    toast(`Navigating to ${section}...`, "info");
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

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
        <StatCard icon="📅" label="Next Mission" value={nextMission ? new Date(nextMission.date).toLocaleDateString() : "-"} />
      </section>

      

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">Mission Timeline</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => handleViewAll('Missions', '/mentor/missions')}
              disabled={loadingSection === 'Missions'}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm disabled:opacity-60"
            >
              {loadingSection === 'Missions' ? '⏳ Loading...' : 'View All →'}
            </button>
          </div>
        </div>
        <div className="border-l-4 border-purple-300 pl-6">
          {missions.map((m: any, i: number) => (
            <div key={i} className="mb-6 relative">
              <div className="absolute -left-7 top-2 w-4 h-4 bg-purple-400 rounded-full border-2 border-white"></div>
              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-purple-700">{m.date ? new Date(m.date).toLocaleDateString() : '-'}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${String(m.status).toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {m.status}
                  </span>
                </div>
                <div className="text-gray-700 mb-1">Schools: {Array.isArray(m.schools) ? m.schools.map((ms: any) => ms.school?.name || '').filter(Boolean).join(', ') : ''}</div>
                <div className="text-gray-600 text-sm">Topic: {m.topic} | Mentors: {Array.isArray(m.mentors) ? m.mentors.map((mm: any) => mm.mentor?.name || '').filter(Boolean).join(', ') : ''}</div>
                <div className="text-gray-600 text-sm">Students: {m.students ?? '-'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Schools */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">Schools</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => handleViewAll('Schools', '/mentor/schools')}
              disabled={loadingSection === 'Schools'}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm disabled:opacity-60"
            >
              {loadingSection === 'Schools' ? '⏳ Loading...' : 'View All →'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {schools.map((s: any, i: number) => (
            <SchoolCard key={i} school={s} />
          ))}
        </div>
      </section>

      {/* Mentors */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">Mentors</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => handleViewAll('Mentors', '/mentor/mentors')}
              disabled={loadingSection === 'Mentors'}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm disabled:opacity-60"
            >
              {loadingSection === 'Mentors' ? '⏳ Loading...' : 'View All →'}
            </button>
          </div>
        </div>
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
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/mentor/sermons/upload-sermon')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm"
            >
              + Upload Sermon
            </button>
            <button 
              onClick={() => router.push('/mentor/sermons')} 
              className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
            >
              View All →
            </button>
          </div>
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
            <p className="text-gray-500 text-lg mb-6">No sermons available yet.</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => router.push('/mentor/dashboard')}
                className="px-5 py-3 bg-white/10 text-white border border-white/10 rounded-lg hover:bg-white/20 transition"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/mentor/sermons/upload-sermon')}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition"
              >
                Upload Sermon
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Reports */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">Mission Reports</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/mentor/report/upload')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm"
            >
              + Upload Report
            </button>
            <button 
              onClick={() => handleViewAll('Reports', '/mentor/report')}
              disabled={loadingSection === 'Reports'}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm disabled:opacity-60"
            >
              {loadingSection === 'Reports' ? '⏳ Loading...' : 'View All →'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports.map((r: any, i: number) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6">
              <div className="font-bold text-purple-700 mb-1">
                {r.school?.name ?? r.school ?? 'Unknown School'} ({r.date ? new Date(r.date).toLocaleDateString() : ''})
              </div>
              <div className="text-gray-700 mb-1">Topic: {r.topic}</div>
              <div className="text-gray-600 text-sm">Students: {r.students}</div>
              <div className="text-gray-600 mt-2">Outcome: {r.outcome}</div>
            </div>
          ))}
        </div>
      </section>

      {/* we are the button*/}
      

      {/* Media Gallery */}
      <MediaGallery title="Mission Gallery" showFilters={true} showStats={true} />

      {/* Prayer Requests */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">Prayer Requests</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => handleViewAll('Prayer Requests', '/mentor/prayer-requests')}
              disabled={loadingSection === 'Prayer Requests'}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm disabled:opacity-60"
            >
              {loadingSection === 'Prayer Requests' ? '⏳ Loading...' : 'View All →'}
            </button>
          </div>
        </div>
        {selectedPrayerRequest ? (
          <div className="bg-white/90 backdrop-blur-sm border-2 border-purple-300 rounded-xl shadow-lg p-6 mb-4">
            <button
              onClick={() => setSelectedPrayerRequest(null)}
              className="text-sm text-purple-600 hover:text-purple-800 mb-4 font-semibold"
            >
              ← Back to Prayer Requests
            </button>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">{selectedPrayerRequest.request}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedPrayerRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    selectedPrayerRequest.status === 'ANSWERED' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedPrayerRequest.status || 'PENDING'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedPrayerRequest.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                    selectedPrayerRequest.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedPrayerRequest.priority || 'MEDIUM'} Priority
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Category</p>
                  <p className="text-gray-800">{selectedPrayerRequest.category || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">School</p>
                  <p className="text-gray-800">{selectedPrayerRequest.school || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Requester</p>
                  <p className="text-gray-800">{selectedPrayerRequest.name || 'Anonymous'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Grade/Subject</p>
                  <p className="text-gray-800">{selectedPrayerRequest.grade ? `Grade: ${selectedPrayerRequest.grade}` : ''} {selectedPrayerRequest.subject ? `Subject: ${selectedPrayerRequest.subject}` : ''}</p>
                </div>
              </div>
              {selectedPrayerRequest.notes && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedPrayerRequest.notes}</p>
                </div>
              )}
              {selectedPrayerRequest.assignedMentor && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Assigned Mentor</p>
                  <p className="text-gray-800">{selectedPrayerRequest.assignedMentor.name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 font-semibold">Submitted</p>
                <p className="text-gray-700">{new Date(selectedPrayerRequest.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prayerRequests && prayerRequests.length > 0 ? (
              prayerRequests.slice(0, 6).map((pr: any, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedPrayerRequest(pr)}
                  className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-4 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-purple-700 flex-1 line-clamp-2">{pr.request}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 flex-shrink-0 ${
                      pr.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      pr.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {pr.priority || 'MEDIUM'}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm mb-2">Category: {pr.category || 'General'}</div>
                  {pr.school && <div className="text-gray-600 text-sm mb-2">School: {pr.school}</div>}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      pr.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      pr.status === 'ANSWERED' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {pr.status || 'PENDING'}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(pr.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No prayer requests yet</p>
              </div>
            )}
          </div>
        )}
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

function SchoolCard({ school }: { school: any }) {
  return (
    <div className="bg-white/80 border border-purple-200 rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition-transform">
      <div className="text-4xl mb-2">🏫</div>
      <h3 className="text-lg font-bold text-purple-800 mb-1">{school.name}</h3>
      <p className="text-gray-700 text-sm mb-3">Contact: {school.contact ?? '—'}</p>
      <p className="text-gray-600 text-sm mb-1">Students: {school.population ?? '—'}</p>
      <p className="text-gray-600 text-sm">Location: {school.location ?? '—'}</p>
    </div>
  );
}

function MentorCard({ mentor }: { mentor: any }) {
  return (
    <div className="bg-white/70 border border-purple-200 rounded-2xl shadow-xl p-6 flex flex-col items-center w-64 hover:scale-105 transition-transform">
      <img src={mentor.img ?? '/favicon.ico'} alt={mentor.name} className="w-20 h-20 rounded-full border-2 border-purple-400 mb-3 shadow-md object-cover" />
      <h3 className="text-xl font-bold text-purple-800 mb-1">{mentor.name}</h3>
      <p className="text-gray-700 text-center">{mentor.bio ?? mentor.role ?? ''}</p>
      <p className="text-gray-600 text-sm">Phone: {mentor.phone ?? mentor.email ?? '—'}</p>
      <p className="text-gray-600 text-sm">Missions: {Array.isArray(mentor.missions) ? mentor.missions.length : mentor.missions ?? '—'}</p>
    </div>
  );
}
