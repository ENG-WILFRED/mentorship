import React from 'react';
import { getDashboardData } from '@/actions/dashboard';
import MentorshipHeader from '@/components/MentorshipHeader';
import Footer from '@/components/Footer';

export default async function MissionsPage() {
  const { missions } = await getDashboardData();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80"
          alt="Mission"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-pink-900/80 opacity-80" />
      </div>

      {/* Sticky Header */}
      <MentorshipHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 md:py-12">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-100 mb-6 sm:mb-8 drop-shadow-lg text-center">
            Missions
          </h1>

          {/* Mission cards */}
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
            {missions && missions.length > 0 ? (
              missions.map((mission: any) => (
                <div
                  key={mission.id}
                  className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col gap-3 border border-purple-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-2 tracking-tight">
                    {mission.title}
                  </h3>

                  {/* Date + Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">📅 {new Date(mission.date).toLocaleDateString()}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        mission.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {mission.status === "COMPLETED" ? "Completed" : mission.status === "ONGOING" ? "Ongoing" : "Upcoming"}
                    </span>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-purple-700">🏫 Schools:</span>{" "}
                      {mission.schools && mission.schools.length > 0 ? mission.schools.map((s: any) => s.school?.name).join(", ") : "—"}
                    </p>
                    <p>
                      <span className="font-semibold text-purple-700">👨‍🏫 Mentors:</span>{" "}
                      {mission.mentors && mission.mentors.length > 0 ? mission.mentors.map((m: any) => m.mentor?.name).join(", ") : "—"}
                    </p>
                    <p>
                      <span className="font-semibold text-purple-700">👩‍🎓 Students:</span>{" "}
                      {mission.students || "—"}
                    </p>
                  </div>

                  {/* Optional sections */}
                  {mission.description && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-purple-800 text-xs sm:text-sm mb-1">
                        📖 Description
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">{mission.description}</p>
                    </div>
                  )}
                  {mission.goals && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-purple-800 text-xs sm:text-sm mb-1">🎯 Goals</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{mission.goals}</p>
                    </div>
                  )}
                  {mission.outcomes && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-purple-800 text-xs sm:text-sm mb-1">🏆 Outcomes</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{mission.outcomes}</p>
                    </div>
                  )}
                  {mission.notes && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-purple-800 text-xs sm:text-sm mb-1">📝 Notes</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{mission.notes}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 text-center text-white">
                <p className="text-base sm:text-lg">No missions yet. Create one to get started!</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/mentor/missions/add"
              className="bg-gradient-to-r from-pink-600 to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105 text-center"
            >
              ➕ Add Mission
            </a>
            <a
              href="/mentor/dashboard"
              className="bg-gradient-to-r from-gray-300 to-purple-400 text-purple-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-base sm:text-lg tracking-wide border border-purple-300 text-center"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

