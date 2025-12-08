// components/gallery/TagFilters.tsx
import { Tag, X } from 'lucide-react';
import { ALL_TAGS } from './data';

interface TagFiltersProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

export default function TagFilters({ selectedTags, onTagToggle, onClearTags }: TagFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={20} className="text-cyan-400" />
          <h3 className="font-semibold">Tags</h3>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearTags}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <X size={16} />
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((tag: string) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedTags.includes(tag)
                ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}