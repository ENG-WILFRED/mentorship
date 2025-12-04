"use client";
import React from "react";
import { mentors } from "../../data";
export default function MentorsPage() {
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;
  function handleBack() {
    if (router) router.push("/mentor/dashboard");
  }
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Mentorship-relevant image background with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80" alt="Mentorship" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-pink-900/80 opacity-80" />
      </div>
      <h1 className="text-4xl font-extrabold text-purple-100 mb-8 drop-shadow-lg">Mentors & Pastors</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {mentors.map((mentor, i) => (
          <div key={i} className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <img src={mentor.img} alt={mentor.name} className="w-20 h-20 rounded-full border-2 border-purple-400 mb-3 shadow-md object-cover" />
            <h3 className="text-xl font-bold text-purple-800 mb-1">{mentor.name}</h3>
            <p className="text-gray-700 text-center mb-1">{mentor.role}</p>
            <p className="text-gray-600 text-sm mb-1">Phone: {mentor.phone}</p>
            <p className="text-gray-600 text-sm">Missions: {mentor.missions}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleBack}
          className="bg-gradient-to-r from-gray-300 to-purple-400 text-purple-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-lg tracking-wide border border-purple-300"
        >
          ← Back to Dashboard
        </button>
        <a href="/mentor/mentors/add" className="bg-gradient-to-r from-green-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105">Add Mentor/Pastor</a>
        <a href="/contact-mentor" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105">Contact Mentor/Pastor</a>
      </div>
    </main>
  );
}
