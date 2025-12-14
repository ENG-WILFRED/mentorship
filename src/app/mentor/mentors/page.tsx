import React from "react";
import { getDashboardData } from '@/actions/dashboard';
import MentorshipHeader from '@/components/MentorshipHeader';
import Footer from '@/components/Footer';

export default async function MentorsPage() {
  const { mentors } = await getDashboardData();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80" alt="Mentorship" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-pink-900/80 opacity-80" />
      </div>

      {/* Sticky Header */}
      <MentorshipHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 md:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-100 mb-6 sm:mb-8 drop-shadow-lg text-center">Mentors & Pastors</h1>
          
          {/* Cards Grid - Mobile Responsive */}
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
            {mentors.map((mentor: any) => (
              <div key={mentor.id} className="bg-white/80 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 transition-transform">
                <img src={mentor.img ?? '/mentor.jpeg'} alt={mentor.name} className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-2 border-purple-400 mb-3 shadow-md object-cover" />
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-1 text-center">{mentor.name}</h3>
                <p className="text-gray-700 text-center mb-1 text-sm sm:text-base">{mentor.education ?? mentor.role ?? 'Mentor'}</p>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Phone: {mentor.phone ?? '—'}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Missions: {mentor.experience ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a href="/mentor/dashboard" className="bg-gradient-to-r from-gray-300 to-purple-400 text-purple-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-base sm:text-lg tracking-wide border border-purple-300 text-center">← Back to Dashboard</a>
            <a href="/mentor/mentors/add" className="bg-gradient-to-r from-green-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105 text-center">Add Mentor/Pastor</a>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
