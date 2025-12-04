"use client";
import React from "react";

export default function Header({ pageName, userEmail }: { pageName: string; userEmail?: string }) {
  return (
    <header className="w-full flex items-center justify-between bg-white shadow-md px-6 py-4 mb-8 rounded-2xl">
      <h1 className="text-2xl font-bold text-purple-700">{pageName}</h1>
      <div className="flex items-center gap-4">
        {userEmail && <span className="text-gray-600 font-semibold">{userEmail}</span>}
        <img src="/public/vercel.svg" alt="User" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
}
