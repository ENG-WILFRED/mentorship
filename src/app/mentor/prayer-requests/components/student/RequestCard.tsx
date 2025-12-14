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
        break-inside-avoid bg-white/75 backdrop-blur-sm rounded-xl shadow-sm
        border border-white/30 hover:shadow-md transition-all duration-200
        cursor-pointer transform hover:scale-[1.02]
      "
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {request.name || request.createdBy?.firstName + " " + request.createdBy?.lastName}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {request.email || request.createdBy?.email}
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <StatusBadge status={request.status || "PENDING"} />
              <PriorityBadge priority={request.priority || "MEDIUM"} />
            </div>
          </div>
          <Heart
            className={`h-4 w-4 ${
              request.priority === "HIGH"
                ? "text-red-600"
                : request.priority === "MEDIUM"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          />
        </div>

        {/* Request Text */}
        <p className="text-gray-800 mb-3 line-clamp-3 text-sm sm:text-base">
          {request.request}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700 mb-3">
          {request.grade && (
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-purple-600" />
              <span>{request.grade}</span>
            </div>
          )}
          {request.school && (
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-purple-600" />
              <span className="truncate">{request.school}</span>
            </div>
          )}
          {request.subject && (
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
              <span>{request.subject}</span>
            </div>
          )}
          {request.assignedMentor && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-purple-600" />
              <span>{request.assignedMentor.name}</span>
            </div>
          )}
        </div>

        {/* Date and Student ID */}
        <div className="flex items-center justify-between text-xs text-gray-700 mb-3">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(request.date).toLocaleDateString()}
          </span>
          {request.studentId && <span>ID: {request.studentId}</span>}
        </div>

        {/* Notes */}
        {request.notes && (
          <div className="bg-purple-100 border border-purple-200/50 rounded-lg p-2 mb-3">
            <p className="text-xs sm:text-sm text-purple-700">
              <span className="font-medium">Note:</span> {request.notes}
            </p>
          </div>
        )}

        {/* Prayed By Count */}
        {prayedByCount > 0 && (
          <div className="mb-3">
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-medium">{prayedByCount}</span>{" "}
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
                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                  : isLoadingPrayer
                  ? "bg-purple-400 text-white cursor-wait"
                  : "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
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
                  ? "bg-blue-400 text-white cursor-wait"
                  : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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
            className="flex items-center justify-center space-x-1 bg-gray-100/70 text-gray-700 rounded-lg hover:bg-gray-200/70"
          >
            <Eye className="h-3 w-3" />
            <span>View</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}