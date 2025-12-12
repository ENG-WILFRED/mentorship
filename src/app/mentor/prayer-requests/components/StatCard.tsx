import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
  iconBgClass: string;
}

/**
 * Stats Card Component
 * Displays a single statistic card with motion animations.
 */

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  iconBgClass,
}: StatCardProps) {
  return (
    <motion.div
      className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      initial={{ opacity: 0, scale: 0.9 }}  
      animate={{ opacity: 1, scale: 1 }}    
       exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}  
      whileHover={{ scale: 1.05 }}      
    >
      <div className="flex items-center">
        {/* Icon */}
        <div
          className={`p-2 rounded-lg ${iconBgClass}`}
        >
          <Icon
            className={`h-5 w-5 ${colorClass}`}
          />
        </div>

        {/* Text */}
        <div className="ml-3 sm:ml-4 md:ml-5">
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-sm sm:text-base font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
