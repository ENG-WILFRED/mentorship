"use client";
import React, { useRef, useState } from "react";
import Footer from "./Footer";
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
  const authors = selectedTopic
    ? Array.from(
        new Set(
          initialSermons
            .filter((s) => (s.topic || "General") === selectedTopic)
            .map((s) => s.author || "Unknown")
        )
      )
    : [];

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

  const showTopicsOnly = !selectedTopic;
  const showVideos = !!selectedTopic;
  const showVideoPlayer = !!currentSermon;

  return (
    <div
      className={`min-h-screen flex flex-col ${
        showVideoPlayer
          ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
          : "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      }`}
    >

      <main className="flex flex-col px-4 md:px-8 lg:px-16 pt-8 z-10 pb-16">
        <HeroSection showHero={!showVideoPlayer} />

        {!showVideoPlayer && (
          <SearchFilter
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            topics={topics}
            authors={authors}
            showVideos={showVideos}
            user={user}
          />
        )}

        {showTopicsOnly && (
          <TopicsGrid
            topics={topics}
            initialSermons={initialSermons}
            onSelectTopic={setSelectedTopic}
          />
        )}

        {showVideos && !showVideoPlayer && (
          <SermonsGrid
            sermons={filteredSermons}
            onSelectSermon={setCurrentSermon}
            selectedTopic={selectedTopic}
          />
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
      </main>

      <Footer />
    </div>
  );
}