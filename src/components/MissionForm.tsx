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
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Mentorship-relevant image background with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80" alt="Mentorship" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-pink-900/80 opacity-80" />
      </div>

      {/* Form Card with enhanced glassmorphism and gradient overlay */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-700/60 via-pink-400/40 to-indigo-300/60 backdrop-blur-3xl rounded-3xl shadow-2xl p-12 flex flex-col gap-8 border-2 border-purple-700 max-w-2xl w-full relative z-10"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <h2 className="text-4xl font-extrabold text-purple-900 mb-2 text-center tracking-tight flex items-center justify-center gap-3 drop-shadow-lg">
          <span className="text-pink-500">🚀</span> Create Mission <span className="text-pink-500">✨</span>
        </h2>
        <p className="text-center text-gray-800 mb-6 text-lg font-medium">
          Fill in details of the mentorship mission
        </p>

        {/* Mission Name */}
        <div>
          <label className="block text-purple-900 font-bold mb-2">Mission Name</label>
          <select
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
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
          <label className="block text-purple-900 font-bold mb-2">Description</label>
          <select
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
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
          <label className="block text-purple-900 font-bold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          />
        </div>

        {/* Schools - interactive list */}
        <div>
          <label className="block text-purple-900 font-bold mb-2">Schools</label>
          {/* Available schools to add */}
          <div className="flex flex-wrap gap-2 mb-4">
            {schoolsList.filter((s) => !form.schools.includes(s)).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => handleAddItem("schools", s)}
                className="px-3 py-1 rounded-full border-2 font-semibold transition-colors duration-150 bg-white text-purple-900 border-purple-600 hover:bg-purple-100 hover:border-pink-400"
              >
                + {s}
              </button>
            ))}
          </div>
          {/* Space between lists */}
          <div className="h-2" />
          {/* Selected schools */}
          <div className="flex flex-wrap gap-3 mt-2">
            {form.schools.map((s) => (
              <span key={s} className="flex items-center bg-purple-100 text-purple-900 font-semibold px-3 py-1 rounded-full border border-purple-400 shadow">
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveItem("schools", s)}
                  className="ml-2 text-pink-600 hover:text-red-700 font-bold"
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
          <label className="block text-purple-900 font-bold mb-2">Topic</label>
          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          >
            <option value="">Select Topic</option>
            {topicsList.map((t) => (
              <option key={t} value={t} className="text-purple-900 font-semibold">{t}</option>
            ))}
          </select>
        </div>

        {/* Mentors - interactive list */}
        <div>
          <label className="block text-purple-900 font-bold mb-2">Mentors</label>
          {/* Available mentors to add */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mentorsList.filter((m) => !form.mentors.includes(m)).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => handleAddItem("mentors", m)}
                className="px-3 py-1 rounded-full border-2 font-semibold transition-colors duration-150 bg-white text-purple-900 border-purple-600 hover:bg-purple-100 hover:border-pink-400"
              >
                + {m}
              </button>
            ))}
          </div>
          {/* Space between lists */}
          <div className="h-2" />
          {/* Selected mentors */}
          <div className="flex flex-wrap gap-3 mt-2">
            {form.mentors.map((m) => (
              <span key={m} className="flex items-center bg-purple-100 text-purple-900 font-semibold px-3 py-1 rounded-full border border-purple-400 shadow">
                {m}
                <button
                  type="button"
                  onClick={() => handleRemoveItem("mentors", m)}
                  className="ml-2 text-pink-600 hover:text-red-700 font-bold"
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
          <label className="block text-purple-900 font-bold mb-2">Students Impacted</label>
          <select
            name="students"
            value={form.students}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          >
            <option value="">Select Range</option>
            {studentsList.map((s) => (
              <option key={s} value={s} className="text-purple-900 font-semibold">{s}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-purple-900 font-bold mb-2">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-4 mt-4 justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-600 to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform text-lg tracking-wide"
          >
            🚀 Create Mission
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gradient-to-r from-gray-300 to-purple-400 text-purple-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-lg tracking-wide border border-purple-300"
          >
            Cancel
          </button>
        </div>

        {submitted && (
          <div className="text-green-700 font-bold mt-4 text-center animate-pulse">
            Mission created! Redirecting to dashboard...
          </div>
        )}
      </form>
    </div>
  );
}
