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
  const [currentSermon, setCurrentSermon] = useState<{
    id?: number;
    title?: string;
    author?: string;
    topic?: string;
    url?: string;
    captions?: Array<{ start: number; end: number; text: string }>;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Captions logic
  const currentCaption = currentSermon?.captions?.find(
    (cap: { start: number; end: number; text: string }) => currentTime >= cap.start && currentTime < cap.end
  )?.text;

  // Unique topics & authors
  const topics = Array.from(new Set(dummySermons.map((s) => s.topic)));
  const authors = selectedTopic
    ? Array.from(new Set(dummySermons.filter((s) => s.topic === selectedTopic).map((s) => s.author)))
    : [];

  // Filter sermons
  const filteredSermons = dummySermons.filter((s) => {
    const matchesTopic = !selectedTopic || s.topic === selectedTopic;
    const matchesAuthor = !selectedAuthor || s.author === selectedAuthor;
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesAuthor && matchesSearch;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      <Header pageName="Sermons" userEmail={user.email} />

      {/* Hero Banner with dynamic background */}
      <section className="relative w-full h-80 md:h-96 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-purple-950/70 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 text-white drop-shadow-lg">✨ Explore Our Sermons</h1>
          <p className="text-lg md:text-xl italic opacity-90 text-gray-100 drop-shadow-md">
            &quot;Faith comes by hearing the word of Christ.&quot; – Romans 10:17
          </p>
          <p className="text-sm md:text-base mt-4 opacity-80 text-gray-200">{filteredSermons.length} sermons available</p>
        </div>
      </section>

      <main className="flex flex-col px-4 md:px-8 lg:px-16 -mt-16 z-10 pb-12">
        {/* Sermon Upload Section */}
        {(user.role === "ADMIN" || user.role === "PASTOR" || user.role === "MENTOR") && showUpload && (
          <SermonUpload userId={user.id} onClose={() => setShowUpload(false)} />
        )}
        
        {/* Filter & Search Section */}
        <section className="bg-gradient-to-r from-purple-800/80 via-pink-800/70 to-indigo-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-16 border border-white/10">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search sermons by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all backdrop-blur-sm"
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-white font-semibold text-sm">📖 Filter by Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    setSelectedAuthor("");
                    setCurrentSermon(null);
                  }}
                  className="px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all"
                >
                  <option value="" className="text-gray-900">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic} className="text-gray-900">
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
              
              {showVideos && (
                <div className="flex flex-col gap-2">
                  <label className="text-white font-semibold text-sm">👤 Filter by Author</label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all"
                  >
                    <option value="" className="text-gray-900">All Authors</option>
                    {authors.map((author) => (
                      <option key={author} value={author} className="text-gray-900">
                        {author}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Topic Grid */}
        {showTopicsOnly && (
          <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {topics.map((topic, idx) => {
              const icons = ["📖", "🙏", "✝️"];
              const colors = [
                "from-purple-600 to-pink-600",
                "from-pink-600 to-red-600",
                "from-blue-600 to-purple-600"
              ];
              return (
                <div
                  key={topic}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl hover:shadow-2xl p-8 cursor-pointer transition-all hover:scale-105 border border-white/10 hover:border-white/30 backdrop-blur-sm"
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity" />
                  <div className={`bg-gradient-to-br ${colors[idx % colors.length]} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {icons[idx % icons.length]}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-pink-300 transition">
                    {topic}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {dummySermons.filter(s => s.topic === topic).length} sermons
                  </p>
                  <p className="text-gray-400 text-sm">Explore spiritual growth through {topic.toLowerCase()}</p>
                </div>
              );
            })}
          </section>
        )}

        {/* Sermon Cards */}
        {showVideos && !showVideoPlayer && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredSermons.length > 0 ? (
              filteredSermons.map((s) => (
                <div
                  key={s.id}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 border border-white/10 hover:border-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentSermon(s)}
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-5xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-pink-500/40 group-hover:from-purple-400/60 group-hover:to-pink-400/60 transition-all" />
                    <div className="relative z-10 group-hover:scale-125 transition-transform">🎥</div>
                  </div>
                  <div className="p-6 relative z-10">
                    <div className="inline-block bg-pink-500/30 text-pink-200 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">
                      {s.topic}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition line-clamp-2">{s.title}</h2>
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                      <span>👤</span>
                      <span className="font-semibold">{s.author}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-xs text-gray-400">Click to watch</span>
                      <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No sermons found matching your filters</p>
              </div>
            )}
          </section>
        )}

        {/* Video Player */}
        {showVideoPlayer && (
          <section className="w-full flex flex-col justify-center items-center mb-16">
            <button
              onClick={() => setCurrentSermon(null)}
              className="self-start mb-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20 font-semibold backdrop-blur-sm"
            >
              ← Back to Sermons
            </button>
            <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">
                {currentSermon.title}
              </h2>
              <h3 className="text-lg text-gray-300 mb-2 font-semibold text-center">
                By <span className="text-pink-300">{currentSermon.author}</span>
              </h3>
              <div className="inline-block bg-gradient-to-r from-pink-500/40 to-purple-500/40 text-pink-200 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">
                📖 {currentSermon.topic}
              </div>

              <div className="relative w-full flex justify-center rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={currentSermon.url}
                  className="w-full h-[60vh] md:h-[70vh] max-h-[700px] bg-black object-contain"
                  controls={false}
                  onTimeUpdate={(e) => {
                    setCurrentTime((e.target as HTMLVideoElement).currentTime);
                    setDuration((e.target as HTMLVideoElement).duration);
                  }}
                />
                {currentCaption && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-xl text-base md:text-lg font-semibold backdrop-blur-sm border border-white/20">
                    {currentCaption}
                  </div>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full mt-6 flex flex-col gap-2">
                <div className="w-full bg-white/10 rounded-full h-2 cursor-pointer group">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all group-hover:h-3"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    onClick={(e) => {
                      if (videoRef.current) {
                        const bounds = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - bounds.left) / bounds.width;
                        videoRef.current.currentTime = percent * duration;
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{Math.floor(currentTime)}s</span>
                  <span>{Math.floor(duration)}s</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3 md:gap-4 items-center mt-8 flex-wrap justify-center">
                <button
                  onClick={() => handleSeek(-10)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="Rewind 10s"
                >
                  <FaBackward className="text-lg" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="bg-gradient-to-r from-pink-600 to-red-600 text-white p-4 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title={playing ? "Pause" : "Play"}
                >
                  {playing ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                </button>
                <button
                  onClick={() => handleSeek(10)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="Forward 10s"
                >
                  <FaForward className="text-lg" />
                </button>
                <div className="w-px h-8 bg-white/20" />
                <button
                  onClick={handleFullScreen}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="Fullscreen"
                >
                  <FaExpand className="text-lg" />
                </button>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="font-semibold text-white text-sm md:text-base">Speed:</span>
                  {[0.5, 1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        speed === s
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
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
                  <span className="text-white font-semibold mr-2 self-center">React:</span>
                  {reactionsList.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleReaction(r)}
                      className="px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full text-lg font-semibold transition-all border border-white/20 hover:border-white/40 backdrop-blur-sm"
                    >
                      {r} <span className="text-gray-300 ml-1">{reactions[r] || 0}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Comments */}
              {user.isLoggedIn && (
                <div className="flex flex-col bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl p-8 mt-12 w-full max-w-3xl border border-white/10 backdrop-blur-sm">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    💬 Community Insights
                  </h3>
                  <form onSubmit={handleComment} className="flex gap-3 mb-6 flex-col sm:flex-row">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="border border-white/20 rounded-lg px-4 py-3 w-full bg-white/10 focus:bg-white/15 focus:ring-2 focus:ring-pink-400 outline-none text-white placeholder-gray-300 backdrop-blur-sm transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap"
                    >
                      Post
                    </button>
                  </form>
                  <div>
                    {comments.length > 0 ? (
                      <ul className="space-y-4">
                        {comments.map((c, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 bg-white/10 rounded-xl px-4 py-3 text-white border border-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">
                              {user.email[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-pink-300 text-sm mb-1">{user.email}</p>
                              <p className="text-gray-100">{c}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300 italic text-center py-8 text-lg">
                        ✨ No comments yet. Start the conversation!
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
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