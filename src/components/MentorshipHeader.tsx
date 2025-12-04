import Image from "next/image";

import React, { useState } from "react";
// ...existing code...

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
    <div className="w-64 text-left">
      <h3 className="text-base font-semibold text-purple-700 mb-1">Contact</h3>
      <p className="text-sm text-gray-700">Email: mentorship@wisdom.org<br />Phone: +254 712 345 678<br />Location: ICC CTC Church, Nairobi</p>
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
              "Raising Leaders through Faith & Wisdom"
            </p>
          </div>
        </div>

        {/* Nav / Motto Extra */}
        <nav className="mt-4 md:mt-0 flex gap-6 text-sm font-medium">
          <NavPopover label="About" popoverKey="about" />
          <NavPopover label="Mentors" popoverKey="mentors" />
          <NavPopover label="Events" popoverKey="events" />
          <NavPopover label="Contact" popoverKey="contact" />
        </nav>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
}
