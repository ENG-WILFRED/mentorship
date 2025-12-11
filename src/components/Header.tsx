"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from '@/lib/session';

export default function Header({ pageName, userEmail }: { pageName: string; userEmail?: string }) {
  const [showUser, setShowUser] = useState(false);

  useEffect(() => {
    // Only show user details if a valid session exists and email matches
    const sess = getSession();
    if (sess.accessToken && sess.email && userEmail && sess.email === userEmail) {
      setShowUser(true);
    } else {
      setShowUser(false);
    }
  }, [userEmail]);

  return (
    <header className="w-full mb-8">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-90" />
        <div className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-white drop-shadow">{pageName}</h1>
              {showUser && <span className="text-sm text-white/90">{userEmail}</span>}
            </div>
            <nav className="hidden sm:flex items-center gap-2 ml-6">
              <Link href="/mentor/dashboard" className="text-sm px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition">Dashboard</Link>
              <Link href="/mentor/sermons" className="text-sm px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition">Sermons</Link>
              <Link href="/mentor/sermons/upload-sermon" className="text-sm px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition">Upload</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm px-3 py-1 rounded-md bg-white text-indigo-700 font-semibold hover:brightness-95 transition">Sign in</Link>
            {showUser ? (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                <img src="/vercel.svg" alt="User" className="w-8 h-8 rounded-full" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5" />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shiftGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: shiftGradient 8s ease infinite;
        }
      `}</style>
    </header>
  );
}
