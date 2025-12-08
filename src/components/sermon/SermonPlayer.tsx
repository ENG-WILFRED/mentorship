"use client";
import React from "react";
import VideoPlayer from "./VideoPlayer";
import Reactions from "./Reactions";
import Comments from "./Comments";

interface Sermon {
  youtubeId?: string | null;
  id: number;
  title: string;
  author?: string | null;
  topic?: string | null;
  videoUrl?: string | null;
  description?: string | null;
  captions?: Array<{ start: number; end: number; text: string }>;
}

interface User {
  id: number;
  email: string;
  isLoggedIn: boolean;
}

interface SermonPlayerProps {
  currentSermon: Sermon;
  onBack: () => void;
  playing: boolean;
  onPlayPause: () => void;
  onSeek: (amount: number) => void;
  onFullScreen: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentTime: number;
  duration: number;
  currentCaption?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: (time: number, duration: number) => void;
  reactions: Record<string, number>;
  onReaction: (emoji: string) => void;
  reactionsList: string[];
  comments: string[];
  newComment: string;
  onCommentChange: (text: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  user: User;
}

export default function SermonPlayer({
  currentSermon,
  onBack,
  playing,
  onPlayPause,
  onSeek,
  onFullScreen,
  speed,
  onSpeedChange,
  currentTime,
  duration,
  currentCaption,
  videoRef,
  onTimeUpdate,
  reactions,
  onReaction,
  reactionsList,
  comments,
  newComment,
  onCommentChange,
  onSubmitComment,
  user,
}: SermonPlayerProps) {
  return (
    <section className="w-full flex flex-col justify-center items-center mb-16">
      <button
        onClick={onBack}
        className="self-start mb-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-all font-semibold flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="w-full bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-white/10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
          {currentSermon.title}
        </h2>
        <h3 className="text-lg text-gray-200 mb-4 font-semibold text-center">
          By <span className="text-pink-300">{currentSermon.author || "Unknown"}</span>
        </h3>
        <div className="inline-block bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-200 px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm border border-white/10">
          📖 {currentSermon.topic}
        </div>

        <VideoPlayer
          currentSermon={currentSermon}
          playing={playing}
          onPlayPause={onPlayPause}
          onSeek={onSeek}
          onFullScreen={onFullScreen}
          speed={speed}
          onSpeedChange={onSpeedChange}
          currentTime={currentTime}
          duration={duration}
          currentCaption={currentCaption}
          videoRef={videoRef}
          onTimeUpdate={onTimeUpdate}
        />

        <Reactions
          reactions={reactions}
          onReaction={onReaction}
          user={user}
          reactionsList={reactionsList}
        />

        <Comments
          comments={comments}
          newComment={newComment}
          onCommentChange={onCommentChange}
          onSubmitComment={onSubmitComment}
          user={user}
        />
      </div>
    </section>
  );
}
