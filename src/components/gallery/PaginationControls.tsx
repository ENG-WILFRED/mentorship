// components/gallery/PaginationControls.tsx
import { ChevronLeft, ChevronRight, List, Infinity as InfiniteScrollIcon } from 'lucide-react';

interface PaginationControlsProps {
  mode: 'pagination' | 'infinite';
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onModeChange: (mode: boolean) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export default function PaginationControls({
  mode,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onModeChange,
  onPageChange,
  onItemsPerPageChange
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onModeChange(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            mode === 'pagination'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          <List size={16} />
          <span className="text-sm">Pagination</span>
        </button>
        <button
          onClick={() => onModeChange(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            mode === 'infinite'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          <InfiniteScrollIcon size={16} />
          <span className="text-sm">Infinite Scroll</span>
        </button>
      </div>

      {/* Pagination Controls */}
      {mode === 'pagination' && totalPages > 1 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 3 && (
                <>
                  <span className="mx-1 text-gray-500">...</span>
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      currentPage === totalPages
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>

            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}