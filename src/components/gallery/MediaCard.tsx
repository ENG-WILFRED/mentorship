// components/gallery/MediaCard.tsx
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { MediaCategory } from './data';

interface MediaCardProps {
  type: 'image' | 'video';
  title: string;
  category: MediaCategory;
  tags: string[];
  createdAt: string;
  thumbnail: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export default function MediaCard({
  type,
  title,
  category,
  tags,
  createdAt,
  thumbnail,
  onClick,
  children
}: MediaCardProps) {
  const isImage = type === 'image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Type indicator */}
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold ${
            isImage
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-cyan-500/20 text-cyan-300'
          }`}>
            {isImage ? 'IMAGE' : 'VIDEO'}
          </div>

          {/* Overlay content */}
          {children}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold truncate mb-2 group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2 py-1 rounded text-xs ${
              isImage
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-cyan-500/20 text-cyan-300'
            }`}>
              {category}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={12} />
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag size={12} className="text-gray-500" />
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 bg-gray-700/50 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}