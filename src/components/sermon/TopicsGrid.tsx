"use client";
import React from "react";

interface TopicsGridProps {
  topics: string[];
  initialSermons: Array<{ topic?: string | null }>;
  onSelectTopic: (topic: string) => void;
}

export default function TopicsGrid({
  topics,
  initialSermons,
  onSelectTopic,
}: TopicsGridProps) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {topics.map((topic) => {
        const sermonCount = initialSermons.filter(
          (s) => (s.topic || "General") === topic
        ).length;
        return (
          <div
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className="group relative bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl shadow-sm hover:shadow-lg p-8 cursor-pointer transition-all hover:scale-105 border border-sky-100 hover:border-sky-300"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              📖
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
              {topic}
            </h2>
            <p className="text-indigo-600 font-semibold mb-3">
              {sermonCount} {sermonCount === 1 ? "sermon" : "sermons"}
            </p>
            <p className="text-gray-600 text-sm">
              Explore messages about {topic.toLowerCase()}
            </p>
          </div>
        );
      })}
    </section>
  );
}
