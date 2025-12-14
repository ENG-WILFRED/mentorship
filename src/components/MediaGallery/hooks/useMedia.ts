// components/MediaGallery/hooks/useMedia.ts
 'use client'

import { useState, useCallback, useEffect } from 'react'
import { MediaItem, MediaFilters, MediaResponse } from '../types'
import { getAccessToken } from '@/lib/auth'

// Helper function for safe data formatting
function formatMediaResponse(data: any): MediaResponse {
  return {
    data: Array.isArray(data.data) 
      ? data.data.map((item: any) => ({
          id: item.id || 0,
          url: item.url || '',
          thumbnail: item.thumbnail || null,
          caption: item.caption || '',
          type: item.type || 'IMAGE',
          category: item.category || 'MISSION',
          date: item.date || new Date().toISOString().split('T')[0],
          location: item.location || null,
          cloudinaryPublicId: item.cloudinaryPublicId || null,
          youtubeId: item.youtubeId || null,
          videoUrl: item.videoUrl || null,
          uploaderId: item.uploaderId || 0,
          uploader: item.uploader || {
            id: 0,
            firstName: 'Unknown',
            lastName: 'User',
            email: ''
          },
          likes: item.likes || 0,
          views: item.views || 0,
          description: item.description || null,
          tags: Array.isArray(item.tags) 
            ? item.tags.map((tag: any) => ({
                id: tag.id || 0,
                name: tag.name || ''
              }))
            : [],
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        }))
      : [],
    pagination: data.pagination || {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0
    }
  }
}
console.log(formatMediaResponse)
export function useMedia(filters: MediaFilters = {}) {
  const [data, setData] = useState<MediaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams()
      
      // Only add non-default filters
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category)
      }
      
      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type)
      }
      
      if (filters.search) {
        params.append('search', filters.search)
      }
      
      // Always include pagination
      params.append('page', String(filters.page || 1))
      params.append('limit', String(filters.limit || 12))
      
      console.log('📡 Fetching from real API...')
      
      // Try to fetch from real API
      const response = await fetch(`/api/media?${params}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        // If API returns error, show message but continue
        console.warn(`API returned ${response.status}`)
        
        // Return empty data instead of throwing
        setData({
          data: [],
          pagination: {
            page: filters.page || 1,
            limit: filters.limit || 12,
            total: 0,
            pages: 0
          }
        })
        
        if (response.status === 404) {
          setError('API endpoint not found. Make sure /api/media/route.ts exists.')
        } else {
          setError(`Server returned ${response.status}. Check your API.`)
        }
        
        return
      }
      
      const result = await response.json()
      const formattedData = formatMediaResponse(result)
      
      setData(formattedData)
      
      console.log(`✅ Loaded ${formattedData.data.length} items from database`)
      
    } catch (err: any) {
      console.error('Error fetching media:', err)
      
      // Set fallback empty data
      setData({
        data: [],
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 12,
          total: 0,
          pages: 0
        }
      })
      
      setError('Failed to connect to server. Make sure your API is running.')
    } finally {
      setLoading(false)
    }
  }, [filters.category, filters.type, filters.search, filters.page, filters.limit])

  // Fetch initial data on mount and whenever filters change
  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const createMedia = useCallback(async (mediaData: Partial<MediaItem>) => {
    try {
      const token = getAccessToken()
      
      if (!token) {
        throw new Error('You need to be logged in to upload media.')
      }
      
      // Prepare the payload
      const payload = {
        url: mediaData.url || '',
        thumbnail: mediaData.thumbnail || undefined,
        caption: mediaData.caption || '',
        type: mediaData.type || 'IMAGE',
        category: mediaData.category || 'MISSION',
        date: mediaData.date || new Date().toISOString().split('T')[0],
        location: mediaData.location || undefined,
        description: mediaData.description || undefined,
        tags: mediaData.tags?.map(t => typeof t === 'string' ? t : t.name) || [],
            uploaderId: mediaData.uploaderId,
            // Optional cloud storage and youtube fields forwarded from upload process
            cloudinaryPublicId: mediaData.cloudinaryPublicId || undefined,
            youtubeId: mediaData.youtubeId || undefined,
            videoUrl: mediaData.videoUrl || undefined
      }
      
      console.log('📤 Uploading to real API...', payload)
      
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Upload failed: ${response.status}`)
      }
      
      const result = await response.json()
      
      // Refresh the media list
      await fetchMedia()
      
      console.log('✅ Upload successful!', result)
      return result
      
    } catch (err: any) {
      console.error('Upload error:', err)
      throw new Error(err.message || 'Failed to upload media. Please try again.')
    }
  }, [fetchMedia])

  return {
    data,
    loading,
    error,
    refetch: fetchMedia,
    createMedia
  }
}