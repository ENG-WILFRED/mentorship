"use client";
import React from "react";

interface User {
  id: number;
  email: string;
  isLoggedIn: boolean;
}

interface ReactionsProps {
  reactions: Record<string, number>;
  onReaction: (emoji: string) => void;
  user: User;
  reactionsList: string[];
}

export default function Reactions({
  reactions,
  onReaction,
  user,
  reactionsList,
}: ReactionsProps) {
  if (!user.isLoggedIn) return null;

  return (
    <div className="flex gap-3 mt-8 flex-wrap justify-center">
      <span className="text-white font-semibold mr-2 self-center">React:</span>
      {reactionsList.map((r) => (
        <button
          key={r}
          onClick={() => onReaction(r)}
          className="px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full text-lg font-semibold transition-all border border-white/20 hover:border-white/40 backdrop-blur-sm"
        >
          {r} <span className="text-gray-300 ml-1">{reactions[r] || 0}</span>
        </button>
      ))}
    </div>
  );
}
