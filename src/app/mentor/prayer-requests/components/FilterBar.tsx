import { Filter as FilterIcon, Search as SearchIcon } from "lucide-react";
import React from "react";
import { Status } from "../types";
import InputField from "./InputField";
import SelectField from "./SelectField";

type FilterType = "all" | Status; // Renamed Filter to FilterType to avoid naming conflict

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: FilterType;
  onFilterChange: (value: FilterType) => void;
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
  const filterOptions = ["all", "pending", "in-progress", "fulfilled"];

  return (
    <div
      className="
        bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/30
        p-3 mb-5
      "
    >
      <div
        className="
          flex flex-col sm:flex-row items-center
          gap-3 sm:gap-4 md:gap-5
          text-gray-600
        "
      >
        {/* Search Input */}
        <div className="flex-1 relative w-full">
          <SearchIcon
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              h-4 w-4 sm:h-5 sm:w-5
              text-gray-500
            "
          />

          <InputField
            type="text"
            placeholder="Search by name, student ID, school, or request..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              pl-10 pr-4
              text-xs sm:text-sm md:text-base
            "
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full sm:w-auto">
          <FilterIcon
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              h-4 w-4 sm:h-5 sm:w-5
              text-gray-500
            "
          />

          <SelectField
            options={filterOptions}
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="
              pl-10 pr-4
              text-xs sm:text-sm md:text-base
              w-full sm:w-auto
            "
          />
        </div>
      </div>
    </div>
  );
}
