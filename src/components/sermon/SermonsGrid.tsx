"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface Sermon {
  id: number;
  title: string;
  author?: string | null;
  topic?: string | null;
}

interface SermonsGridProps {
  sermons: Sermon[];
  onSelectSermon: (sermon: Sermon) => void;
  selectedTopic: string;
}

export default function SermonsGrid({
  sermons,
  selectedTopic,
}: SermonsGridProps) {
  const router = useRouter();
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {selectedTopic} Sermons
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.length > 0 ? (
          sermons.map((s) => (
                <div
                  key={s.id}
                  onClick={async () => {
                    try {
                      await router.push(`/mentor/sermons/${s.id}`);
                    } catch (err) {
                      // log navigation/route failure
                      console.error('Navigation error to sermon page', err);
                      // fallback to full navigation
                      window.location.href = `/mentor/sermons/${s.id}`;
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  className="group relative bg-sky-50 rounded-2xl shadow-sm hover:shadow-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border border-sky-100"
                >
              <div className="relative h-48 bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-6xl overflow-hidden">
                <div className="relative z-10 group-hover:scale-110 transition-transform">
                  🎬
                </div>
              </div>
              <div className="p-6">
                <div className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {s.topic}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                  {s.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span>👤</span>
                  <span className="font-semibold">{s.author || "Unknown"}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No sermons found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
