// components/MediaGallery/MediaModal.tsx
'use client'

import { X, Play, Download, ExternalLink, Heart, Eye } from 'lucide-react'
import type { MediaItem } from './types'

interface MediaModalProps {
  item: MediaItem
  onClose: () => void
}

export function MediaModal({ item, onClose }: MediaModalProps) {
  // Close modal when clicking backdrop or Escape key
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = item.url
    link.download = item.caption || `download-${item.id}`
    link.click()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal container */}
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">{item.caption}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open(item.url, '_blank')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Media Content */}
        <div className="p-6 max-h-[70vh] overflow-auto">
          {item.type === 'VIDEO' ? (
            item.youtubeId ? (
              // YouTube video embed
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              // Regular video
              <div className="aspect-video">
                <video
                  src={item.url}
                  controls
                  autoPlay
                  className="w-full h-full rounded-lg"
                />
              </div>
            )
          ) : (
            // Image
            <div className="flex justify-center">
              <img
                src={item.url}
                alt={item.caption}
                className="max-w-full max-h-[60vh] rounded-lg"
              />
            </div>
          )}
          
          {/* Details */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>By {item.uploader.firstName} {item.uploader.lastName}</span>
              <span>•</span>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{item.likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{item.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}