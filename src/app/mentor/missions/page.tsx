"use client";

import { useRouter } from "next/navigation";
import MissionForm from "../../../components/MissionForm";
import { missions } from "../../data";

export default function NewMissionPage() {
  const router = useRouter();

  function handleBack() {
    router.push("/mentor/dashboard");
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80"
          alt="Mission"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-pink-900/80 opacity-80" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-purple-100 mb-8 drop-shadow-lg">
        Missions
      </h1>

      {/* Mission cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {missions.map(
          (
            mission: {
              title: string;
              topic: string;
              date: string;
              status: string;
              schools: string[];
              mentors: string[];
              students: number | string;
              description?: string;
              goals?: string;
              outcomes?: string;
              notes?: string;
            },
            i: number
          ) => (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-purple-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Title */}
              <h3 className="text-2xl font-bold text-purple-900 mb-2 tracking-tight">
                {mission.title || mission.topic}
              </h3>

              {/* Date + Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">📅 {mission.date}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    mission.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {mission.status}
                </span>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-purple-700">🏫 Schools:</span>{" "}
                  {mission.schools.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-purple-700">👨‍🏫 Mentors:</span>{" "}
                  {mission.mentors.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-purple-700">👩‍🎓 Students:</span>{" "}
                  {mission.students}
                </p>
              </div>

              {/* Optional sections */}
              {mission.description && (
                <div className="mt-3">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">
                    📖 Description
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{mission.description}</p>
                </div>
              )}
              {mission.goals && (
                <div className="mt-2">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">🎯 Goals</h4>
                  <p className="text-gray-600 text-sm">{mission.goals}</p>
                </div>
              )}
              {mission.outcomes && (
                <div className="mt-2">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">🏆 Outcomes</h4>
                  <p className="text-gray-600 text-sm">{mission.outcomes}</p>
                </div>
              )}
              {mission.notes && (
                <div className="mt-2">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">📝 Notes</h4>
                  <p className="text-gray-600 text-sm">{mission.notes}</p>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <a
          href="/mentor/missions/add"
          className="bg-gradient-to-r from-pink-600 to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105"
        >
          ➕ Add Mission
        </a>
        <button
          onClick={handleBack}
          className="bg-gradient-to-r from-gray-300 to-purple-400 text-purple-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-lg tracking-wide border border-purple-300"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}
