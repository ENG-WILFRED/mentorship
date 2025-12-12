// components/MediaGallery/index.tsx
 'use client'

import { useState, useEffect } from 'react'
import { useMedia } from './hooks/useMedia'
import type { MediaItem, MediaFilters } from './types'
import { MediaGrid } from './MediaGrid'
import { MediaFiltersComponent as MediaFilters } from './MediaFilters'
import { MediaUpload } from './MediaUpload'
import { useAuthContext } from '@/context/AuthContext'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface MediaGalleryProps {
  // Accept any media array (the app has a local `media` data shape separate from the DB type)
  media?: any[]
  title?: string
  showFilters?: boolean
  showStats?: boolean
}

export default function MediaGallery({ media: mediaProp, title = 'Mission Gallery', showFilters = true, showStats = true }: MediaGalleryProps) {
  const { role, user } = useAuthContext()
  const [filters, setFilters] = useState<MediaFilters>({
    category: 'all',
    type: 'all',
    search: '',
    page: 1,
    limit: 12
  })
  
  const { data, loading, error, refetch, createMedia } = useMedia(filters)
  
  const canUpload = ['ADMIN', 'MENTOR' , 'GUEST'].includes(role || '')
  
  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30000) // 60 seconds
    
    return () => clearInterval(interval)
  }, [refetch])

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, page: 1 }) // Reset to page 1 on filter change
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  // Handle upload
  const handleUpload = async (mediaData: any) => {
    try {
      await createMedia(mediaData)
      // Success - media list will auto-refresh via the hook
    } catch (err) {
      console.error('Upload failed:', err)
      // Error is already handled in the hook
    }
  }

  // Choose which media to render: prop override or fetched data
  const mediaToRender = mediaProp ?? data?.data ?? []

  // Loading state
  if (loading && !data && !mediaProp) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">Mission Gallery</h2>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Error state
  if (error && !data && !mediaProp) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">Mission Gallery</h2>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load Media</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            Check your database connection and ensure the API endpoint is working.
          </p>
        </div>
      </section>
    )
  }

  // Empty state (no data from database)
  if (!loading && (mediaToRender.length === 0)) {
    return (
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-800">{title}</h2>
            <p className="text-gray-600 mt-1">
              No media items found in database
            </p>
          </div>
          
          {canUpload && user && (
            <MediaUpload 
              userId={user.id}
              onUpload={handleUpload}
            />
          )}
        </div>
        
        <MediaFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📷</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No Media Yet</h3>
            <p className="text-gray-600 mb-6">
              Your media gallery is empty. Start by uploading your first mission photos, videos, or documents.
            </p>
            {canUpload && user && (
              <MediaUpload 
                userId={user.id}
                onUpload={handleUpload}
              />
            )}
            <p className="text-sm text-gray-500 mt-6">
              Need help? Check that your database is connected and has media data.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Success state (has data)
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Mission Gallery</h2>
          {data && (
            <div className="flex items-center gap-4 mt-1">
              <p className="text-gray-600">
                {data.pagination.total} {data.pagination.total === 1 ? 'item' : 'items'}
                {data.pagination.pages > 1 && ` • Page ${data.pagination.page} of ${data.pagination.pages}`}
              </p>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Updating...
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          { user && (
            <MediaUpload 
              userId={user.id}
              onUpload={handleUpload}
            />
          )}
        </div>
      </div>
      
      <MediaFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {data && (
        <>
            <MediaGrid 
            media={mediaToRender}
            pagination={data.pagination}
            onPageChange={handlePageChange}
          />
          
          {/* Database connection info (for debugging) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    📊 Real Database Data
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Connected to PostgreSQL • {data.data.length} items loaded
                  </p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}