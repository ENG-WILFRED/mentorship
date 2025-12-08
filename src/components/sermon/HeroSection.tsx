"use client";
import React from "react";

interface HeroSectionProps {
  showHero: boolean;
}

export default function HeroSection({ showHero }: HeroSectionProps) {
  if (!showHero) return null;

  return (
    <section className="relative w-full h-64 md:h-80 flex items-center justify-center text-center overflow-hidden rounded-3xl mb-12 border border-white/20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/70 to-transparent" />
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white drop-shadow-lg">
          📖 Sermons Library
        </h1>
        <p className="text-lg md:text-xl italic text-gray-100 drop-shadow-md">
          Explore spiritual teachings and messages from our community
        </p>
      </div>
    </section>
  );
}
