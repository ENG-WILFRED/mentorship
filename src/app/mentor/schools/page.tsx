import React from 'react';
import { getDashboardData } from '@/actions/dashboard';
import MentorshipHeader from '@/components/MentorshipHeader';
import Footer from '@/components/Footer';

export default async function SchoolsPage() {
  const { schools } = await getDashboardData();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1600&q=80" alt="School" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/70 to-green-900/80 opacity-80" />
      </div>

      {/* Sticky Header */}
      <MentorshipHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-100 mb-6 sm:mb-8 drop-shadow-lg">Schools</h1>

            {/* Cards Grid - Mobile Responsive */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
              {schools.map((school: any) => (
                <div key={school.id} className="bg-white/80 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    {school.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={school.logo} alt={school.name} className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-blue-400 object-cover" />
                    ) : (
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">🏫</div>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-blue-800">{school.name}</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">Location: {school.location ?? '—'}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Contact: {school.contact ?? '—'}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Students: {school.population ?? '—'}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/mentor/schools/add" className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105 text-center">Add School</a>
              <a href="/mentor/dashboard" className="bg-gradient-to-r from-gray-300 to-blue-400 text-blue-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-base sm:text-lg tracking-wide border border-blue-300 text-center">← Back to Dashboard</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
