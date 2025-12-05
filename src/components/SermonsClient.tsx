"use client";
import React, { useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FaPlay, FaPause, FaExpand, FaForward, FaBackward } from "react-icons/fa";

interface Sermon {
  id: number;
  title: string;
  author?: string | null;
  topic?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  coverImage?: string | null;
  description?: string | null;
  captions?: Caption[];
  comments?: Comment[];
  reactions?: Reaction[];
}

interface Comment {
  id: number;
  message: string;
  userId?: number | null;
  sermonId?: number;
  createdAt: Date;
}

interface Reaction {
  id: number;
  emoji: string;
  userId?: number | null;
  sermonId?: number;
  createdAt: Date;
}

interface Caption {
  start: number;
  end: number;
  text: string;
}

interface User {
  id: number;
  email: string;
  role: string;
  isLoggedIn: boolean;
}

type Props = {
  initialSermons: Sermon[];
  user: User;
  uploadAction?: (formData: FormData) => Promise<unknown>;
  addCommentAction?: (sermonId: number, message: string, userId?: number) => Promise<unknown>;
  toggleReactionAction?: (sermonId: number, emoji: string, userId?: number) => Promise<unknown>;
};

export default function SermonsClient({ initialSermons, user, uploadAction, addCommentAction, toggleReactionAction }: Props) {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const reactionsList = ["👍", "🙏", "❤️", "👏", "🔥"];

  const currentCaption = currentSermon?.captions?.find((cap: Caption) => currentTime >= cap.start && currentTime < cap.end)?.text;

  const topics = Array.from(new Set(initialSermons.map((s) => s.topic || "General")));
  const authors = selectedTopic
    ? Array.from(new Set(initialSermons.filter((s) => (s.topic || "General") === selectedTopic).map((s) => s.author || "Unknown")))
    : [];

  const filteredSermons = initialSermons.filter((s) => {
    const matchesTopic = !selectedTopic || (s.topic || "General") === selectedTopic;
    const matchesAuthor = !selectedAuthor || (s.author || "Unknown") === selectedAuthor;
    const matchesSearch =
      !searchQuery || (s.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || (s.author || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesAuthor && matchesSearch;
  });

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
    if (videoRef.current && videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const handleSeek = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const text = comment.trim();
    setComments((c) => [...c, text]);
    setComment("");
    try {
      if (addCommentAction && currentSermon?.id) {
        await addCommentAction(currentSermon.id, text, user.id);
      }
    } catch (err) {
      console.error("addComment failed", err);
    }
  };

  const handleReaction = async (r: string) => {
    setReactions((prev) => ({ ...prev, [r]: (prev[r] || 0) + 1 }));
    try {
      if (toggleReactionAction && currentSermon?.id) {
        await toggleReactionAction(currentSermon.id, r, user.id);
      }
    } catch (err) {
      console.error("toggleReaction failed", err);
    }
  };

  // simple upload handler inside client; calls server action passed in
  const submitUpload = async (form: HTMLFormElement) => {
    if (!uploadAction) return;
    setUploadError("");
    setUploading(true);
    try {
      const fd = new FormData(form);
      await uploadAction(fd);
      setShowUpload(false);
      window.location.reload();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const showTopicsOnly = !selectedTopic;
  const showVideos = !!selectedTopic;
  const showVideoPlayer = !!currentSermon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      <Header pageName="Sermons" userEmail={user.email} />

      <main className="flex flex-col px-4 md:px-8 lg:px-16 -mt-16 z-10 pb-12">
        {(user.role === "ADMIN" || user.role === "PASTOR" || user.role === "MENTOR") && showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto mb-10 relative z-10">
              <button onClick={() => setShowUpload(false)} className="absolute top-4 right-4 text-gray-400 hover:text-purple-700 text-2xl font-bold">&times;</button>
              <h2 className="text-2xl font-extrabold text-purple-700 mb-4 text-center">Upload Sermon</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitUpload(e.currentTarget as HTMLFormElement);
                }}
                className="flex flex-col gap-4"
              >
                <input name="title" type="text" placeholder="Sermon Title" className="border border-gray-300 rounded px-4 py-2" required />
                <textarea name="description" placeholder="Description" className="border border-gray-300 rounded px-4 py-2" />
                <input name="topic" type="text" placeholder="Topic" className="border border-gray-300 rounded px-4 py-2" />
                <input name="author" type="text" placeholder="Author" className="border border-gray-300 rounded px-4 py-2" />
                <input name="video" type="file" accept="video/*" className="border border-gray-300 rounded px-4 py-2" />
                <input name="uploadedById" type="hidden" value={String(user.id)} />
                {uploadError && <div className="text-red-600">{uploadError}</div>}
                <div className="flex items-center justify-between">
                  <button type="submit" disabled={uploading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-lg font-bold">
                    {uploading ? "Uploading..." : "Upload Sermon"}
                  </button>
                  <button type="button" onClick={() => setShowUpload(false)} className="text-sm text-gray-600">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="bg-gradient-to-r from-purple-800/80 via-pink-800/70 to-indigo-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-16 border border-white/10">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search sermons by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all backdrop-blur-sm"
              />
            </div>

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
                  <option value="" className="text-gray-900">
                    All Topics
                  </option>
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
                  <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)} className="px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all">
                    <option value="" className="text-gray-900">
                      All Authors
                    </option>
                    {authors.map((a) => (
                      <option key={a} value={a} className="text-gray-900">
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </section>

        {showTopicsOnly && (
          <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {topics.map((topic) => (
              <div key={topic} onClick={() => setSelectedTopic(topic)} className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl hover:shadow-2xl p-8 cursor-pointer transition-all hover:scale-105 border border-white/10 hover:border-white/30 backdrop-blur-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-pink-300 transition">{topic}</h2>
                <p className="text-gray-300 mb-4">{initialSermons.filter((s) => (s.topic || "General") === topic).length} sermons</p>
                <p className="text-gray-400 text-sm">Explore spiritual growth through {topic.toLowerCase()}</p>
              </div>
            ))}
          </section>
        )}

        {showVideos && !showVideoPlayer && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredSermons.map((s) => (
              <div key={s.id} onClick={() => setCurrentSermon(s)} className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 border border-white/10 hover:border-white/30 backdrop-blur-sm">
                <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-5xl overflow-hidden">
                  <div className="relative z-10">🎥</div>
                </div>
                <div className="p-6 relative z-10">
                  <div className="inline-block bg-pink-500/30 text-pink-200 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">{s.topic}</div>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition line-clamp-2">{s.title}</h2>
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-2"><span>👤</span><span className="font-semibold">{s.author}</span></div>
                </div>
              </div>
            ))}
          </section>
        )}

        {showVideoPlayer && (
          <section className="w-full flex flex-col justify-center items-center mb-16">
            <button onClick={() => setCurrentSermon(null)} className="self-start mb-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20 font-semibold backdrop-blur-sm">← Back to Sermons</button>

            <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">{currentSermon.title}</h2>
              <h3 className="text-lg text-gray-300 mb-2 font-semibold text-center">By <span className="text-pink-300">{currentSermon.author}</span></h3>
              <div className="inline-block bg-gradient-to-r from-pink-500/40 to-purple-500/40 text-pink-200 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">📖 {currentSermon.topic}</div>

              <div className="relative w-full flex justify-center rounded-2xl overflow-hidden shadow-2xl">
                <video ref={videoRef} src={currentSermon.videoUrl || ""} className="w-full h-[60vh] md:h-[70vh] max-h-[700px] bg-black object-contain" controls={false} onTimeUpdate={(e) => { setCurrentTime((e.target as HTMLVideoElement).currentTime); setDuration((e.target as HTMLVideoElement).duration); }} />
                {currentCaption && <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-xl text-base md:text-lg font-semibold backdrop-blur-sm border border-white/20">{currentCaption}</div>}
              </div>

              <div className="w-full mt-6 flex flex-col gap-2">
                <div className="w-full bg-white/10 rounded-full h-2 cursor-pointer group">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all group-hover:h-3" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-300"><span>{Math.floor(currentTime)}s</span><span>{Math.floor(duration)}s</span></div>
              </div>

              <div className="flex gap-3 md:gap-4 items-center mt-8 flex-wrap justify-center">
                <button onClick={() => handleSeek(-10)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="Rewind 10s"><FaBackward className="text-lg" /></button>

                <button onClick={handlePlayPause} className="bg-gradient-to-r from-pink-600 to-red-600 text-white p-4 rounded-full hover:scale-110 transition-transform shadow-lg" title={playing ? "Pause" : "Play"}>
                  {playing ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                </button>

                <button onClick={() => handleSeek(10)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="Forward 10s"><FaForward className="text-lg" /></button>
                <div className="w-px h-8 bg-white/20" />
                <button onClick={handleFullScreen} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="Fullscreen"><FaExpand className="text-lg" /></button>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="font-semibold text-white text-sm md:text-base">Speed:</span>
                  {[0.5, 1, 1.5, 2].map((s) => (
                    <button key={s} onClick={() => handleSpeedChange(s)} className={`px-3 py-1 rounded-lg font-semibold transition-all ${speed === s ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"}`}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {user.isLoggedIn && (
                <div className="flex gap-3 mt-8 flex-wrap justify-center">
                  <span className="text-white font-semibold mr-2 self-center">React:</span>
                  {reactionsList.map((r) => (
                    <button key={r} onClick={() => handleReaction(r)} className="px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-full text-lg font-semibold transition-all border border-white/20 hover:border-white/40 backdrop-blur-sm">{r} <span className="text-gray-300 ml-1">{reactions[r] || 0}</span></button>
                  ))}
                </div>
              )}

              {user.isLoggedIn && (
                <div className="flex flex-col bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl p-8 mt-12 w-full max-w-3xl border border-white/10 backdrop-blur-sm">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">💬 Community Insights</h3>
                  <form onSubmit={handleComment} className="flex gap-3 mb-6 flex-col sm:flex-row">
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." className="border border-white/20 rounded-lg px-4 py-3 w-full bg-white/10 focus:bg-white/15 focus:ring-2 focus:ring-pink-400 outline-none text-white placeholder-gray-300 backdrop-blur-sm transition-all" />
                    <button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap">Post</button>
                  </form>

                  <div>
                    {comments.length > 0 ? (
                      <ul className="space-y-4">
                        {comments.map((c, i) => (
                          <li key={i} className="flex items-start gap-3 bg-white/10 rounded-xl px-4 py-3 text-white border border-white/10 hover:border-white/30 transition-all backdrop-blur-sm">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">{user.email[0].toUpperCase()}</div>
                            <div className="flex-1">
                              <p className="font-semibold text-pink-300 text-sm mb-1">{user.email}</p>
                              <p className="text-gray-100">{c}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300 italic text-center py-8 text-lg">✨ No comments yet. Start the conversation!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}