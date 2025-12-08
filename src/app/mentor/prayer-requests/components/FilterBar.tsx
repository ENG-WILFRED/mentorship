import { Filter, Search } from "lucide-react";
import React from "react";
import { Status } from "../types";

type Filter = 'all' | Status

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: Filter;
  onFilterChange: (value: Filter) => void;
}

/**
 * Filter and Search Bar Component
 * Provides search and filtering controls.
 */

export default function FilterBar({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-4 mb-6 border border-white/30">
      <div className="flex flex-col sm:flex-row gap-3 text-gray-600">
        <div className="flex-1 relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, student ID, school, or request..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg outline-0 focus:outline-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as Filter)}
            className="pl-8 pr-6 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>
      </div>
    </div>
  );
}
