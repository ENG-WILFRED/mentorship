"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function AddMentorForm() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    location: "",
    age: "",
    education: "",
    maritalStatus: "",
    phone: "",
    email: "",
    experience: "",
    skills: "",
    bio: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    try {
      const res = await fetch('/api/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          age: form.age ? Number(form.age) : undefined,
          education: form.education,
          maritalStatus: form.maritalStatus,
          phone: form.phone,
          email: form.email,
          experience: form.experience ? Number(form.experience) : undefined,
          skills: form.skills,
          bio: form.bio,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast(`Failed to add mentor: ${err?.error ?? res.statusText}`, 'error');
        setSubmitted(false);
        return;
      }

      toast('Mentor added successfully', 'success');
      setTimeout(() => {
        router.push('/mentor/mentors');
      }, 900);
    } catch (error) {
      console.error('Add mentor error', error);
      toast('Unexpected error adding mentor', 'error');
      setSubmitted(false);
    }
  }

  function handleCancel() {
    router.push("/mentor/mentors");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Mentor-relevant image background with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=80" alt="Mentor" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-pink-900/80 opacity-80" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-700/60 via-pink-400/40 to-indigo-300/60 backdrop-blur-3xl rounded-3xl shadow-2xl p-12 flex flex-col gap-8 border-2 border-purple-700 max-w-xl w-full relative z-10"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <h2 className="text-3xl font-extrabold text-purple-900 mb-2 text-center tracking-tight flex items-center justify-center gap-3 drop-shadow-lg">
          <span className="text-pink-500">🧑‍🏫</span> Add Mentor/Pastor <span className="text-pink-500">✨</span>
        </h2>
        <p className="text-center text-gray-800 mb-6 text-lg font-medium">
          Enter details for the new mentor or pastor
        </p>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
            min={18}
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Education</label>
          <input
            type="text"
            name="education"
            value={form.education}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Marital Status</label>
          <select
            name="maritalStatus"
            value={form.maritalStatus}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          >
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            required
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            min={0}
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Skills</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            placeholder="e.g. Leadership, Counseling, Teaching"
          />
        </div>
        <div>
          <label className="block text-purple-900 font-bold mb-2">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-600 focus:outline-none focus:ring-4 focus:ring-pink-400/40 bg-purple-50 text-purple-900 font-semibold shadow"
            rows={3}
            placeholder="Short description about the mentor/pastor"
          />
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-600 to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform text-lg tracking-wide"
          >
            Add Mentor/Pastor
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
            Mentor/Pastor added! Redirecting to mentors page...
          </div>
        )}
      </form>
    </div>
  );
}
