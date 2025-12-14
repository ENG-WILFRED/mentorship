import { Filter as FilterIcon, Search as SearchIcon } from "lucide-react";
import React from "react";
import { StatusOptions } from "../lib/types";
import InputField from "./form fields/InputField";
import SelectField from "./form fields/SelectField";
import { motion } from "framer-motion"; 

type FilterType = "all" | StatusOptions; 

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
  const filterOptions = ["all", "PENDING", "IN_PROGRESS", "FULFILLED"];

  return (
    <motion.div
      className="
        bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 hover:border-white/20
        p-4 sm:p-5 md:p-6 mb-6 transition-all
      "
       initial={{ opacity: 0, scale: 0.9 }}  
      animate={{ opacity: 1, scale: 1 }}    
       exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}  
     
    >
      <div
        className="
          flex flex-col sm:flex-row items-center
          gap-4 sm:gap-5 md:gap-6
          text-white/80
        "
      >
        {/* Search Input */}
        <div className="flex-1 relative w-full">
          <SearchIcon
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              h-5 w-5 sm:h-6 sm:w-6
              text-white/60
            "
          />

          <InputField
          name='filter'
            type="text"          
            placeholder="Search by name, student ID, school, or request..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              pl-12 pr-4 py-3 sm:py-4
              text-sm sm:text-base md:text-lg border-white/20
              bg-white/10 text-white placeholder-white/50 rounded-xl
              focus:bg-white/15 focus:border-white/40
            "
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full sm:w-auto">
          <FilterIcon
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              h-5 w-5 sm:h-6 sm:w-6
              text-white/60
            "
          />

          <SelectField
          name='filterOptions'
            options={filterOptions}
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="
              pl-12 pr-4 py-3 sm:py-4
              text-sm sm:text-base md:text-lg
              border-white/20
              bg-white/10 text-white rounded-xl
              focus:bg-white/15 focus:border-white/40
              w-full sm:w-auto
            "
          />
        </div>
      </div>
    </motion.div>
  );
}
