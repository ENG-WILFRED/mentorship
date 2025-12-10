"use client";

import React, { useState } from "react";
import { 
  Grid, 
  Film, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Search, 
  Filter,
  Download,
  Share2,
  Heart,
  Eye,
  Calendar,
  MapPin,
  X
} from "lucide-react";

// Types
export type MediaType = 'image' | 'video' | 'document';
export type MediaCategory = 'all' | 'missions' | 'sermons' | 'events' | 'students';

export interface MediaItem {
  id: string;
  url: string;
  thumbnail?: string;
  caption: string;
  type: MediaType;
  category: MediaCategory;
  date: string;
  location?: string;
  uploader: string;
  likes: number;
  views: number;
  tags: string[];
  description?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
  title?: string;
  showFilters?: boolean;
  showStats?: boolean;
}

export default function MediaGallery({ 
  media, 
  title = "Mission Gallery", 
  showFilters = true,
  showStats = true 
}: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Filter media based on category and search
  const filteredMedia = media.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Stats
  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length,
    documents: media.filter(m => m.type === 'document').length,
  };

  // Categories for filtering
  const categories: { id: MediaCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Media', icon: <Grid className="w-4 h-4" /> },
    { id: 'missions', label: 'Missions', icon: <MapPin className="w-4 h-4" /> },
    { id: 'sermons', label: 'Sermons', icon: <Film className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Eye className="w-4 h-4" /> },
  ];

  // Media type icons
  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
    }
  };

  // Handle like
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedItems);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedItems(newLiked);
  };

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">{title}</h2>
          {showStats && (
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Grid className="w-4 h-4" /> {stats.total} items
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> {stats.images} images
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Video className="w-4 h-4" /> {stats.videos} videos
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex border border-purple-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-600'}`}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Media Grid/List */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'flex flex-col'
        } 
        gap-4
      `}>
        {filteredMedia.map((item) => (
          viewMode === 'grid' ? (
            <GridMediaItem 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedMedia(item)}
              isLiked={likedItems.has(item.id)}
              onLike={(e) => handleLike(item.id, e)}
              getMediaIcon={getMediaIcon}
            />
          ) : (
            <ListMediaItem 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedMedia(item)}
              isLiked={likedItems.has(item.id)}
              onLike={(e) => handleLike(item.id, e)}
              getMediaIcon={getMediaIcon}
            />
          )
        ))}
      </div>

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No media found</h3>
          <p className="text-gray-500">Try changing your filters or search query</p>
        </div>
      )}

      {/* Modal Viewer */}
      {selectedMedia && (
        <MediaModal 
          media={selectedMedia} 
          onClose={() => setSelectedMedia(null)}
          isLiked={likedItems.has(selectedMedia.id)}
          onLike={() => handleLike(selectedMedia.id, { stopPropagation: () => {} } as React.MouseEvent)}
        />
      )}
    </section>
  );
}

// Grid View Item Component
function GridMediaItem({ 
  item, 
  onClick, 
  isLiked, 
  onLike,
  getMediaIcon 
}: { 
  item: MediaItem;
  onClick: () => void;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  getMediaIcon: (type: MediaType) => React.ReactNode;
}) {
  return (
    <div 
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Media Type Badge */}
      <div className="absolute top-3 left-3 z-10 bg-black/70 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
        {getMediaIcon(item.type)}
        {item.type.toUpperCase()}
      </div>

      {/* Media Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        {item.type === 'video' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-12 h-12 text-purple-600" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ) : (
          <img 
            src={item.thumbnail || item.url} 
            alt={item.caption}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </div>

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="text-white">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={onLike}
              className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.caption}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-3 h-3" />
            {item.date}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {item.likes + (isLiked ? 1 : 0)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.views}
            </span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {item.tags.slice(0, 2).map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{item.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// List View Item Component
function ListMediaItem({ 
  item, 
  onClick, 
  isLiked, 
  onLike,
  getMediaIcon 
}: { 
  item: MediaItem;
  onClick: () => void;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  getMediaIcon: (type: MediaType) => React.ReactNode;
}) {
  return (
    <div 
      className="flex items-center bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        {item.type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-8 h-8 text-purple-600" />
          </div>
        ) : (
          <img 
            src={item.thumbnail || item.url} 
            alt={item.caption}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{item.caption}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                {getMediaIcon(item.type)}
                {item.type}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.date}
              </span>
              {item.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onLike}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {item.likes + (isLiked ? 1 : 0)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal Component
function MediaModal({ 
  media, 
  onClose, 
  isLiked, 
  onLike 
}: { 
  media: MediaItem;
  onClose: () => void;
  isLiked: boolean;
  onLike: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{media.caption}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>By {media.uploader}</span>
              <span>•</span>
              <span>{media.date}</span>
              {media.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {media.location}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Content */}
        <div className="flex-1 overflow-auto p-6">
          {media.type === 'video' ? (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <Video className="w-20 h-20 text-white" />
              <p className="text-white ml-4">Video Player Would Appear Here</p>
            </div>
          ) : (
            <img 
              src={media.url} 
              alt={media.caption}
              className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
            />
          )}

          {/* Description */}
          {media.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{media.description}</p>
            </div>
          )}

          {/* Tags */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {media.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
              {isLiked ? 'Liked' : 'Like'} ({media.likes + (isLiked ? 1 : 0)})
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
