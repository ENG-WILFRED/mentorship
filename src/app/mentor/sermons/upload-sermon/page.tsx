"use client";
import { useState } from "react";
import Footer from "../../../../components/Footer";

export default function UploadSermonPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preacher, setPreacher] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess(false);
    setProgress(0);
    
    if (!title || !description || !preacher || !file) {
      setError("All fields are required.");
      setUploading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("preacher", preacher);
    
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE}/sermons/upload`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setSuccess(true);
            setTitle("");
            setDescription("");
            setPreacher("");
            setFile(null);
            setProgress(0);
            setTimeout(() => {
              window.location.href = "/mentor/sermons";
            }, 2000);
            resolve();
          } else {
            setError("Upload failed");
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => {
          setError("Upload failed");
          reject(new Error("Upload failed"));
        };
        xhr.send(formData);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative w-full h-64 md:h-80 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-purple-950/70 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white drop-shadow-lg">📤 Share Your Message</h1>
          <p className="text-lg md:text-xl italic text-gray-100 drop-shadow-md">Upload a powerful sermon to inspire the community</p>
        </div>
      </section>

      <main className="flex-1 flex items-center justify-center px-4 md:px-8 py-12 md:py-20">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl border border-white/10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center">Upload New Sermon</h2>
          <p className="text-gray-300 text-center mb-8">Fill in the details below to share your sermon with the community</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="text-white font-semibold mb-2 block text-sm md:text-base">Sermon Title</label>
              <input
                type="text"
                placeholder="e.g., 'Faith That Moves Mountains'"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-white/20 rounded-lg px-4 py-3 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/15 transition-all backdrop-blur-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-white font-semibold mb-2 block text-sm md:text-base">Description</label>
              <textarea
                placeholder="e.g., 'A powerful message about overcoming doubt through faith'"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-white/20 rounded-lg px-4 py-3 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/15 transition-all backdrop-blur-sm resize-none"
                required
              />
            </div>

            {/* Preacher Field */}
            <div>
              <label className="text-white font-semibold mb-2 block text-sm md:text-base">Preacher/Speaker</label>
              <input
                type="text"
                placeholder="Your name or pastor's name"
                value={preacher}
                onChange={e => setPreacher(e.target.value)}
                className="w-full border border-white/20 rounded-lg px-4 py-3 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/15 transition-all backdrop-blur-sm"
                required
              />
            </div>

            {/* Video Upload */}
            <div>
              <label className="text-white font-semibold mb-2 block text-sm md:text-base">Video File (to upload to YouTube)</label>
              <div className="relative border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎬</div>
                <p className="text-white font-semibold mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-400 text-sm">{file ? file.name : "MP4, MOV, AVI (Max 500MB)"}</p>
              </div>
            </div>

            {/* Progress Bar */}
            {uploading && progress > 0 && (
              <div className="flex flex-col gap-2">
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-gray-300 text-sm">{progress}% uploaded</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {uploading ? `Uploading to YouTube... ${progress}%` : "🚀 Upload Sermon to YouTube"}
            </button>
          </form>

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/50 text-green-300 text-center font-semibold">
              ✅ Sermon uploaded successfully! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg border border-red-500/50 text-red-300 text-center font-semibold">
              ❌ {error}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
            <p className="text-gray-300 text-sm text-center">
              <span className="font-semibold text-pink-300">📋 Requirements:</span> Clear title, detailed description, preacher name, valid video file. Your sermon will be uploaded to YouTube and saved to our database.
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-6 flex justify-center">
            <a
              href="/mentor/sermons"
              className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 font-bold rounded-lg hover:opacity-90 transition-transform transform hover:scale-105"
            >
              ← Back to Sermons
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
