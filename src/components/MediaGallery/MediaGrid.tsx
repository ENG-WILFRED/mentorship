// components/MediaGallery/MediaGrid.tsx
'use client'

import type { MediaItem } from './types'
import { Grid, Video, Image as ImageIcon, FileText, Heart, Eye } from 'lucide-react'

interface MediaGridProps {
  media: MediaItem[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  onPageChange?: (page: number) => void
}

export function MediaGrid({ media, pagination, onPageChange }: MediaGridProps) {
  // Add at the beginning of MediaGrid component
console.log('MediaGrid received:', {
  mediaCount: media.length,
  firstItem: media[0],
  firstItemThumbnail: media[0]?.thumbnail,
  firstItemUrl: media[0]?.url
})
  const getMediaIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'IMAGE': return <ImageIcon className="w-4 h-4" />
      case 'VIDEO': return <Video className="w-4 h-4" />
      case 'DOCUMENT': return <FileText className="w-4 h-4" />
      default: return <ImageIcon className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No media found</h3>
        <p className="text-gray-500">Try changing your filters or upload some media</p>
      </div>
    )
  }

  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => {
              // Prefer explicit videoUrl when available (YouTube), else fallback to url
              if (item.youtubeId) {
                const link = item.videoUrl || `https://www.youtube.com/watch?v=${item.youtubeId}`
                window.open(link, '_blank')
              } else {
                window.open(item.url, '_blank')
              }
            }}
          >
            {/* Media Type Badge */}
            <div className="absolute top-3 left-3 z-10 bg-black/70 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
              {getMediaIcon(item.type)}
              {item.type.toLowerCase()}
            </div>

            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              {item.type === 'VIDEO' ? (
                // Use YouTube thumbnail if we have a youtubeId, otherwise fall back to thumbnail
                (item.youtubeId || item.thumbnail) ? (
                  <img
                    src={item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : item.thumbnail || item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image'
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-12 h-12 text-purple-600" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )
              ) : (
                <img
                  src={ item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image'
                  }}
                />
              )}
            </div>

{/* Content */}
<div className="p-4">
              <h3 className="font-semibold text-gray-800 line-clamp-1 mb-1">
                {item.caption}
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  {formatDate(item.date)}
                </span>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {item.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views}
                  </span>
                </div>
              </div>

              {/* Uploader */}
              <p className="text-xs text-gray-600 mb-2">
                By {item.uploader.firstName} {item.uploader.lastName}
              </p>

              {/* Tags */}
                      {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag: { id: number; name: string }) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
              >
                {tag.name}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span 
                key="more-tags"
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                +{item.tags.length - 3}
              </span>
            )}
          </div>
          )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}