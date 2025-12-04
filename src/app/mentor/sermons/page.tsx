"use client";
import React, { useRef, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FaPlay, FaPause, FaExpand, FaForward, FaBackward } from "react-icons/fa";

// Simulated authentication (replace later with real auth)
const user = {
  email: "user@email.com",
  id: 1,
  isLoggedIn: true,
  role: "ADMIN", // Change to "PASTOR", "MENTOR", "MEMBER" to test
};

const dummySermons = [
  {
    id: 1,
    title: "Overcoming Challenges in Faith",
    author: "Pastor John",
    topic: "Faith",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    captions: [
      { start: 0, end: 5, text: "Welcome to ICC CTC Church!" },
      { start: 5, end: 12, text: "Today's message: Overcoming Challenges in Faith." },
      { start: 12, end: 20, text: "Let us grow together in Christ." },
    ],
  },
  {
    id: 2,
    title: "The Power of Prayer",
    author: "Mentor Grace",
    topic: "Prayer",
    url: "https://www.w3schools.com/html/movie.mp4",
    captions: [
      { start: 0, end: 6, text: "Prayer opens doors." },
      { start: 6, end: 15, text: "Never stop praying." },
    ],
  },
  {
    id: 3,
    title: "Serving Others",
    author: "Pastor Mary",
    topic: "Service",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    captions: [
      { start: 0, end: 7, text: "Service is love in action." },
      { start: 7, end: 14, text: "Serve with joy." },
    ],
  },
];

const reactionsList = ["👍", "🙏", "❤️", "👏", "🔥"];

export default function SermonsPage() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentSermon, setCurrentSermon] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  // Captions logic
  const currentCaption = currentSermon?.captions?.find(
    (cap: any) => currentTime >= cap.start && currentTime < cap.end
  )?.text;

  // Unique topics & authors
  const topics = Array.from(new Set(dummySermons.map((s) => s.topic)));
  const authors = selectedTopic
    ? Array.from(new Set(dummySermons.filter((s) => s.topic === selectedTopic).map((s) => s.author)))
    : [];

  // Filter sermons
  const filteredSermons = dummySermons.filter((s) => {
    return (
      (!selectedTopic || s.topic === selectedTopic) &&
      (!selectedAuthor || s.author === selectedAuthor)
    );
  });

  // Controls
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
  };

  const handleFullScreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleSeek = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  const handleReaction = (r: string) => {
    setReactions({ ...reactions, [r]: (reactions[r] || 0) + 1 });
  };

  // View toggles
  const showTopicsOnly = !selectedTopic;
  const showVideos = !!selectedTopic;
  const showVideoPlayer = !!currentSermon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      <Header pageName="Sermons" userEmail={user.email} />

      {/* Hero Banner */}
      <section className="relative w-full h-72 flex items-center justify-center text-center bg-gradient-to-r from-purple-700 to-pink-600 text-white">
        <div>
          <h1 className="text-5xl font-extrabold mb-2">Explore Our Sermons</h1>
          <p className="text-lg italic opacity-90">
            “Faith comes by hearing the word of Christ.” – Romans 10:17
          </p>
        </div>
      </section>

      <main className="flex flex-col px-4 md:px-12 lg:px-24 -mt-12 z-10">
        {/* Sermon Upload Section (shown only when upload button is clicked) */}
        {(user.role === "ADMIN" || user.role === "PASTOR" || user.role === "MENTOR") && showUpload && (
          <SermonUpload userId={user.id} onClose={() => setShowUpload(false)} />
        )}
        {/* Filter Section */}
        <section className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 mb-12 items-center justify-center">
          <div className="flex gap-2 items-center">
            <span className="text-purple-700 font-semibold">📖 Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setSelectedAuthor("");
                setCurrentSermon(null);
              }}
              className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-purple-400 text-gray-800"
            >
              <option value="">All</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          {showVideos && (
            <div className="flex gap-2 items-center">
              <span className="text-purple-700 font-semibold">👤 Author:</span>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-purple-400 text-gray-800"
              >
                <option value="">All</option>
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* Topic Grid */}
        {showTopicsOnly && (
          <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {topics.map((topic) => (
              <div
                key={topic}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 cursor-pointer transition-transform hover:scale-105 text-center"
                onClick={() => setSelectedTopic(topic)}
              >
                <h2 className="text-2xl font-bold text-purple-700 mb-2 hover:text-pink-600 transition">
                  {topic}
                </h2>
                <p className="text-gray-600">
                  View sermons about <span className="font-semibold">{topic}</span>
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Sermon Cards */}
        {showVideos && !showVideoPlayer && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredSermons.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => setCurrentSermon(s)}
              >
                <div className="h-40 bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center text-3xl font-bold text-purple-700">
                  🎥
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-purple-700 mb-2">{s.title}</h2>
                  <p className="text-gray-600">👤 {s.author}</p>
                  <p className="text-gray-500 text-sm">📖 {s.topic}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Video Player */}
        {showVideoPlayer && (
          <section className="w-full flex flex-col justify-center items-center mb-16">
            <div className="w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
              <h2 className="text-3xl font-extrabold text-purple-700 mb-2 text-center">
                {currentSermon.title}
              </h2>
              <h3 className="text-lg text-gray-600 mb-6 font-semibold text-center">
                By {currentSermon.author}
              </h3>

              <div className="relative w-full flex justify-center">
                <video
                  ref={videoRef}
                  src={currentSermon.url}
                  className="w-full h-[70vh] max-h-[700px] rounded-xl shadow-lg bg-black object-contain"
                  controls={false}
                  onTimeUpdate={(e) =>
                    setCurrentTime((e.target as HTMLVideoElement).currentTime)
                  }
                />
                {currentCaption && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded text-lg font-semibold">
                    {currentCaption}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-4 items-center mt-6 flex-wrap justify-center">
                <button
                  onClick={() => handleSeek(-10)}
                  className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700"
                >
                  <FaBackward />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700"
                >
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={() => handleSeek(10)}
                  className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700"
                >
                  <FaForward />
                </button>
                <button
                  onClick={handleFullScreen}
                  className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700"
                >
                  <FaExpand />
                </button>

                <div className="flex items-center gap-2 ml-4">
                  <span className="font-semibold">Speed:</span>
                  {[0.5, 1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-3 py-1 rounded font-semibold ${
                        speed === s
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-purple-700 hover:bg-gray-300"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Reactions */}
              {user.isLoggedIn && (
                <div className="flex gap-3 mt-8 flex-wrap justify-center">
                  {reactionsList.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleReaction(r)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xl"
                    >
                      {r} {reactions[r] || 0}
                    </button>
                  ))}
                </div>
              )}

              {/* Comments */}
              {user.isLoggedIn && (
                <div className="flex flex-col bg-gray-50 rounded-2xl shadow-xl p-6 mt-10 w-full max-w-3xl">
                  <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">
                    Comments
                  </h3>
                  <form onSubmit={handleComment} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-purple-400 outline-none text-gray-900 placeholder-gray-600"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-lg font-bold hover:opacity-90"
                    >
                      Post
                    </button>
                  </form>
                  <div>
                    {comments.length > 0 ? (
                      <ul className="space-y-3">
                        {comments.map((c, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 bg-gray-100 rounded-xl px-4 py-2 text-gray-900"
                          >
                            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                              {user.email[0].toUpperCase()}
                            </div>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 italic text-center">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Floating Upload Button (visible for admin/pastor/mentor) */}
        {(user.role === "ADMIN" || user.role === "PASTOR" || user.role === "MENTOR") && !showUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:opacity-90 transition text-3xl z-50"
            title="Upload Sermon"
          >
            ➕
          </button>
        )}
      </main>

  <Footer />
    </div>
  );
}

// SermonUpload component

function SermonUpload({ userId, onClose }: { userId: number; onClose?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Optionally, trigger a refresh of sermons after upload (dummy for now)
  const refreshSermons = () => {
    window.location.reload(); // Replace with smarter fetch if using real data
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess(false);
    setProgress(0);
    if (!title || !description || !video) {
      setError("All fields are required.");
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    formData.append("uploadedById", String(userId));
    try {
      // Use XMLHttpRequest for progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/sermon");
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
            setVideo(null);
            setProgress(100);
            setTimeout(() => {
              setSuccess(false);
              refreshSermons();
            }, 1200);
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
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and dim */}
      <div className="absolute inset-0 bg-opacity-10 backdrop-blur-sm" />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto mb-10 relative z-10">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-purple-700 text-2xl font-bold"
            title="Close"
          >
            &times;
          </button>
        )}
        <h2 className="text-2xl font-extrabold text-purple-700 mb-4 text-center">Upload Sermon</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Sermon Title (e.g. 'Faith That Moves Mountains')"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <textarea
            placeholder="Description (e.g. 'A message about overcoming doubt through faith.')"
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
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-lg font-bold hover:opacity-90"
          >
            {uploading ? (progress > 0 ? `Uploading... ${progress}%` : "Uploading...") : "Upload Sermon"}
          </button>
        </form>
        {success && <p className="text-green-600 mt-4 text-center font-semibold">Sermon uploaded successfully!</p>}
        {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
        <div className="text-xs text-gray-500 mt-2 text-center">Max file size: 500MB. Supported formats: mp4, mov, avi, etc.</div>
      </div>
    </div>
  );
}