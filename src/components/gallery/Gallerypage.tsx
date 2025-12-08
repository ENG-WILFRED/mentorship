// components/gallery/GalleryPage.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { FilterState, ImageItem, VideoItem, IMAGES, VIDEOS } from './data';
import GalleryFilters from './GalleryFilters';
import TagFilters from './TagFilters';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import VideoGrid from './VideoGrid';
import PaginationControls from './PaginationControls';
import UploadMediaModal from './UploadMediaModal';
import LightboxModal from './LightboxModal';
import VideoModal from './VideoModal';

interface GalleryPageProps {
  initialImages?: ImageItem[];
  initialVideos?: VideoItem[];
}

export default function GalleryPage({ 
  initialImages = IMAGES, 
  initialVideos = VIDEOS 
}: GalleryPageProps) {
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

  // Local data state
  const [localImages, setLocalImages] = useState<ImageItem[]>(initialImages);
  const [localVideos, setLocalVideos] = useState<VideoItem[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtering pipeline (single source of truth)
  const applyFilters = useCallback((items: Array<ImageItem | VideoItem>) => {
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
  const paginatedImages = useMemo(() => {
    const allItems = [...filteredImages];
    if (useInfiniteScroll) {
      return allItems.slice(0, visibleItems);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allItems.length);
    return allItems.slice(startIndex, endIndex);
  }, [filteredImages, currentPage, itemsPerPage, useInfiniteScroll, visibleItems]);

  const paginatedVideos = useMemo(() => {
    const allItems = [...filteredVideos];
    if (useInfiniteScroll) {
      return allItems.slice(0, visibleItems);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allItems.length);
    return allItems.slice(startIndex, endIndex);
  }, [filteredVideos, currentPage, itemsPerPage, useInfiniteScroll, visibleItems]);

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

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
    setCurrentPage(1);
  };

  // Handle upload
  const handleUpload = async (formData: {
    type: 'image' | 'video';
    title: string;
    category: 'school' | 'mentor' | 'topic';
    tags: string[];
    file?: File;
    youtubeId?: string;
  }) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newItem = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      tags: formData.tags,
      createdAt: new Date().toISOString()
    };

    if (formData.type === "image") {
      const imageItem: ImageItem = {
        ...newItem,
        img: formData.file 
          ? URL.createObjectURL(formData.file)
          : `https://picsum.photos/seed/${Date.now()}/600/600`
      };
      setLocalImages(prev => [imageItem, ...prev]);
    } else {
      const videoItem: VideoItem = {
        ...newItem,
        youtubeId: formData.youtubeId || "dQw4w9WgXcQ"
      };
      setLocalVideos(prev => [videoItem, ...prev]);
    }

    setIsLoading(false);
    setShowUploadModal(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: null,
      tags: [],
      search: "",
      time: "newest",
      sort: "asc"
    });
    setCurrentPage(1);
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
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setShowUploadModal(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              Upload Media
            </button>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <SearchBar
            value={filters.search}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, search: value }));
              setCurrentPage(1);
            }}
          />
          
          <div className="mt-6">
            <GalleryFilters
              filters={filters}
              onFilterChange={(key, value) => {
                setFilters(prev => ({ ...prev, [key]: value }));
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="mt-6">
            <TagFilters
              selectedTags={filters.tags}
              onTagToggle={handleTagToggle}
              onClearTags={() => {
                setFilters(prev => ({ ...prev, tags: [] }));
                setCurrentPage(1);
              }}
            />
          </div>
          
          {(filters.category || filters.tags.length > 0 || filters.search) && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Showing{' '}
            <span className="text-cyan-400 font-semibold">
              {filteredImages.length + filteredVideos.length}
            </span>{' '}
            items ({filteredImages.length} images, {filteredVideos.length} videos)
          </p>
          
          <PaginationControls
            mode={useInfiniteScroll ? 'infinite' : 'pagination'}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onModeChange={setUseInfiniteScroll}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* Images Section */}
      {filteredImages.length > 0 && (
        <section className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 w-3 h-3 rounded-full" />
            Images
            <span className="text-sm text-gray-400 font-normal">
              ({paginatedImages.length} shown)
            </span>
          </h2>
          <ImageGrid
            images={paginatedImages}
            onImageClick={setSelectedImage}
          />
        </section>
      )}

      {/* Videos Section */}
      {filteredVideos.length > 0 && (
        <section className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-500 w-3 h-3 rounded-full" />
            Videos
            <span className="text-sm text-gray-400 font-normal">
              ({paginatedVideos.length} shown)
            </span>
          </h2>
          <VideoGrid
            videos={paginatedVideos}
            onVideoClick={setSelectedVideo}
          />
        </section>
      )}

      {/* Empty State */}
      {filteredImages.length === 0 && filteredVideos.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="text-gray-400 text-6xl mb-4">📷</div>
          <h3 className="text-2xl font-bold mb-2">No media found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or upload new content
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Modals */}
      <LightboxModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <UploadMediaModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUpload}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 15 }).map((_, i) => (
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