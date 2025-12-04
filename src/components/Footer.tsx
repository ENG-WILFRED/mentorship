"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 overflow-hidden">
      <div className="w-full whitespace-nowrap animate-marquee text-white text-lg font-bold px-4">
        Mentorship Program &nbsp; • &nbsp; Empowering Growth & Leadership &nbsp; • &nbsp; “A mentor is someone who allows you to see the hope inside yourself.” &nbsp; • &nbsp; Lifelong Learning &nbsp; • &nbsp; Mentorship Program
      </div>
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </footer>
  );
}
