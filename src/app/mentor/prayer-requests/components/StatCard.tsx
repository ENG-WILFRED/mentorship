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
      className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 hover:border-white/20 p-4 sm:p-5 md:p-6 w-full transition-all hover:shadow-xl group"
      initial={{ opacity: 0, scale: 0.9 }}  
      animate={{ opacity: 1, scale: 1 }}    
       exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}  
      whileHover={{ scale: 1.05 }}      
    >
      <div className="flex items-center">
        {/* Icon */}
        <div
          className={`p-3 sm:p-4 rounded-xl ${iconBgClass} bg-opacity-20`}
        >
          <Icon
            className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${colorClass}`}
          />
        </div>

        {/* Text */}
        <div className="ml-4 sm:ml-5 md:ml-6">
          <p className="text-sm sm:text-base md:text-lg font-semibold text-white/70 group-hover:text-white/80 transition-colors">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/95 mt-1">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
