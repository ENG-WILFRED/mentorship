"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MentorshipHeader from "../../../components/MentorshipHeader";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/Toast";

const slides = [
  {
    verse: "“For I know the plans I have for you...” – Jeremiah 29:11",
    subtitle: "Hope & Purpose",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80",
  },
  {
    verse: "“The fear of the Lord is the beginning of wisdom.” – Proverbs 9:10",
    subtitle: "Wisdom & Guidance",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    verse: "“Trust in the Lord with all your heart...” – Proverbs 3:5",
    subtitle: "Faith & Trust",
    image:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const toast = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [registerError, setRegisterError] = useState("");

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
      {/* 🔥 New Animated Header */}
      <MentorshipHeader />

      {/* Existing Layout */}
      <main className="min-h-screen flex flex-col md:flex-row relative">
        {/* Left: Register form */}
        <section className="relative flex items-center justify-center w-full md:w-1/2 p-8 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-700">
          <form
            className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 text-white"
            onSubmit={async (e) => {
              e.preventDefault();
              setRegisterError("");
              try {
                await register(firstName, lastName, email, password);
                toast("Account created successfully! Welcome aboard ✨", "success");
                router.push("/mentor/dashboard");
              } catch {
                const errorMsg = error || "Registration failed. Please try again.";
                setRegisterError(errorMsg);
                toast(errorMsg, "error");
              }
            }}
          >
            <h1 className="text-3xl font-bold drop-shadow-lg">Create Account</h1>
            <p className="text-gray-200 mb-4">
              Join the mentorship journey today ✨
            </p>

            {registerError && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {registerError}
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                className="rounded px-4 py-3 bg-white/20 border border-white/30 text-lg text-white placeholder:text-gray-200 focus:outline-none w-1/2 disabled:opacity-50"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                className="rounded px-4 py-3 bg-white/20 border border-white/30 text-lg text-white placeholder:text-gray-200 focus:outline-none w-1/2 disabled:opacity-50"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="rounded px-4 py-3 bg-white/20 border border-white/30 text-lg text-white placeholder:text-gray-200 focus:outline-none disabled:opacity-50"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="rounded px-4 py-3 bg-white/20 border border-white/30 text-lg text-white placeholder:text-gray-200 focus:outline-none w-full pr-12 disabled:opacity-50"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white text-lg"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-gray-200 mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-pink-300 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </section>

        {/* Right: Enhanced Carousel */}
        <section className="relative w-full md:w-1/2 flex items-center justify-center overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0"
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
                  <span>Faith</span> • <span>Growth</span> •{" "}
                  <span>Leadership</span>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentSlide ? "bg-pink-400 scale-110" : "bg-gray-300/70"
                }`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
