"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSchoolForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    population: "",
    location: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/mentor/schools");
    }, 1200);
  }

  function handleCancel() {
    router.push("/mentor/schools");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* School-relevant image background with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1600&q=80" alt="School" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/70 to-green-900/80 opacity-80" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-blue-700/60 via-green-400/40 to-indigo-300/60 backdrop-blur-3xl rounded-3xl shadow-2xl p-12 flex flex-col gap-8 border-2 border-blue-700 max-w-xl w-full relative z-10"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight flex items-center justify-center gap-3 drop-shadow-lg">
          <span className="text-green-500">🏫</span> Add School <span className="text-green-500">✨</span>
        </h2>
        <p className="text-center text-gray-800 mb-6 text-lg font-medium">
          Enter details for the new school
        </p>
        <div>
          <label className="block text-blue-900 font-bold mb-2">School Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-green-400/40 bg-blue-50 text-blue-900 font-semibold shadow"
            required
          />
        </div>
        <div>
          <label className="block text-blue-900 font-bold mb-2">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-green-400/40 bg-blue-50 text-blue-900 font-semibold shadow"
            required
          >
            <option value="">Select Gender</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label className="block text-blue-900 font-bold mb-2">Population</label>
          <input
            type="number"
            name="population"
            value={form.population}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-green-400/40 bg-blue-50 text-blue-900 font-semibold shadow"
            required
            min={1}
          />
        </div>
        <div>
          <label className="block text-blue-900 font-bold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-green-400/40 bg-blue-50 text-blue-900 font-semibold shadow"
            required
          />
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform text-lg tracking-wide"
          >
            Add School
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gradient-to-r from-gray-300 to-blue-400 text-blue-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-lg tracking-wide border border-blue-300"
          >
            Cancel
          </button>
        </div>
        {submitted && (
          <div className="text-green-700 font-bold mt-4 text-center animate-pulse">
            School added! Redirecting to dashboard...
          </div>
        )}
      </form>
    </div>
  );
}
