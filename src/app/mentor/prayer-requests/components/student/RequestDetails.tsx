// src/components/DetailedRequestModal.tsx
import React from "react";
import { Building2, User, Lightbulb, Heart, X } from "lucide-react";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import { PrayerRequest } from "../../types";

interface DetailedRequestModalProps {
  selectedRequest: PrayerRequest | null;
  onClose: () => void;
  handlePrayNow: (id: number) => void;
}

/**
 * Detailed Request ModalComponent
 * Displays the detailed request modal in a card format.
 */

export default function DetailedRequestModal({
  selectedRequest,
  onClose,
  handlePrayNow,
}: DetailedRequestModalProps) {
  if (!selectedRequest) return null;

  return (
    <div className="space-y-6">
      {/* Request Information */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{selectedRequest.name}</h3>
            <p className="text-gray-600">{selectedRequest.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={selectedRequest.status} />
            <PriorityBadge priority={selectedRequest.priority} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-white text-purple-700 px-2 py-1 rounded-full text-sm font-medium border border-purple-200">
            {selectedRequest.studentId}
          </span>
          <span className="bg-white text-purple-700 px-2 py-1 rounded-full text-sm font-medium border border-purple-200">
            {selectedRequest.grade}
          </span>
          <span className="bg-white text-purple-700 px-2 py-1 rounded-full text-sm font-medium border border-purple-200">
            {selectedRequest.category}
          </span>
        </div>
      </div>

      {/* School and Mentor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-purple-600" />
            School Information
          </h4>
          <p className="text-gray-700">{selectedRequest.school}</p>
          <p className="text-gray-600 text-sm mt-1">{selectedRequest.subject}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <User className="h-4 w-4 mr-2 text-purple-600" />
            Mentor Information
          </h4>
          <p className="text-gray-700">{selectedRequest.mentor}</p>
          <p className="text-gray-600 text-sm mt-1">Current Mentor</p>
        </div>
      </div>

      {/* Prayer Request Content */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2">Prayer Request</h4>
        <p className="text-gray-700 leading-relaxed">{selectedRequest.request}</p>
      </div>

      {/* Additional Notes (if any) */}
      {selectedRequest.notes && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-700 mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Additional Notes
          </h4>
          <p className="text-purple-700">{selectedRequest.notes}</p>
        </div>
      )}

      {/* Date Submitted and Prayed By */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">Date Submitted</h4>
          <p className="text-gray-700">
            {new Date(selectedRequest.date).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-2">Prayed By</h4>
          {selectedRequest.prayedBy.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedRequest.prayedBy.map((prayer, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {prayer}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No one has prayed for this request yet</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        {selectedRequest.status !== "fulfilled" && (
          <button
            onClick={() => {
              handlePrayNow(selectedRequest.id);
              onClose(); // Close modal after praying for request
            }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Heart className="inline h-4 w-4 mr-2" />
            Pray for This Request
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
