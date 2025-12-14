import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  Eye,
  GraduationCap,
  Heart,
  Loader2,
  User,
} from "lucide-react";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import Button from "../Button";
import { PrayerRequestResponse } from "../../lib/types";

interface RequestCardProps {
  request: PrayerRequestResponse;
  userId: number | null;
  onPrayNow: (id: number) => void;
  onFulfillRequest: (id: number) => void;
  onViewDetails: (request: PrayerRequestResponse) => void;
  isLoadingPrayer?: boolean;
  isLoadingFulfill?: boolean;
}

export default function RequestCard({
  request,
  userId,
  onPrayNow,
  onFulfillRequest,
  onViewDetails,
  isLoadingPrayer = false,
  isLoadingFulfill = false,
}: RequestCardProps) {
  // Check if current user has prayed for this request
  const hasUserPrayed = request.prayedByUsers?.some(
    (p) => p.user.id === userId
  );

  const prayedByCount = request.prayedByUsers?.length || 0;

  return (
    <motion.div
      onClick={() => onViewDetails(request)}
      role="button"
      tabIndex={0}
      className="
        break-inside-avoid bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg
        border border-white/10 hover:border-white/20 transition-all duration-300
        cursor-pointer transform hover:scale-[1.03] hover:shadow-2xl
        group relative overflow-hidden
      "
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-pink-500/0 group-hover:from-purple-500/5 group-hover:via-transparent group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />
      
      <div className="p-4 sm:p-5 md:p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white/95 mb-2">
              {request.name || request.createdBy?.firstName + " " + request.createdBy?.lastName}
            </h3>
            <p className="text-sm sm:text-base text-white/75 mb-3">
              {request.email || request.createdBy?.email}
            </p>
            <div className="flex items-center space-x-2 mb-3">
              <StatusBadge status={request.status || "PENDING"} />
              <PriorityBadge priority={request.priority || "MEDIUM"} />
            </div>
          </div>
          <Heart
            className={`h-6 w-6 ${
              request.priority === "HIGH"
                ? "text-red-400"
                : request.priority === "MEDIUM"
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          />
        </div>

        {/* Request Text */}
        <p className="text-white/85 mb-4 line-clamp-3 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
          {request.request}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm sm:text-base text-white/75 mb-4">
          {request.grade && (
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-purple-400" />
              <span className="font-medium">{request.grade}</span>
            </div>
          )}
          {request.school && (
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-purple-400" />
              <span className="truncate font-medium">{request.school}</span>
            </div>
          )}
          {request.subject && (
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
              <span className="font-medium">{request.subject}</span>
            </div>
          )}
          {request.assignedMentor && (
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-400" />
              <span className="font-medium">{request.assignedMentor.name}</span>
            </div>
          )}
        </div>

        {/* Date and Student ID */}
        <div className="flex items-center justify-between text-sm text-white/75 mb-4">
          <span className="flex items-center font-medium">
            <Calendar className="h-5 w-5 mr-2" />
            {new Date(request.date).toLocaleDateString()}
          </span>
          {request.studentId && <span className="font-medium">ID: {request.studentId}</span>}
        </div>

        {/* Notes */}
        {request.notes && (
          <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3 mb-4 backdrop-blur-sm">
            <p className="text-sm sm:text-base text-purple-200">
              <span className="font-semibold">Note:</span> {request.notes}
            </p>
          </div>
        )}

        {/* Prayed By Count */}
        {prayedByCount > 0 && (
          <div className="mb-4">
            <p className="text-sm sm:text-base text-white/85 font-semibold">
              <span className="text-lg">{prayedByCount}</span>{" "}
              {prayedByCount === 1 ? "person has" : "people have"} prayed
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {request.status !== "FULFILLED" && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrayNow(request.id);
              }}
              disabled={hasUserPrayed || isLoadingPrayer}
              className={`flex items-center justify-center space-x-1 rounded-lg transition-all ${
                hasUserPrayed
                  ? "bg-green-500/30 text-green-200 cursor-not-allowed border border-green-400/30"
                  : isLoadingPrayer
                  ? "bg-purple-500/40 text-white cursor-wait border border-purple-400/30"
                  : "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 border border-purple-400/30"
              }`}
            >
              {isLoadingPrayer ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Praying...</span>
                </>
              ) : (
                <>
                  <Heart className="h-3 w-3" />
                  <span>{hasUserPrayed ? "Prayed" : "Pray"}</span>
                </>
              )}
            </Button>
          )}
          {request.status === "IN_PROGRESS" && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFulfillRequest(request.id);
              }}
              disabled={isLoadingFulfill}
              className={`flex items-center justify-center space-x-1 rounded-lg transition-all ${
                isLoadingFulfill
                  ? "bg-blue-500/40 text-white cursor-wait border border-blue-400/30"
                  : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 border border-blue-400/30"
              }`}
            >
              {isLoadingFulfill ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Fulfilling...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span>Fulfill</span>
                </>
              )}
            </Button>
          )}
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(request);
            }}
            className="flex items-center justify-center space-x-1 bg-white/10 text-white/90 rounded-lg hover:bg-white/20 border border-white/10 transition-all"
          >
            <Eye className="h-3 w-3" />
            <span>View</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}