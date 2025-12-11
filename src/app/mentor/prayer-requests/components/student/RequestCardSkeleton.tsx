import { Skeleton } from '@/components/ui/skeleton';
import { motion } from "framer-motion";

export default function RequestCardSkeleton() {
  return (
   <motion.div
      className="break-inside-avoid bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Header: Name, Email, Status, Priority */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Skeleton className="h-5 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>

        {/* Main Request Text */}
        <Skeleton className="h-6 w-full mb-3" />

        {/* School/Grade/Mentor Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-500 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Date and Student ID */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Notes */}
        <Skeleton className="h-4 w-full bg-purple-100 mb-3" />

        {/* Prayed By List */}
        <Skeleton className="h-4 w-1/2 mb-2" />
        <div className="flex flex-wrap gap-1 mb-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </motion.div>
  );
};
