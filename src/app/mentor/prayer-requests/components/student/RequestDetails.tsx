import React, { useEffect } from "react";
import {
  Building2,
  User,
  Lightbulb,
  Heart,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import Button from "../Button";
import { PrayerRequestResponse } from "../../lib/types";

interface DetailedRequestModalProps {
  selectedRequest: PrayerRequestResponse;
  userId: number | null;
  onClose: () => void;
  handlePrayNow: (id: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  isLoadingPrayer?: boolean;
}

export default function DetailedRequestModal({
  selectedRequest,
  userId,
  onClose,
  handlePrayNow,
  onPrev,
  onNext,
  isLoadingPrayer = false,
}: DetailedRequestModalProps) {
  // Check if current user has prayed
  const hasUserPrayed = selectedRequest.prayedByUsers?.some(
    (p) => p.user.id === userId
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev && onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext && onNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose && onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onClose]);

  const tags = [
    selectedRequest.studentId,
    selectedRequest.grade,
    selectedRequest.category,
  ].filter(Boolean);

  return (
    <div className="space-y-2">
      {/* Navigation */}
      <div className="flex items-center justify-between text-gray-500">
        <Button type="button" onClick={onPrev} className="flex items-center">
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <Button type="button" onClick={onNext} className="flex items-center">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Request Information */}
      <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm md:text-lg font-bold text-gray-900">
              {selectedRequest.name ||
                `${selectedRequest.createdBy?.firstName} ${selectedRequest.createdBy?.lastName}`}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedRequest.email || selectedRequest.createdBy?.email}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={selectedRequest.status || "PENDING"} />
            <PriorityBadge priority={selectedRequest.priority || "MEDIUM"} />
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <Tag key={index} label={tag!} />
            ))}
          </div>
        )}
      </div>

      {/* School and Mentor Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectedRequest.school && (
          <InfoCard
            title="School Information"
            icon={<Building2 className="h-4 w-4 mr-2 text-purple-600" />}
            primaryInfo={selectedRequest.school}
            secondaryInfo={selectedRequest.subject || undefined}
          />
        )}
        {selectedRequest.assignedMentor && (
          <InfoCard
            title="Mentor Information"
            icon={<User className="h-4 w-4 mr-2 text-purple-600" />}
            primaryInfo={selectedRequest.assignedMentor.name}
            secondaryInfo={
              selectedRequest.assignedMentor.email || "Current Mentor"
            }
          />
        )}
      </div>

      {/* Prayer Request Content */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2">Prayer Request</h4>
        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
          {selectedRequest.request}
        </p>
      </div>

      {/* Additional Notes */}
      {selectedRequest.notes && (
        <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-700 mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Additional Notes
          </h4>
          <p className="text-xs sm:text-sm md:text-base text-purple-700">
            {selectedRequest.notes}
          </p>
        </div>
      )}

      {/* Date and Prayed By */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">Date Submitted</h4>
          <p className="text-gray-700 text-xs sm:text-sm md:text-base">
            {new Date(selectedRequest.date).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">
            Prayed By ({selectedRequest.prayedByUsers?.length || 0})
          </h4>
          {(selectedRequest.prayedByUsers?.length || 0) > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedRequest.prayedByUsers?.map((prayer, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm"
                >
                  {prayer.user.firstName} {prayer.user.lastName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              No one has prayed for this request yet
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        {selectedRequest.status !== "FULFILLED" && (
          <Button
            type="button"
            onClick={() => {
              handlePrayNow(selectedRequest.id);
              if (!isLoadingPrayer) {
                onClose();
              }
            }}
            disabled={hasUserPrayed || isLoadingPrayer}
            className={`flex-1 rounded-lg font-medium transition-all flex items-center justify-center ${
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
                Praying...
              </>
            ) : (
              <>
                <Heart className="inline h-4 w-4 mr-2" />
                {hasUserPrayed ? "Already Prayed" : "Pray Now"}
              </>
            )}
          </Button>
        )}
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

type InfoCardProps = {
  title: string;
  icon: React.ReactNode;
  primaryInfo: string;
  secondaryInfo?: string;
};

function InfoCard({ title, icon, primaryInfo, secondaryInfo }: InfoCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h4 className="text-sm md:text-lg font-semibold text-gray-800 mb-2 flex items-center">
        {icon}
        {title}
      </h4>
      <p className="text-sm md:text-base text-gray-700">{primaryInfo}</p>
      {secondaryInfo && (
        <p className="text-gray-600 text-xs md:text-sm mt-1">{secondaryInfo}</p>
      )}
    </div>
  );
}

type TagProps = {
  label: string;
};

function Tag({ label }: TagProps) {
  return (
    <span className="bg-white text-purple-700 px-2 py-1 rounded-full text-xs md:text-sm font-medium border border-purple-200">
      {label}
    </span>
  );
}
