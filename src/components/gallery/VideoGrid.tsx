// components/gallery/VideoGrid.tsx
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import MediaCard from './MediaCard';
import { VideoItem } from './data';

interface VideoGridProps {
  videos: VideoItem[];
  onVideoClick: (video: VideoItem) => void;
}

export default function VideoGrid({ videos, onVideoClick }: VideoGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {videos.map((video) => (
        <MediaCard
          key={video.id}
          type="video"
          title={video.title}
          category={video.category}
          tags={video.tags}
          createdAt={video.createdAt}
          thumbnail={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
          onClick={() => onVideoClick(video)}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Play size={32} className="ml-1" />
            </div>
          </div>
        </MediaCard>
      ))}
    </motion.div>
  );
}