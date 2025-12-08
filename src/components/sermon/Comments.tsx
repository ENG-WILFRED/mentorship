"use client";
import React from "react";

interface User {
  id: number;
  email: string;
  isLoggedIn: boolean;
}

interface CommentsProps {
  comments: string[];
  newComment: string;
  onCommentChange: (text: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  user: User;
}

export default function Comments({
  comments,
  newComment,
  onCommentChange,
  onSubmitComment,
  user,
}: CommentsProps) {
  if (!user.isLoggedIn) return null;

  return (
    <div className="flex flex-col bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl p-8 mt-12 w-full max-w-3xl border border-white/10 backdrop-blur-sm">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
        💬 Community Insights
      </h3>
      <form onSubmit={onSubmitComment} className="flex gap-3 mb-6 flex-col sm:flex-row">
        <input
          type="text"
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Share your thoughts..."
          className="border border-white/20 rounded-lg px-4 py-3 w-full bg-white/10 focus:bg-white/15 focus:ring-2 focus:ring-pink-400 outline-none text-white placeholder-gray-300 backdrop-blur-sm transition-all"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap"
        >
          Post
        </button>
      </form>

      <div>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-white/10 rounded-xl px-4 py-3 text-white border border-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-pink-300 text-sm mb-1">
                    {user.email}
                  </p>
                  <p className="text-gray-100">{c}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300 italic text-center py-8 text-lg">
            ✨ No comments yet. Start the conversation!
          </p>
        )}
      </div>
    </div>
  );
}
