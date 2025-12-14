"use client";
import React from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

interface User {
  role: string;
}

interface SearchFilterProps {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  selectedAuthor: string;
  setSelectedAuthor: (author: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  topics: string[];
  authors: string[];
  showVideos: boolean;
  user: User;
}

export default function SearchFilter({
  selectedTopic,
  setSelectedTopic,
  selectedAuthor,
  setSelectedAuthor,
  searchQuery,
  setSearchQuery,
  topics,
  authors,
  showVideos,
  user,
}: SearchFilterProps) {
  const onReset = () => {
    setSelectedTopic("");
    setSelectedAuthor("");
    setSearchQuery("");
  };

  return (
    <section className="relative overflow-hidden rounded-3xl mb-12">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 opacity-90 animate-gradient" />

      {/* Content */}
      <div className="relative p-6 md:p-8 bg-black/20 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Search & Filter
            </h2>
            <p className="text-sm text-white/80 mt-1 max-w-md">
              Find sermons by topic, speaker, or message content.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(user.role === "ADMIN" ||
              user.role === "PASTOR" ||
              user.role === "MENTOR") && (
              <Link
                href="/mentor/sermons/upload-sermon"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold
                           bg-white/15 text-white backdrop-blur-md border border-white/20
                           hover:bg-white/25 transition-all"
              >
                <span className="text-lg leading-none">＋</span>
                <span className="hidden sm:inline">Upload Sermon</span>
              </Link>
            )}

            <button
              type="button"
              onClick={onReset}
              className="rounded-xl px-4 py-2 text-sm text-white/80
                         bg-white/10 hover:bg-white/20 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Filters */}
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-6">
            <label htmlFor="sermon-search" className="sr-only">
              Search sermons
            </label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                id="sermon-search"
                type="search"
                placeholder="Search by title or speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl pl-11 pr-4 py-3
                           bg-white/10 text-white placeholder-white/60
                           border border-white/20
                           focus:outline-none focus:ring-2 focus:ring-indigo-300/70
                           transition-all"
              />
            </div>
          </div>

          {/* Topic */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-white/80 mb-1">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setSelectedAuthor("");
              }}
              className="w-full rounded-xl px-3 py-3
                         bg-white/10 text-white
                         border border-white/20
                         focus:outline-none focus:ring-2 focus:ring-indigo-300/70
                         transition-all"
            >
              <option value="" className="bg-gray-900 text-white">
                All Topics
              </option>
              {topics.map((topic) => (
                <option
                  key={topic}
                  value={topic}
                  className="bg-gray-900 text-white"
                >
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Speaker */}
          {showVideos && (
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-white/80 mb-1">
                Speaker
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full rounded-xl px-3 py-3
                           bg-white/10 text-white
                           border border-white/20
                           focus:outline-none focus:ring-2 focus:ring-indigo-300/70
                           transition-all"
              >
                <option value="" className="bg-gray-900 text-white">
                  All Speakers
                </option>
                {authors.map((a) => (
                  <option
                    key={a}
                    value={a}
                    className="bg-gray-900 text-white"
                  >
                    {a}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
