"use client";
import React from "react";
export default function AnnouncementsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-8">Announcements</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* List announcements here */}
        <div className="bg-white rounded-2xl shadow-xl p-6">Sample Announcement</div>
      </div>
      <a href="/post-announcement" className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105">Post Announcement</a>
    </main>
  );
}
