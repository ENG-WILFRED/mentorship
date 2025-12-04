"use client";
import { useState } from "react";

export default function UploadSermonPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess(false);
    if (!title || !description || !video) {
      setError("All fields are required.");
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    formData.append("uploadedById", "1"); // TODO: Use real user ID
    try {
      const res = await fetch("/api/sermon", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setSuccess(true);
      setTitle("");
      setDescription("");
      setVideo(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">Upload Sermon</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <input
            type="file"
            accept="video/*"
            onChange={e => setVideo(e.target.files?.[0] || null)}
            className="border border-gray-300 rounded px-4 py-2 text-gray-900 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-lg font-bold hover:opacity-90"
          >
            {uploading ? "Uploading..." : "Upload Sermon"}
          </button>
        </form>
        {success && <p className="text-green-600 mt-4 text-center font-semibold">Sermon uploaded successfully!</p>}
        {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
      </div>
    </div>
  );
}
