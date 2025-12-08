// app/gallery/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Upload,
  Play,
  Pause,
  Volume2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Loader2,
  Tag,
  Calendar,
  Eye
} from 'lucide-react';
import { useTheme } from 'next-themes';

// Types
interface MediaItem {
  id: number;
  title: string;
  category: 'school' | 'mentor' | 'topic';
  tags: string[];
  createdAt: string;
}

interface ImageItem extends MediaItem {
  img: string;
}

interface VideoItem extends MediaItem {
  youtubeId: string;
}

type FilterState = {
  category: string | null;
  tags: string[];
  search: string;
  time: 'newest' | 'oldest';
  sort: 'asc' | 'desc';
};

type UploadFormData = {
  type: 'image' | 'video';
  title: string;
  category: 'school' | 'mentor' | 'topic';
  tags: string[];
  file?: File;
  youtubeId?: string;
};

// Dummy Data
const IMAGES: ImageItem[] = [
  {
    id: 1,
    title: "Anime Spirit Glow",
    category: "mentor",
    tags: ["anime", "motivation"],
    img: "https://picsum.photos/seed/anime1/600/600",
    createdAt: "2024-05-02T10:30:00Z"
  },
  {
    id: 2,
    title: "Faith Light Horizon",
    category: "school",
    tags: ["believer", "peace"],
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=600&fit=crop",
    createdAt: "2024-06-10T14:00:00Z"
  },
  {
    id: 3,
    title: "Cyber Anime Street",
    category: "topic",
    tags: ["anime", "inspiration"],
    img: "https://picsum.photos/seed/cyberanime/600/600",
    createdAt: "2024-03-22T18:45:00Z"
  },
  {
    id: 4,
    title: "Divine Connection",
    category: "school",
    tags: ["believer", "peace"],
    img: "https://picsum.photos/seed/divine/600/600",
    createdAt: "2024-04-15T09:20:00Z"
  },
  {
    id: 5,
    title: "Neon Samurai",
    category: "mentor",
    tags: ["anime", "training"],
    img: "https://picsum.photos/seed/neonsamurai/600/600",
    createdAt: "2024-02-28T16:30:00Z"
  },
  {
    id: 6,
    title: "Hope Rising",
    category: "topic",
    tags: ["inspiration", "motivation"],
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop",
    createdAt: "2024-01-10T11:15:00Z"
  },
  {
    id: 7,
    title: "Cyber Faith",
    category: "school",
    tags: ["believer", "anime"],
    img: "https://picsum.photos/seed/cyberfaith/600/600",
    createdAt: "2024-07-01T14:45:00Z"
  },
  {
    id: 8,
    title: "Warrior Spirit",
    category: "mentor",
    tags: ["anime", "training", "motivation"],
    img: "https://picsum.photos/seed/warrior/600/600",
    createdAt: "2024-05-20T08:30:00Z"
  },
  {
    id: 9,
    title: "Serenity",
    category: "topic",
    tags: ["peace", "inspiration"],
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w-600&h=600&fit=crop",
    createdAt: "2024-06-25T19:20:00Z"
  },
  {
    id: 10,
    title: "Neon Evangelion",
    category: "mentor",
    tags: ["anime", "inspiration"],
    img: "https://picsum.photos/seed/neonvangelion/600/600",
    createdAt: "2024-03-15T13:10:00Z"
  },
  {
    id: 11,
    title: "Faith Journey",
    category: "school",
    tags: ["believer", "motivation"],
    img: "https://picsum.photos/seed/faithjourney/600/600",
    createdAt: "2024-04-30T17:45:00Z"
  },
  {
    id: 12,
    title: "Anime Dreams",
    category: "topic",
    tags: ["anime", "peace"],
    img: "https://picsum.photos/seed/animedreams/600/600",
    createdAt: "2024-02-14T10:00:00Z"
  }
];

const VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "Training Series Intro",
    youtubeId: "dQw4w9WgXcQ",
    category: "topic",
    tags: ["training", "intro"],
    createdAt: "2024-05-01T13:20:00Z"
  },
  {
    id: 2,
    title: "Anime Motivation Clip",
    youtubeId: "1xVw6PsSinI",
    category: "mentor",
    tags: ["anime", "inspiration"],
    createdAt: "2024-03-11T08:50:00Z"
  },
  {
    id: 3,
    title: "Faith Documentary Teaser",
    youtubeId: "Sagg08DrO5U",
    category: "school",
    tags: ["believer", "peace"],
    createdAt: "2024-04-05T20:15:00Z"
  },
  {
    id: 4,
    title: "Neon Genesis Tutorial",
    youtubeId: "J---aiyznGQ",
    category: "mentor",
    tags: ["anime", "training"],
    createdAt: "2024-06-18T15:30:00Z"
  },
  {
    id: 5,
    title: "Spiritual Growth Guide",
    youtubeId: "L_jWHffIx5E",
    category: "school",
    tags: ["believer", "inspiration"],
    createdAt: "2024-05-22T11:45:00Z"
  },
  {
    id: 6,
    title: "Cyberpunk Inspiration",
    youtubeId: "9bZkp7q19f0",
    category: "topic",
    tags: ["anime", "motivation"],
    createdAt: "2024-01-30T09:20:00Z"
  }
];

const ALL_TAGS = ["anime", "believer", "inspiration", "peace", "motivation", "training", "intro"];
const CATEGORIES = ["school", "mentor", "topic"];

export default function GalleryPage() {
  // Theme
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    tags: [],
    search: "",
    time: "newest",
    sort: "asc"
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [visibleItems, setVisibleItems] = useState(12);

  // Modals
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Upload form
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    type: "image",
    title: "",
    category: "topic",
    tags: [],
    file: undefined,
    youtubeId: ""
  });
  const [uploading, setUploading] = useState(false);

  // Local data state
  const [localImages, setLocalImages] = useState<ImageItem[]>(IMAGES);
  const [localVideos, setLocalVideos] = useState<VideoItem[]>(VIDEOS);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtering pipeline (single source of truth)
  const applyFilters = useCallback((items: MediaItem[]) => {
    return items
      .filter(item => !filters.category || item.category === filters.category)
      .filter(item => filters.tags.length === 0 || filters.tags.every(tag => item.tags.includes(tag)))
      .filter(item => 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      )
      .sort((a, b) => {
        if (filters.time === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      })
      .sort((a, b) => {
        if (filters.sort === "asc") {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
  }, [filters]);

  const filteredImages = useMemo(() => applyFilters(localImages), [localImages, applyFilters]);
  const filteredVideos = useMemo(() => applyFilters(localVideos), [localVideos, applyFilters]);

  // Pagination calculations
  const totalItems = filteredImages.length + filteredVideos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const allItems = [...filteredImages, ...filteredVideos];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allItems.slice(0, useInfiniteScroll ? visibleItems : startIndex + itemsPerPage);
  }, [filteredImages, filteredVideos, currentPage, itemsPerPage, useInfiniteScroll, visibleItems]);

  // Infinite scroll handler
  useEffect(() => {
    if (!useInfiniteScroll) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100 && visibleItems < totalItems) {
        setVisibleItems(prev => Math.min(prev + 12, totalItems));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [useInfiniteScroll, visibleItems, totalItems]);

  // Tag handlers
  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
    setCurrentPage(1);
  };

  // Upload handler
  const handleUpload = async () => {
    if (!uploadForm.title.trim()) return;

    setUploading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItem = {
      id: Date.now(),
      title: uploadForm.title,
      category: uploadForm.category,
      tags: uploadForm.tags,
      createdAt: new Date().toISOString()
    };

    if (uploadForm.type === "image") {
      const imageItem: ImageItem = {
        ...newItem,
        img: uploadForm.file 
          ? URL.createObjectURL(uploadForm.file)
          : `https://picsum.photos/seed/${Date.now()}/600/600`
      };
      setLocalImages(prev => [imageItem, ...prev]);
    } else {
      const videoItem: VideoItem = {
        ...newItem,
        youtubeId: uploadForm.youtubeId || "dQw4w9WgXcQ"
      };
      setLocalVideos(prev => [videoItem, ...prev]);
    }

    // Reset form
    setUploadForm({
      type: "image",
      title: "",
      category: "topic",
      tags: [],
      file: undefined,
      youtubeId: ""
    });
    setShowUploadModal(false);
    setUploading(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
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
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
              🌌 Anime Faith Gallery
            </h1>
            <p className="text-gray-400 mt-2">Explore inspiring anime and believer-themed media</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Upload size={20} />
              Upload Media
            </button>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or tags..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: null }));
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg transition-all ${!filters.category 
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500' 
                : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: prev.category === cat ? null : cat }));
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-all ${filters.category === cat 
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={20} className="text-cyan-400" />
              <h3 className="font-semibold">Filter by Tags:</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filters.tags.includes(tag)
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={filters.time}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, time: e.target.value as 'newest' | 'oldest' }));
                  setCurrentPage(1);
                }}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <select
                value={filters.sort}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, sort: e.target.value as 'asc' | 'desc' }));
                  setCurrentPage(1);
                }}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setUseInfiniteScroll(!useInfiniteScroll)}
                className={`px-4 py-2 rounded-lg transition-all ${useInfiniteScroll
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                  : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {useInfiniteScroll ? 'Infinite Scroll' : 'Pagination'}
              </button>
              
              {!useInfiniteScroll && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Showing <span className="text-cyan-400 font-semibold">{paginatedItems.length}</span> of{" "}
            <span className="text-purple-400 font-semibold">{totalItems}</span> items
          </p>
          {filters.tags.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, tags: [] }))}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
            >
              <X size={16} />
              Clear tags
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedItems.map((item) => (
            <motion.div
              key={`${'img' in item ? 'image' : 'video'}-${item.id}`}
              variants={itemVariants}
              className="group relative"
            >
              {'img' in item ? (
                // Image Card
                <div
                  onClick={() => setSelectedImage(item)}
                  className="cursor-pointer bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-700/50 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Video Card
                <div
                  onClick={() => setSelectedVideo(item)}
                  className="cursor-pointer bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play size={32} className="ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-700/50 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pagination */}
      {!useInfiniteScroll && totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg transition-all ${currentPage === pageNum
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="mx-2">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 rounded-lg transition-all ${currentPage === totalPages
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Infinite Scroll Loading */}
      {useInfiniteScroll && visibleItems < totalItems && (
        <div className="max-w-7xl mx-auto mt-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-gray-400 mt-2">Loading more items...</p>
        </div>
      )}

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-4xl max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors"
              >
                <X size={32} />
              </button>
              
              <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                <Image
                  src={selectedImage.img}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="mt-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-purple-500/30 text-purple-300 rounded-lg">
                    {selectedImage.category}
                  </span>
                  <div className="text-gray-400">
                    {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedImage.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => {
                  setSelectedVideo(null);
                  setIsPlaying(false);
                }}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-10"
              >
                <X size={32} />
              </button>
              
              {/* Custom Video Player */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?controls=0&modestbranding=1&rel=0&autoplay=${isPlaying ? 1 : 0}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                />
                
                {/* Custom Controls Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    >
                      <Play size={48} className="ml-2" />
                    </button>
                  </div>
                )}
                
                {/* Bottom Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-cyan-400 transition-colors"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button className="text-white hover:text-cyan-400 transition-colors">
                        <Volume2 size={24} />
                      </button>
                    </div>
                    <button className="text-white hover:text-cyan-400 transition-colors">
                      <Maximize2 size={24} />
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-1/3" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="mt-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-cyan-500/30 text-cyan-300 rounded-lg">
                    {selectedVideo.category}
                  </span>
                  <div className="text-gray-400">
                    {new Date(selectedVideo.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedVideo.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-md w-full bg-gray-900 rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Upload Media
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Media Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Media Type
                  </label>
                  <div className="flex gap-2">
                    {(['image', 'video'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setUploadForm(prev => ({ ...prev, type }))}
                        className={`flex-1 py-2 rounded-lg transition-all ${uploadForm.type === type
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                          : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter media title"
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
                        key={cat}
                        onClick={() => setUploadForm(prev => ({ ...prev, category: cat }))}
                        className={`flex-1 py-2 rounded-lg transition-all ${uploadForm.category === cat
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                          : 'bg-gray-800 hover:bg-gray-700'
                        }`}
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
                        key={tag}
                        onClick={() => {
                          setUploadForm(prev => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter(t => t !== tag)
                              : [...prev.tags, tag]
                          }));
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${uploadForm.tags.includes(tag)
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-400'
                          : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* File Upload / YouTube ID */}
                {uploadForm.type === 'image' ? (
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
                          if (file) setUploadForm(prev => ({ ...prev, file }));
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          {uploadForm.file ? uploadForm.file.name : 'Click to upload image'}
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
                      value={uploadForm.youtubeId}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, youtubeId: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter YouTube video ID"
                    />
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  onClick={handleUpload}
                  disabled={uploading || !uploadForm.title.trim()}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Upload Media'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              x: [
                Math.random() * 100 + 'vw',
                Math.random() * 100 + 'vw',
                Math.random() * 100 + 'vw'
              ],
              y: [
                Math.random() * 100 + 'vh',
                Math.random() * 100 + 'vh',
                Math.random() * 100 + 'vh'
              ]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
}