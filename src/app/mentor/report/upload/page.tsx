"use client";

import React from 'react';
import UploadReports from '../UploadReports';
import Link from 'next/link';
import MentorshipHeader from '@/components/MentorshipHeader';
import Footer from '@/components/Footer';

const UploadPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80" alt="Upload Report" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/70 to-purple-900/80 opacity-80" />
            </div>

            {/* Sticky Header */}
            <MentorshipHeader />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                <div className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/95 drop-shadow-lg mb-2">Upload Report</h1>
                            <p className="text-sm sm:text-base md:text-lg text-white/75">Submit a new mission report with details about your activities and impact.</p>
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <Link href="/mentor/dashboard" passHref>
                                <button className="px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all text-center flex-1 sm:flex-none">← Back to Dashboard</button>
                            </Link>
                            <Link href="/mentor/report" passHref>
                                <button className="px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all text-center flex-1 sm:flex-none">← Back to Reports</button>
                            </Link>
                        </div>

                        {/* Form */}
                        <UploadReports />
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
};

export default UploadPage;