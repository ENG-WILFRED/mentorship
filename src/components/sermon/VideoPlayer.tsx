"use client";
import React from "react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaForward,
  FaBackward,
} from "react-icons/fa";

interface VideoPlayerProps {
  currentSermon: Sermon;
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
}

interface Sermon {
  youtubeId?: string | null;
  videoUrl?: string | null;
  title: string;
  author?: string | null;
  topic?: string | null;
}

export default function VideoPlayer({
  currentSermon,
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
}: VideoPlayerProps) {
  return (
    <div className="relative w-full flex justify-center rounded-2xl overflow-hidden shadow-2xl">
      {currentSermon.videoUrl ? (
        <video
          ref={videoRef}
          src={currentSermon.videoUrl}
          className="w-full h-[60vh] md:h-[70vh] max-h-[700px] bg-black object-contain"
          controls={false}
          onTimeUpdate={(e) => {
            const target = e.target as HTMLVideoElement;
            onTimeUpdate(target.currentTime, target.duration);
          }}
        />
      ) : currentSermon.youtubeId ? (
        <iframe
          title="YouTube Sermon Player"
          src={`https://www.youtube.com/embed/${currentSermon.youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <div className="w-full h-[60vh] md:h-[70vh] max-h-[700px] bg-black flex items-center justify-center text-gray-400">
          No video available
        </div>
      )}
      {currentCaption && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-xl text-base md:text-lg font-semibold backdrop-blur-sm border border-white/20">
          {currentCaption}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/80 to-transparent">
        <div className="w-full bg-slate-800/30 rounded-full h-2 cursor-pointer group">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all group-hover:h-3"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>{Math.floor(currentTime)}s</span>
          <span>{Math.floor(duration)}s</span>
        </div>

        <div className="flex gap-3 md:gap-4 items-center mt-4 flex-wrap justify-center">
          <button
            onClick={() => onSeek(-10)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
            title="Rewind 10s"
          >
            <FaBackward className="text-lg" />
          </button>

          <button
            onClick={onPlayPause}
            className="bg-gradient-to-r from-pink-600 to-red-600 text-white p-4 rounded-full hover:scale-110 transition-transform shadow-lg"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <FaPause className="text-xl" />
            ) : (
              <FaPlay className="text-xl" />
            )}
          </button>

          <button
            onClick={() => onSeek(10)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
            title="Forward 10s"
          >
            <FaForward className="text-lg" />
          </button>
          <div className="w-px h-8 bg-white/20" />
          <button
            onClick={onFullScreen}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
            title="Fullscreen"
          >
            <FaExpand className="text-lg" />
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-semibold text-white text-sm md:text-base">
              Speed:
            </span>
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
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
      </div>
    </div>
  );
}
