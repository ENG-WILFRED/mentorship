// components/gallery/GalleryFilters.tsx
import { Filter, Calendar, ArrowUpDown } from 'lucide-react';
import { FilterState, CATEGORIES } from './data';

interface GalleryFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export default function GalleryFilters({ filters, onFilterChange }: GalleryFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-purple-400" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange('category', null)}
              className={`px-4 py-2 rounded-lg transition-all ${
                !filters.category
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat: string) => (
              <button
                key={cat}
                onClick={() => onFilterChange('category', cat)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filters.category === cat
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Date
          </label>
          <select
            value={filters.time}
            onChange={(e) => onFilterChange('time', e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <ArrowUpDown size={16} className="inline mr-1" />
            Sort
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
}