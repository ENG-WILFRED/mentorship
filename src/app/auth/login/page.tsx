"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MentorshipHeader from "../../../components/MentorshipHeader";

const slides = [
  {
    verse: "“Mentorship is the bridge to greatness.”",
    subtitle: "Grow & Lead",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80",
  },
  {
    verse: "“Wisdom is the principal thing; therefore get wisdom.” – Proverbs 4:7",
    subtitle: "Wisdom & Guidance",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    verse: "“Iron sharpens iron, and one man sharpens another.” – Proverbs 27:17",
    subtitle: "Community & Support",
    image:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mentorship Header */}
      <MentorshipHeader />

      <main className="min-h-screen flex flex-col md:flex-row relative">
        {/* Left: Login form */}
        <section className="relative flex items-center justify-center w-full md:w-1/2 p-8 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-700">
          <form className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 text-white animate-fadeIn">
            <h1 className="text-3xl font-bold drop-shadow-lg">Sign In</h1>
            <p className="text-gray-200 mb-4">
              Welcome back to the mentorship journey ✨
            </p>

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded px-4 py-3 bg-white/20 border border-white/30 text-lg text-white placeholder:text-gray-200 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded px-4 py-3 bg-white/20 border border-white/30 text-lg text-white placeholder:text-gray-200 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105"
            >
              <Link href="/mentor/dashboard" >

                Sign In
              </Link>
            </button>

            <div className="text-center text-sm text-gray-200 mt-2">
              <a href="#" className="text-pink-300 hover:underline font-semibold">
                Forgot Password?
              </a>
            </div>
            <p className="text-center text-sm text-gray-200 mt-4">
              New to mentorship?{' '}
              <Link href="/auth/register" className="text-pink-300 hover:underline">
                Create Account
              </Link>
            </p>
            <div className="mt-6 text-xs text-gray-300 text-center">
              <span className="font-bold text-pink-300">Why Mentorship?</span> <br />
              Unlock your potential, grow in wisdom, and connect with leaders who care. <br />
              <span className="italic">“Mentors help you see the hope inside yourself.”</span>
            </div>
          </form>
        </section>

        {/* Right: Enhanced Carousel */}
        <section className="relative w-full md:w-1/2 flex items-center justify-center overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0"
                }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6">
                <h2 className="text-lg md:text-xl text-pink-300 font-medium mb-2">
                  {slide.subtitle}
                </h2>
                <p className="text-2xl md:text-3xl font-bold italic max-w-xl">
                  {slide.verse}
                </p>
                <div className="mt-6 flex gap-4 text-sm uppercase tracking-wide text-gray-200">
                  <span>Faith</span> • <span>Growth</span> • <span>Leadership</span>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? "bg-pink-400 scale-110" : "bg-gray-300/70"
                  }`}
              />
            ))}
          </div>
        </section>
      </main>
      {/* Small CSS animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}
