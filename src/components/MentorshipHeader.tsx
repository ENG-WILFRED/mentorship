'use client';

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

const popoverData = {
  about: (
    <div className="w-64 text-left">
      <h3 className="text-base font-semibold text-purple-700 mb-1">About</h3>
      <p className="text-sm text-gray-700">Wisdom Mentorship is a faith-based program dedicated to nurturing leaders, fostering growth, and building a supportive community. Join us to unlock your purpose!</p>
    </div>
  ),
  mentors: (
    <div className="w-64 text-left">
      <h3 className="text-base font-semibold text-purple-700 mb-1">Mentors</h3>
      <ul className="text-sm text-gray-700 list-disc pl-4">
        <li>Pastor John – Leadership & Faith</li>
        <li>Mentor Grace – Prayer & Guidance</li>
        <li>Pastor Mary – Service & Community</li>
      </ul>
    </div>
  ),
  events: (
    <div className="w-64 text-left">
      <h3 className="text-base font-semibold text-purple-700 mb-1">Upcoming Events</h3>
      <ul className="text-sm text-gray-700 list-disc pl-4">
        <li>Oct 10: Faith Leadership Summit</li>
        <li>Oct 24: Community Service Day</li>
        <li>Nov 5: Wisdom Workshop</li>
      </ul>
    </div>
  ),
  contact: (
    <div className="w-75 text-left">
      <h3 className="text-base font-semibold text-purple-700 mb-1">Contact</h3>
      <p className="text-sm text-gray-700 whitespace-nowrap">Email: wisdommentorshipsociety@gmail.com<br />Phone: +254702913856<br />Location: Mentorship Church, Nairobi</p>
    </div>
  ),
};

function NavPopover({ label, popoverKey }: { label: string; popoverKey: keyof typeof popoverData }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center">
      <a
        href="#"
        className="hover:text-pink-300 hover:scale-105 transition-transform duration-200 px-2 py-1"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
      >
        {label}
      </a>
      {show && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-md rounded-lg shadow-lg z-50 border border-gray-200 animate-fadeIn min-w-[16rem]">
          <div className="p-4">
            {popoverData[popoverKey]}
          </div>
        </div>
      )}
    </div>
  );
}

function UserProfileDropdown() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, role, logout } = useAuthContext();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    router.push("/auth/login");
  };

  const userInitials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="relative">
        <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center font-bold text-sm text-white shadow-lg">
          {userInitials}
        </div>
        <div className="hidden md:flex md:flex-col md:items-start md:truncate">
          <span className="text-sm font-semibold truncate">{user.firstName}</span>
          <span className="text-xs text-gray-200 truncate">{user.email}</span>
        </div>
        <svg className="w-4 h-4 transition-transform" style={{ transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-gradient-to-br from-purple-950/98 to-indigo-950/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-400/30 animate-in fade-in slide-in-from-top-2 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg border border-white/40 shadow-lg">
                {userInitials}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-white/90">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Body with user info */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-colors">
              <span className="text-sm text-gray-300">Role:</span>
              <span className="font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                {role || 'Loading...'}
              </span>
            </div>
            
            {user.memorableId && (
              <div className="text-xs text-gray-400 bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-gray-400">Memorable ID</p>
                <p className="font-mono text-purple-300 mt-1">{user.memorableId}</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>

          {/* Actions */}
          <div className="p-3 space-y-2">
            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/mentor/dashboard");
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 text-sm text-white/90 hover:text-white transition-all duration-200 group flex items-center gap-2"
            >
              <span className="group-hover:scale-110 transition-transform">📊</span> Dashboard
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/mentor/sermons");
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 text-sm text-white/90 hover:text-white transition-all duration-200 group flex items-center gap-2"
            >
              <span className="group-hover:scale-110 transition-transform">🎙️</span> Sermons
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/mentor/prayer-requests");
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 text-sm text-white/90 hover:text-white transition-all duration-200 group flex items-center gap-2"
            >
              <span className="group-hover:scale-110 transition-transform">🙏</span> Prayer Requests
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-sm text-red-300 hover:text-red-200 transition-all duration-200 font-semibold group flex items-center gap-2"
            >
              <span className="group-hover:scale-110 transition-transform">🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MentorshipHeader() {
  return (
    <header className="relative z-50 w-full bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-pink-900/60 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/mentor.jpeg"
            alt="Mentorship Logo"
            width={50}
            height={50}
            className="rounded-full border-2 border-white shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-wide animate-fade-in">
              Wisdom Mentorship Program
            </h1>
            <p className="text-sm text-gray-200 italic animate-pulse">
              &quot;Raising Leaders through Faith &amp; Wisdom&quot;
            </p>
          </div>
        </div>

        {/* Nav / Motto Extra */}
        <nav className="mt-4 md:mt-0 flex gap-6 text-sm font-medium items-center">
          <NavPopover label="About" popoverKey="about" />
          <NavPopover label="Mentors" popoverKey="mentors" />
          <NavPopover label="Events" popoverKey="events" />
          <NavPopover label="Contact" popoverKey="contact" />
          
          {/* User Profile Dropdown */}
          <UserProfileDropdown />
        </nav>
      </div>
    </header>
  );
}
