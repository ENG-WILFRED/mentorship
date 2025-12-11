// components/MediaGallery/MediaFilters.tsx
'use client'

import { Search, Filter } from 'lucide-react'
import { MediaFilters } from './types'

interface MediaFiltersProps {
  filters: MediaFilters
  onFilterChange: (filters: MediaFilters) => void
}

export function MediaFiltersComponent({ filters, onFilterChange }: MediaFiltersProps) {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'MISSION', label: 'Missions' },
    { value: 'SERMON', label: 'Sermons' },
    { value: 'EVENT', label: 'Events' },
    { value: 'STUDENT', label: 'Students' }
  ]

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'IMAGE', label: 'Images' },
    { value: 'VIDEO', label: 'Videos' },
    { value: 'DOCUMENT', label: 'Documents' }
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 })
  }

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category: category as any, page: 1 })
  }

  const handleTypeChange = (type: string) => {
    onFilterChange({ ...filters, type: type as any, page: 1 })
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search media by caption, description, or tags..."
          value={filters.search || ''}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter by:</span>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.category === cat.value || (!filters.category && cat.value === 'all')
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.type === type.value || (!filters.type && type.value === 'all')
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}