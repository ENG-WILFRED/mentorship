// lib/types/media.ts
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT'
export type MediaCategory = 'MISSION' | 'SERMON' | 'EVENT' | 'STUDENT'

export interface MediaItem {
  id: number
  url: string
  thumbnail?: string
  caption: string
  type: MediaType
  category: MediaCategory
  date: string
  location?: string
  uploaderId: number
  uploader: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  likes: number
  views: number
  description?: string
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: number
  name: string
}

export interface MediaFilters {
  category?: MediaCategory | 'all'
  type?: MediaType | 'all'
  search?: string
  page?: number
  limit?: number
}

export interface MediaResponse {
  data: MediaItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}