// components/gallery/LightboxModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { ImageItem } from './data';

interface LightboxModalProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LightboxModal({ image, isOpen, onClose }: LightboxModalProps) {
  if (!image) return null;

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
            className="relative max-w-6xl w-full max-h-[90vh]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            {/* Image container */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-900">
              <Image
                src={image.img}
                alt={image.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Image info */}
            <div className="mt-6 p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-3xl font-bold">{image.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1.5 bg-purple-500/30 text-purple-300 rounded-lg font-medium">
                    {image.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    {new Date(image.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-3 mb-6">
                <Tag size={20} className="text-cyan-400" />
                <div className="flex flex-wrap gap-2">
                  {image.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                <a
                  href={image.img}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ExternalLink size={16} />
                  Open Original
                </a>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity">
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}