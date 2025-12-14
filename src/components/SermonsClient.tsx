"use client";
import React, { useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import Footer from "./Footer";
import MentorshipHeader from "./MentorshipHeader";
import HeroSection from "./sermon/HeroSection";
import SearchFilter from "./sermon/SearchFilter";
import TopicsGrid from "./sermon/TopicsGrid";
import SermonsGrid from "./sermon/SermonsGrid";
import SermonPlayer from "./sermon/SermonPlayer";

interface Sermon {
  youtubeId?: string | null;
  id: number;
  title: string;
  author?: string | null;
  topic?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  coverImage?: string | null;
  description?: string | null;
  captions?: Array<{ start: number; end: number; text: string }>;
  comments?: Array<{ id: number; message: string; userId: number | null; sermonId: number; createdAt: Date }>;
  reactions?: Array<{ id: number; emoji: string; userId: number | null; sermonId: number; createdAt: Date }>;
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

export default function SermonsClient({ initialSermons, user }: Props) {
  const [selectedTopic, setSelectedTopic] = useState("");
  const router = useRouter();
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null) as React.MutableRefObject<HTMLVideoElement>;
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const reactionsList = ["👍", "🙏", "❤️", "👏", "🔥"];

  const currentCaption = currentSermon?.captions?.find(
    (cap) => currentTime >= cap.start && currentTime < cap.end
  )?.text;

  const topics = Array.from(
    new Set(initialSermons.map((s) => s.topic || "General"))
  );
  const authors = Array.from(
    new Set(
      initialSermons
        .filter((s) => !selectedTopic || (s.topic || "General") === selectedTopic)
        .map((s) => s.author || "Unknown")
    )
  );

  const filteredSermons = initialSermons.filter((s) => {
    const matchesTopic =
      !selectedTopic || (s.topic || "General") === selectedTopic;
    const matchesAuthor =
      !selectedAuthor || (s.author || "Unknown") === selectedAuthor;
    const matchesSearch =
      !searchQuery ||
      (s.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.author || "").toLowerCase().includes(searchQuery.toLowerCase());
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
    if (videoRef.current && videoRef.current.requestFullscreen)
      videoRef.current.requestFullscreen();
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
  };

  const handleReaction = async (r: string) => {
    setReactions((prev) => ({ ...prev, [r]: (prev[r] || 0) + 1 }));
  };

  const showVideoPlayer = !!currentSermon;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Sticky Header */}
      <MentorshipHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-12 z-10 pb-16">
          {!showVideoPlayer && (
            <>
              <HeroSection showHero={true} />

              <SearchFilter
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                topics={topics}
                authors={authors}
                showVideos={true}
                user={user}
              />

              {/* Topics Grid */}
              {topics.length > 1 && (
                <TopicsGrid
                  topics={topics}
                  initialSermons={initialSermons}
                  onSelectTopic={setSelectedTopic}
                />
              )}

              {/* Sermons Section - Always Visible */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">Sermons Library</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => router.push('/mentor/dashboard')}
                      className="px-4 py-2 bg-white/10 text-white border border-white/10 rounded-lg hover:bg-white/20 transition text-sm sm:text-base"
                    >
                      ← Back to Dashboard
                    </button>
                    <button
                      onClick={() => router.push('/mentor/sermons/upload-sermon')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base"
                    >
                      📤 Upload Sermon
                    </button>
                  </div>
                </div>

                {filteredSermons.length > 0 ? (
                  <SermonsGrid
                    sermons={filteredSermons}
                    onSelectSermon={setCurrentSermon}
                    selectedTopic={selectedTopic}
                  />
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-lg text-gray-300 mb-6">No sermons found for your filters.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {showVideoPlayer && (
            <SermonPlayer
              currentSermon={currentSermon}
              onBack={() => setCurrentSermon(null)}
              playing={playing}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              onFullScreen={handleFullScreen}
              speed={speed}
              onSpeedChange={handleSpeedChange}
              currentTime={currentTime}
              duration={duration}
              currentCaption={currentCaption}
              videoRef={videoRef}
              onTimeUpdate={(time, duration) => {
                setCurrentTime(time);
                setDuration(duration);
              }}
              reactions={reactions}
              onReaction={handleReaction}
              reactionsList={reactionsList}
              comments={comments}
              newComment={comment}
              onCommentChange={setComment}
              onSubmitComment={handleComment}
              user={user}
            />
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}