import React from 'react';
import Link from 'next/link';
import { getDashboardData } from '@/actions/dashboard';
import  MentorshipHeader  from '@/components/MentorshipHeader';
import Footer from '@/components/Footer';

interface Report {
  id: number;
  date: Date;
  topic: string;
  students: number;
  outcome: string;
  school: {
    name: string;
  };
  mission: {
    title: string;
  };
}

const ReportsPage: React.FC = async () => {
  const { reports } = await getDashboardData();

  const totalReports = reports.length;
  const totalStudentsImpacted = reports.reduce((sum: number, r: any) => sum + (r.students || 0), 0);
  const avgStudentsPerReport = totalReports > 0 ? Math.round(totalStudentsImpacted / totalReports) : 0;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80" alt="Reports Dashboard" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/70 to-purple-900/80 opacity-80" />
      </div>

      {/* Sticky Header */}
      <MentorshipHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/95 drop-shadow-lg">Mission Reports</h1>
                <p className="text-sm sm:text-base md:text-lg text-white/75 mt-2">Dashboard for all mission reports and activities.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/mentor/dashboard" passHref>
                  <button className="px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all text-center">← Back to Dashboard</button>
                </Link>
                <Link href="/mentor/report/upload" passHref>
                  <button className="px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all text-center">+ Upload Report</button>
                </Link>
              </div>
            </div>

            {/* KPI Section */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-4 sm:p-6 hover:shadow-xl transition-all">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/95">{totalReports}</h3>
                <p className="text-sm sm:text-base md:text-lg text-white/75 mt-2 font-semibold">Total Reports</p>
                <p className="text-xs sm:text-sm text-white/60">All submitted reports</p>
              </div>
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-4 sm:p-6 hover:shadow-xl transition-all">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/95">{totalStudentsImpacted}</h3>
                <p className="text-sm sm:text-base md:text-lg text-white/75 mt-2 font-semibold">Students Impacted</p>
                <p className="text-xs sm:text-sm text-white/60">Total students across all reports</p>
              </div>
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-4 sm:p-6 hover:shadow-xl transition-all">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/95">{avgStudentsPerReport}</h3>
                <p className="text-sm sm:text-base md:text-lg text-white/75 mt-2 font-semibold">Avg Students/Report</p>
                <p className="text-xs sm:text-sm text-white/60">Average per mission report</p>
              </div>
            </section>

            {/* Reports List */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-6">All Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {reports.length > 0 ? (
                  reports.map((report: any) => (
                    <div key={report.id} className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-4 sm:p-6 hover:shadow-xl hover:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white/95">{report.school?.name || 'Unknown School'}</h3>
                          <p className="text-sm text-white/70 mt-1">
                            Mission: {report.mission?.title || 'N/A'}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">
                          {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-white/80">
                          <span className="font-semibold text-white/90">Topic:</span> {report.topic}
                        </p>
                        <p className="text-sm text-white/80">
                          <span className="font-semibold text-white/90">Students:</span> {report.students}
                        </p>
                        <p className="text-sm text-white/80">
                          <span className="font-semibold text-white/90">Outcome:</span> <span className="line-clamp-2">{report.outcome}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70 col-span-full text-center py-8">No reports found. Start by uploading a new report.</p>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default ReportsPage;