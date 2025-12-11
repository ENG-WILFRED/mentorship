// src/components/MediaGallery.tsx
'use client'; // Required for hover effects and interactivity

import { useState, useRef } from 'react';
import Image from 'next/image';

// Types
interface MediaItem {
  id: string;
  type: 'image' | 'youtube';
  title: string;
  thumbnail: string;
  youtubeId?: string; // For YouTube videos
  imageUrl?: string;  // For gallery images
  date?: string;
}

// Dummy data - replace with your API data
const DUMMY_MEDIA: MediaItem[] = [
  // YouTube Videos
  {
    id: '1',
    type: 'youtube',
    title: 'Sunday Sermon: Finding Peace',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    youtubeId: 'dQw4w9WgXcQ',
    date: '2024-01-15'
  },
  {
    id: '2',
    type: 'youtube',
    title: 'Bible Study: John Chapter 3',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
    youtubeId: '9bZkp7q19f0',
    date: '2024-01-14'
  },
  // Gallery Images
  {
    id: '3',
    type: 'image',
    title: 'Sunday Service Crowd',
    thumbnail: '/pray1.jpg', // Using your existing images
    imageUrl: '/pray1.jpg',
    date: '2024-01-14'
  },
  {
    id: '4',
    type: 'image',
    title: 'Prayer Gathering',
    thumbnail: '/pray2.jpg',
    imageUrl: '/pray2.jpg',
    date: '2024-01-13'
  },
  // Add more items...
];

export default function MediaGallery() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  // Handle click - opens YouTube or image modal
  const handleMediaClick = (item: MediaItem) => {
    if (item.type === 'youtube' && item.youtubeId) {
      // Open YouTube video in modal or new tab
      window.open(`https://www.youtube.com/watch?v=${item.youtubeId}`, '_blank');
    } else if (item.type === 'image' && item.imageUrl) {
      // Open image in modal or lightbox
      console.log('Open image:', item.imageUrl);
      // You can implement a modal here
    }
  };

  // Scroll manually
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="media-gallery-container">
      {/* Controls */}
      <div className="controls">
        <h2 className="section-title">Media Gallery</h2>
        <div className="buttons">
          <button onClick={() => scroll('left')}>←</button>
          <button 
            onClick={toggleAutoScroll}
            className={`auto-scroll-btn ${autoScroll ? 'active' : ''}`}
          >
            {autoScroll ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button onClick={() => scroll('right')}>→</button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div 
        ref={scrollRef}
        className="media-grid"
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {DUMMY_MEDIA.map((item) => (
          <div
            key={item.id}
            className={`media-card ${item.type} ${hoveredId === item.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleMediaClick(item)}
          >
            {/* Thumbnail */}
            <div className="thumbnail">
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={320}
                height={180}
                className="thumbnail-image"
              />
              
              {/* Overlay on hover */}
              <div className="overlay">
                {item.type === 'youtube' ? (
                  <div className="play-button">▶</div>
                ) : (
                  <div className="zoom-icon">🔍</div>
                )}
              </div>
              
              {/* Media type badge */}
              <span className="type-badge">
                {item.type === 'youtube' ? '🎬 Video' : '🖼️ Photo'}
              </span>
            </div>

            {/* Info */}
            <div className="media-info">
              <h3 className="title">{item.title}</h3>
              {item.date && (
                <span className="date">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Auto-scroll indicator */}
      <div className="auto-scroll-indicator">
        <div className={`indicator-dot ${autoScroll ? 'active' : ''}`}></div>
        <span>Auto-scroll: {autoScroll ? 'ON' : 'PAUSED'}</span>
      </div>
    </div>
  );
}