// components/gallery/VideoModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, Maximize2, Calendar, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { VideoItem } from './data';

interface VideoModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setProgress(0);
    }
  }, [isOpen]);

  if (!video) return null;

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-w-6xl w-full"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-10"
              aria-label="Close video"
            >
              <X size={32} />
            </button>

            {/* Custom Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              {/* YouTube iframe */}
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?controls=0&modestbranding=1&rel=0&autoplay=${isPlaying ? 1 : 0}&mute=0&volume=${volume / 100}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />

              {/* Custom Play/Pause Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    aria-label="Play video"
                  >
                    <Play size={48} className="ml-2" />
                  </button>
                </div>
              )}

              {/* Custom Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-cyan-400 transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <Volume2 size={20} className="text-gray-300" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-24 accent-cyan-500"
                      />
                    </div>
                  </div>
                  
                  <button className="text-white hover:text-cyan-400 transition-colors">
                    <Maximize2 size={24} />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    style={{ width: `${progress}%` }}
                    animate={{ width: isPlaying ? '100%' : `${progress}%` }}
                    transition={{ duration: 300, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6 p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-3xl font-bold">{video.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1.5 bg-cyan-500/30 text-cyan-300 rounded-lg font-medium">
                    {video.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-3">
                <Tag size={20} className="text-cyan-400" />
                <div className="flex flex-wrap gap-2">
                  {video.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* YouTube Link */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <a
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}