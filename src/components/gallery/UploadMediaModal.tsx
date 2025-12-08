// components/gallery/UploadMediaModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ALL_TAGS, CATEGORIES, MediaCategory } from './data';

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    type: 'image' | 'video';
    title: string;
    category: MediaCategory;
    tags: string[];
    file?: File;
    youtubeId?: string;
  }) => Promise<void>;
}

export default function UploadMediaModal({ isOpen, onClose, onSubmit }: UploadMediaModalProps) {
  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    title: '',
    category: 'topic' as MediaCategory,
    tags: [] as string[],
    file: undefined as File | undefined,
    youtubeId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        type: 'image',
        title: '',
        category: 'topic',
        tags: [],
        file: undefined,
        youtubeId: ''
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-w-md w-full bg-gray-900 rounded-2xl p-6 border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Upload Media
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Media Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Media Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'image' }))}
                    className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-lg transition-all ${
                      formData.type === 'image'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <ImageIcon size={20} />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'video' }))}
                    className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-lg transition-all ${
                      formData.type === 'video'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <Video size={20} />
                    Video
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter media title"
                  disabled={isSubmitting}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <div className="flex gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        formData.category === cat
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      disabled={isSubmitting}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ALL_TAGS.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.includes(tag)
                            ? prev.tags.filter(t => t !== tag)
                            : [...prev.tags, tag]
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.tags.includes(tag)
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-400'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      disabled={isSubmitting}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload / YouTube ID */}
              {formData.type === 'image' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image File
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFormData(prev => ({ ...prev, file }));
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {formData.file ? formData.file.name : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Or leave empty to use a random image
                      </p>
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube Video ID
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtubeId: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter YouTube video ID"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use a default video
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  'Upload Media'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}