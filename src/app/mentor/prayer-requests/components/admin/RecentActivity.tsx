import {
  Heart,
  Clock,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState } from "react";
import { PrayerRequestResponse } from "../../lib/types";
import Button from "../Button";

interface RecentActivityProps {
  recentRequests: PrayerRequestResponse[];
  deleteRequest?: (id: number) => void;
}

export default function RecentActivity({recentRequests, deleteRequest}: RecentActivityProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequestResponse | null>(null);

  const handleDeleteClick = (request: PrayerRequestResponse) => {
    setSelectedRequest(request);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequest && deleteRequest) {
      deleteRequest(selectedRequest.id);
      setShowDeleteDialog(false);
      setSelectedRequest(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentRequests.length > 0 ? (
            recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {request.name ||
                          `${request.createdBy?.firstName} ${request.createdBy?.lastName}`}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {request.request}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            request.status === "FULFILLED"
                              ? "bg-green-100 text-green-700"
                              : request.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {request.status}
                        </span>
                        {request.school && (
                          <span className="text-xs text-gray-500">
                            {request.school}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(request.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {request.prayedByUsers?.length || 0} prayers
                        </p>
                      </div>
                      {deleteRequest && (
                        <button
                          onClick={() => handleDeleteClick(request)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete request"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl md:max-w-2xl sm:max-w-sm transform transition-all animate-in scale-in-95 duration-200 my-8">
            {/* Header - Danger Theme */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-t-xl">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-red-500/30 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Delete Prayer Request</h2>
                  <p className="text-red-100 text-xs sm:text-sm mt-1">This action cannot be undone</p>
                </div>
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="text-red-100 hover:text-white transition p-1 hover:bg-red-500/20 rounded flex-shrink-0"
                >
                  <X className="h-4 sm:h-5 w-4 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border-l-4 border-red-600 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 text-red-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-red-900 text-sm sm:text-base mb-1">Warning</h3>
                  <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                    Deleting this prayer request will permanently remove it from the system.
                  </p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-gray-50 border-b space-y-4 sm:space-y-5 max-h-64 sm:max-h-72 md:max-h-80 overflow-y-auto">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Student Name</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 mt-1 sm:mt-2 break-words">
                  {selectedRequest.name || `${selectedRequest.createdBy?.firstName} ${selectedRequest.createdBy?.lastName}` || "N/A"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Prayer Request</p>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 sm:mt-2 leading-relaxed break-words whitespace-normal">
                  {selectedRequest.request}
                </p>
              </div>
            </div>

            {/* Confirmation Text */}
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-white">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Are you absolutely sure? This action cannot be reversed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 md:p-8 bg-white rounded-b-xl border-t">
              <Button
                type="button"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm md:text-base"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 text-xs sm:text-sm md:text-base whitespace-nowrap"
                onClick={handleConfirmDelete}
              >
                <Trash2 className="inline mr-1 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
