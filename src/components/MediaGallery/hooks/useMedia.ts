// components/MediaGallery/hooks/useMedia.ts
'use client'

import { useState, useEffect } from 'react'
import { MediaItem, MediaFilters, MediaResponse } from '@/lib/types/media'
import { getAccessToken } from '@/lib/auth'

export function useMedia(filters: MediaFilters = {}) {
  const [data, setData] = useState<MediaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedia = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, String(value))
        }
      })
      
      const response = await fetch(`/api/media?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      const result = await response.json()
      setData(result)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [filters.category, filters.type, filters.search, filters.page])

  const createMedia = async (mediaData: Partial<MediaItem>) => {
    try {
      const token = getAccessToken()
      
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(mediaData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create: ${response.statusText}`)
      }
      
      // Refresh media list
      await fetchMedia()
      return await response.json()
      
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchMedia,
    createMedia
  }
}