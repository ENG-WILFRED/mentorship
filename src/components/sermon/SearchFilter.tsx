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
    <section className="relative rounded-3xl overflow-hidden mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 opacity-90 animate-gradient" />
        <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Search & Filter</h2>
          <p className="text-sm text-white/90 mt-1">Find sermons by topic, speaker or text.</p>
        </div>

        <div className="flex items-center gap-3">
          {(user.role === "ADMIN" || user.role === "PASTOR" || user.role === "MENTOR") && (
            <Link
              href="/mentor/sermons/upload-sermon"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-semibold hover:brightness-105 transition-all border border-white/10"
            >
              <span className="text-lg">＋</span>
              <span className="hidden sm:inline">Upload Sermon</span>
            </Link>
          )}

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset filters"
            className="px-3 py-2 rounded-lg bg-white/6 text-sm text-white/90 hover:bg-white/10 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="sermon-search" className="sr-only">Search sermons</label>
            <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
              <FaSearch />
            </span>
            <input
              id="sermon-search"
              type="search"
              inputMode="search"
              placeholder="Search sermons by title or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/6 text-white placeholder-white/70 border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              aria-label="Search sermons by title or speaker"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="topic" className="text-sm text-white/90 font-medium">Topic</label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setSelectedAuthor("");
              }}
              className="mt-1 block w-full px-3 py-2 rounded-lg bg-white/6 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {showVideos && (
            <div className="flex-1">
              <label htmlFor="author" className="text-sm text-gray-700 font-medium">Speaker</label>
              <select
                id="author"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-lg bg-white/6 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              >
                <option value="">All Speakers</option>
                {authors.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
