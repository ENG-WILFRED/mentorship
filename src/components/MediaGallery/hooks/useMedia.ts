// // components/MediaGallery/hooks/useMedia.ts
// 'use client'

// import { useState, useCallback } from 'react'
// import { MediaItem, MediaFilters, MediaResponse } from '../types'

// // Dummy data generator
// function generateDummyData(filters: MediaFilters): MediaResponse {
//   const totalItems = 24
//   const page = filters.page || 1
//   const limit = filters.limit || 12
//   const startIndex = (page - 1) * limit
//   const endIndex = Math.min(startIndex + limit, totalItems)
  
//   const dummyMedia: MediaItem[] = Array.from({ length: totalItems }, (_, i) => ({
//     id: i + 1,
//     url: `https://picsum.photos/seed/media${i + 1}/300/200`,
//     thumbnail: `https://picsum.photos/seed/thumb${i + 1}/150/100`,
//     caption: `Mission Activity ${i + 1}`,
//     type: (['IMAGE', 'VIDEO', 'DOCUMENT'][i % 3] as 'IMAGE' | 'VIDEO' | 'DOCUMENT'),
//     category: (['MISSION', 'SERMON', 'EVENT', 'STUDENT'][i % 4] as any),
//     date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
//     location: ['Nairobi', 'Kisumu', 'Mombasa', 'Nakuru'][i % 4],
//     uploaderId: 1,
//     uploader: {
//       id: 1,
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john@example.com'
//     },
//     likes: Math.floor(Math.random() * 100),
//     views: Math.floor(Math.random() * 500),
//     description: `This is a description for mission activity ${i + 1}. It was a great success with many participants.`,
//     tags: [
//       { id: 1, name: 'mission' },
//       { id: 2, name: 'outreach' },
//       { id: 3, name: 'youth' }
//     ].slice(0, (i % 3) + 1),
//     createdAt: new Date(Date.now() - i * 86400000).toISOString(),
//     updatedAt: new Date(Date.now() - i * 43200000).toISOString()
//   }))

//   // Apply filters
//   let filtered = dummyMedia
  
//   if (filters.category && filters.category !== 'all') {
//     filtered = filtered.filter(item => item.category === filters.category)
//   }
  
//   if (filters.type && filters.type !== 'all') {
//     filtered = filtered.filter(item => item.type === filters.type)
//   }
  
//   if (filters.search) {
//     const searchLower = filters.search.toLowerCase()
//     filtered = filtered.filter(item => 
//       item.caption.toLowerCase().includes(searchLower) ||
//       item.description?.toLowerCase().includes(searchLower) ||
//       item.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
//     )
//   }

//   const total = filtered.length
//   const paginatedData = filtered.slice(startIndex, endIndex)

//   return {
//     data: paginatedData,
//     pagination: {
//       page,
//       limit,
//       total,
//       pages: Math.ceil(total / limit)
//     }
//   }
// }

// export function useMedia(filters: MediaFilters = {}) {
//   const [data, setData] = useState<MediaResponse | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchMedia = useCallback(async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 300))
      
//       // Use dummy data
//       const result = generateDummyData(filters)
//       setData(result)
      
//     } catch (err: any) {
//       setError(err.message || 'An error occurred')
//       console.error('Error fetching media:', err)
//     } finally {
//       setLoading(false)
//     }
//   }, [filters.category, filters.type, filters.search, filters.page, filters.limit])

//   const createMedia = useCallback(async (mediaData: Partial<MediaItem>) => {
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 500))
      
//       // Create dummy response
//       const newMedia: MediaItem = {
//         id: Math.floor(Math.random() * 1000) + 1000,
//         url: mediaData.url || 'https://picsum.photos/300/200',
//         thumbnail: mediaData.thumbnail,
//         caption: mediaData.caption || 'New Media',
//         type: mediaData.type || 'IMAGE',
//         category: mediaData.category || 'MISSION',
//         date: mediaData.date || new Date().toISOString().split('T')[0],
//         location: mediaData.location,
//         uploaderId: mediaData.uploaderId || 1,
//         uploader: {
//           id: 1,
//           firstName: 'Current',
//           lastName: 'User',
//           email: 'user@example.com'
//         },
//         likes: 0,
//         views: 0,
//         description: mediaData.description,
//         tags: (mediaData.tags || []).map((tag, idx) => ({ 
//           id: idx + 100, 
//           name: typeof tag === 'string' ? tag : tag.name 
//         })),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }
      
//       console.log('Media created:', newMedia)
//       alert('Media uploaded successfully! (Dummy data for now)')
      
//       return newMedia
      
//     } catch (err: any) {
//       console.error('Error creating media:', err)
//       throw err
//     }
//   }, [])

//   return {
//     data,
//     loading,
//     error,
//     refetch: fetchMedia,
//     createMedia
//   }
// }

// components/MediaGallery/hooks/useMedia.ts
'use client'

import { useState, useCallback } from 'react'
import type { MediaItem, MediaFilters, MediaResponse } from '../types'
import { getAccessToken } from '@/lib/auth'

export function useMedia(filters: MediaFilters = {}) {
  const [data, setData] = useState<MediaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      
      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'all') {
          params.append(key, String(value))
        }
      })
      
      // Always add page and limit
      if (!params.has('page')) params.append('page', String(filters.page || 1))
      if (!params.has('limit')) params.append('limit', String(filters.limit || 12))
      
      const response = await fetch(`/api/media?${params}`)
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Failed to fetch media: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw  Error(errorMessage)
      }
      
      const result = await response.json()
      
      // Ensure data is always an array
      result.data = Array.isArray(result.data) ? result.data : []
      
      // Ensure pagination exists
      result.pagination = result.pagination || {
        page: filters.page || 1,
        limit: filters.limit || 12,
        total: result.data.length,
        pages: 1
      }
      
      setData(result)
      
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
      
      setError(err.message || 'Failed to load media. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters.category, filters.type, filters.search, filters.page, filters.limit])

  const createMedia = useCallback(async (mediaData: Partial<MediaItem>) => {
    try {
      const token = getAccessToken()
      
      if (!token) {
        throw new Error('Authentication required. Please log in.')
      }
      
      // Prepare data with null safety
      const payload = {
        url: mediaData.url || '',
        thumbnail: mediaData.thumbnail || undefined,
        caption: mediaData.caption || '',
        type: mediaData.type || 'IMAGE',
        category: mediaData.category || 'MISSION',
        date: mediaData.date || new Date().toISOString().split('T')[0],
        location: mediaData.location || undefined,
        description: mediaData.description || undefined,
        // tags may be strings (from forms) or objects from DB - normalize to string[]
        tags: (mediaData.tags || []).map((t: any) => typeof t === 'string' ? t : t.name) || []
      }
      
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
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }
      
      const result = await response.json()
      
      // Refresh media list
      await fetchMedia()
      
      return result
      
    } catch (err: any) {
      console.error('Error creating media:', err)
      throw err
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