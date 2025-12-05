"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { mentorsList, schoolsList, topicsList, studentsList } from "../app/data";

export default function MissionForm() {
  const router = useRouter();
  const [form, setForm] = useState<{
    name: string;
    description: string;
    date: string;
    schools: string[];
    topic: string;
    mentors: string[];
    students: string;
    status: string;
  }>({
    name: "",
    description: "",
    date: "",
    schools: [],
    topic: "",
    mentors: [],
    students: "",
    status: "Upcoming",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleAddItem(key: "schools" | "mentors", value: string) {
    if (!form[key].includes(value)) {
      setForm({ ...form, [key]: [...form[key], value] });
    }
  }

  function handleRemoveItem(key: "schools" | "mentors", value: string) {
    setForm({ ...form, [key]: form[key].filter((item: string) => item !== value) });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/mentor/missions");
    }, 1200);
  }

  function handleCancel() {
    router.push("/mentor/missions");
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen background image with overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80')",
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/90 via-indigo-900/85 to-pink-950/90 -z-10" />

      {/* Form Card with enhanced glassmorphism */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-700/70 via-pink-500/50 to-indigo-600/70 backdrop-blur-3xl rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col gap-6 md:gap-8 border border-purple-400/30 max-w-2xl w-full mx-4 relative z-10"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 text-center tracking-tight flex items-center justify-center gap-2 md:gap-3 drop-shadow-lg">
          <span className="text-pink-300">🚀</span> Create Mission <span className="text-pink-300">✨</span>
        </h2>
        <p className="text-center text-gray-100 mb-4 md:mb-6 text-base md:text-lg font-medium">
          Fill in details of the mentorship mission
        </p>

        {/* Mission Name */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Mission Name</label>
          <select
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-300/40 focus:outline-none focus:ring-4 focus:ring-pink-300/50 bg-white/90 text-gray-900 font-semibold shadow-md focus:bg-white transition-colors"
            required
          >
            <option value="">Select Mission Name</option>
            <option value="High School Mentorship">High School Mentorship</option>
            <option value="Youth Leadership Camp">Youth Leadership Camp</option>
            <option value="Career Guidance Fair">Career Guidance Fair</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Description</label>
          <select
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-300/40 focus:outline-none focus:ring-4 focus:ring-pink-300/50 bg-white/90 text-gray-900 font-semibold shadow-md focus:bg-white transition-colors"
            required
          >
            <option value="">Select Description</option>
            <option value="Building values and discipline">Building values and discipline</option>
            <option value="Preparing students for careers">Preparing students for careers</option>
            <option value="Encouraging leadership in youth">Encouraging leadership in youth</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-300/40 focus:outline-none focus:ring-4 focus:ring-pink-300/50 bg-white/90 text-gray-900 font-semibold shadow-md focus:bg-white transition-colors"
            required
          />
        </div>

        {/* Schools - interactive list */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Schools</label>
          {/* Available schools to add */}
          <div className="flex flex-wrap gap-2 mb-4">
            {schoolsList.filter((s) => !form.schools.includes(s)).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => handleAddItem("schools", s)}
                className="px-3 py-1 rounded-full border-2 font-semibold transition-colors duration-150 bg-white/80 text-purple-900 border-purple-300 hover:bg-pink-200 hover:border-pink-400 text-xs md:text-sm"
              >
                + {s}
              </button>
            ))}
          </div>
          {/* Space between lists */}
          <div className="h-2" />
          {/* Selected schools */}
          <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
            {form.schools.map((s) => (
              <span key={s} className="flex items-center bg-white/20 text-white font-semibold px-3 py-1 rounded-full border border-white/40 shadow text-xs md:text-sm">
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveItem("schools", s)}
                  className="ml-2 text-pink-200 hover:text-red-300 font-bold"
                  aria-label={`Remove ${s}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Topic</label>
          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-300/40 focus:outline-none focus:ring-4 focus:ring-pink-300/50 bg-white/90 text-gray-900 font-semibold shadow-md focus:bg-white transition-colors"
            required
          >
            <option value="">Select Topic</option>
            {topicsList.map((t) => (
              <option key={t} value={t} className="text-gray-900 font-semibold">{t}</option>
            ))}
          </select>
        </div>

        {/* Mentors - interactive list */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Mentors</label>
          {/* Available mentors to add */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mentorsList.filter((m) => !form.mentors.includes(m)).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => handleAddItem("mentors", m)}
                className="px-3 py-1 rounded-full border-2 font-semibold transition-colors duration-150 bg-white/80 text-purple-900 border-purple-300 hover:bg-pink-200 hover:border-pink-400 text-xs md:text-sm"
              >
                + {m}
              </button>
            ))}
          </div>
          {/* Space between lists */}
          <div className="h-2" />
          {/* Selected mentors */}
          <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
            {form.mentors.map((m) => (
              <span key={m} className="flex items-center bg-white/20 text-white font-semibold px-3 py-1 rounded-full border border-white/40 shadow text-xs md:text-sm">
                {m}
                <button
                  type="button"
                  onClick={() => handleRemoveItem("mentors", m)}
                  className="ml-2 text-pink-200 hover:text-red-300 font-bold"
                  aria-label={`Remove ${m}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Students Impacted */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Students Impacted</label>
          <select
            name="students"
            value={form.students}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-300/40 focus:outline-none focus:ring-4 focus:ring-pink-300/50 bg-white/90 text-gray-900 font-semibold shadow-md focus:bg-white transition-colors"
            required
          >
            <option value="">Select Range</option>
            {studentsList.map((s) => (
              <option key={s} value={s} className="text-gray-900 font-semibold">{s}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-white font-bold mb-2 text-sm md:text-base">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-300/40 focus:outline-none focus:ring-4 focus:ring-pink-300/50 bg-white/90 text-gray-900 font-semibold shadow-md focus:bg-white transition-colors"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform text-base md:text-lg tracking-wide w-full sm:w-auto"
          >
            🚀 Create Mission
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gradient-to-r from-gray-400 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-base md:text-lg tracking-wide border border-white/30 w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>

        {submitted && (
          <div className="text-green-300 font-bold mt-4 text-center animate-pulse text-sm md:text-base">
            Mission created! Redirecting to dashboard...
          </div>
        )}
      </form>
    </div>
  );
}
