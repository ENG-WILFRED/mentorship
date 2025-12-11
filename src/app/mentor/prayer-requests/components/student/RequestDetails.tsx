// src/components/DetailedRequestModal.tsx
import React, { useEffect } from "react";
import {
  Building2,
  User,
  Lightbulb,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import { PrayerRequest } from "../../lib/types";
import Button from "../Button";

interface DetailedRequestModalProps {
  selectedRequest: PrayerRequest | null;
  onClose: () => void;
  handlePrayNow: (id: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * Detailed Request ModalComponent
 * Displays the detailed request modal in a card format.
 */

export default function DetailedRequestModal({
  selectedRequest,
  onClose,
  handlePrayNow,
  onPrev,
  onNext,
}: DetailedRequestModalProps) {
  if (!selectedRequest) return null;

  const tags = [
    selectedRequest.studentId,
    selectedRequest.grade,
    selectedRequest.category,
  ];

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

  return (
    <div className="space-y-2">
      {/* Header: navigation */}
      <div className="flex items-center justify-between text-gray-500 hover:text-gray-700">
        <Button type="button" onClick={onPrev} className="flex">
          <ChevronLeft /> Prev
        </Button>
        <Button type="button" onClick={onNext} className="flex">
          Next
          <ChevronRight />
        </Button>
      </div>
      {/* Request Information */}
      <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm md:text-lg font-bold text-gray-900">
              {selectedRequest.name}
            </h3>
            <p className="text-sm text-gray-600">{selectedRequest.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={selectedRequest.status ?? "PENDING"} />
            <PriorityBadge priority={selectedRequest.priority ?? "MEDIUM"} />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Tag key={index} label={tag ?? ""} />
          ))}
        </div>
      </div>

      {/* School and Mentor Info */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          title="School Information"
          icon={<Building2 className="h-4 w-4 mr-2 text-purple-600" />}
          primaryInfo={selectedRequest.school ?? ""}
          secondaryInfo={selectedRequest.subject ?? ""}
        />
        <InfoCard
          title="Mentor Information"
          icon={<User className="h-4 w-4 mr-2 text-purple-600" />}
          primaryInfo={selectedRequest.mentor ?? ""}
          secondaryInfo="Current Mentor"
        />
      </div>

      {/* Prayer Request Content */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2">Prayer Request</h4>
        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
          {selectedRequest.request}
        </p>
      </div>

      {/* Additional Notes (if any) */}
      {selectedRequest.notes && (
        <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-700 mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 " />
            Additional Notes
          </h4>
          <p className="text-xs sm:text-sm md:text-base text-purple-700">
            {selectedRequest.notes}
          </p>
        </div>
      )}

      {/* Date Submitted and Prayed By */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">Date Submitted</h4>
          <p className="text-gray-700 text-xs sm:text-sm md:text-base">
            {selectedRequest.date
              ? new Date(selectedRequest.date).toLocaleDateString()
              : "Date not available"}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">Prayed By</h4>
          {(selectedRequest.prayedBy ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {(selectedRequest.prayedBy ?? []).map((prayer, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm md:text-base"
                >
                  {prayer}
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
        {selectedRequest.id && (
          <Button
            type="submit"
            onClick={() => {
              handlePrayNow(selectedRequest.id ?? -1);
              onClose();
            }}
            className="flex-1 bg-linear-to-r from-purple-600  to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Heart className="inline h-4 w-4 mr-2" />
            Pray
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
