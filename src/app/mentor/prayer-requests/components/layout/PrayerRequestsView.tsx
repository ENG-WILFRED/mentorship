"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Activity, Heart } from "lucide-react";
import StatCard from "../StatCard";
import FilterBar from "../FilterBar";
import RequestCard from "../student/RequestCard";
import { PrayerRequestResponse, StatusOptions } from "../../lib/types";
import PrayerRequestHeader from "../PrayerRequestHeader";
import Image from "next/image";
import { motion } from "framer-motion";
import RequestCardSkeleton from "../student/RequestCardSkeleton";
import Modal from "../Modal";
import RequestForm from "../student/RequestForm";
import DetailedRequestModal from "../student/RequestDetails";
import {
  usePrayerRequests,
  useAddPrayer,
  useUpdatePrayerRequest,
  usePrayerStats,
} from "@/app/mentor/prayer-requests/hooks";
import { decodeToken, getAccessToken } from "@/lib/auth";


type FilterType = "all" | StatusOptions;

export default function PrayerRequestsView() {
  const [selectedRequest, setSelectedRequest] =
    useState<PrayerRequestResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterType>("all");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [loadingPrayerId, setLoadingPrayerId] = useState<number | null>(null);
  const [loadingFulfillId, setLoadingFulfillId] = useState<number | null>(null);

  // Get User id from token
  const token = getAccessToken();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = decodeToken(token);
        setUserId(parseInt(decodedToken?.userId?.toString() || "0"));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  // ==================== CENTRALIZED HOOKS ====================

  // Fetch prayer requests
  const {
    data: requests,
    isLoading,
    isError,
  } = usePrayerRequests({
    status: filterStatus === "all" ? undefined : filterStatus,
    includePrayedBy: true,
  });

  // Fetch prayer statistics
  const { stats } = usePrayerStats();

  // Add prayer mutation
  const { addPrayer, isLoading: isPrayerLoading } = useAddPrayer();

  // Update prayer request mutation
  const { updatePrayerRequest, isLoading: isUpdateLoading } = useUpdatePrayerRequest();

  // ==================== HANDLERS ====================

  const handlePrayNow = (requestId: number) => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    setLoadingPrayerId(requestId);

    // Add prayer and change status to IN_PROGRESS if currently PENDING
    addPrayer(
      {
        prayerRequestId: requestId,
        userId: userId,
      },
      {
        onSuccess: () => {
          // Check if the request is currently PENDING
          const currentRequest = requests?.find((r) => r.id === requestId);
          if (currentRequest?.status === "PENDING") {
            // Update status to IN_PROGRESS
            updatePrayerRequest({
              id: requestId,
              status: "IN_PROGRESS",
            });
          }
          setLoadingPrayerId(null);
        },
        onError: () => {
          setLoadingPrayerId(null);
        },
      }
    );
  };

  const handleFulfillRequest = (requestId: number) => {
    setLoadingFulfillId(requestId);
    
    updatePrayerRequest(
      {
        id: requestId,
        status: "FULFILLED",
      },
      {
        onSuccess: () => {
          setLoadingFulfillId(null);
        },
        onError: () => {
          setLoadingFulfillId(null);
        },
      }
    );
  };

  // Filter requests by search term (client-side)
  const filteredRequests =
    requests?.filter((request) => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        request.request.toLowerCase().includes(searchLower) ||
        request.name?.toLowerCase().includes(searchLower) ||
        request.school?.toLowerCase().includes(searchLower) ||
        request.studentId?.toLowerCase().includes(searchLower)
      );
    }) || [];

  // Navigation handlers for modal
  const handlePrev = () => {
    if (selectedIndex === null || !filteredRequests) return;
    const prev = selectedIndex - 1;
    if (prev >= 0) {
      setSelectedIndex(prev);
      setSelectedRequest(filteredRequests[prev]);
    }
  };

  const handleNext = () => {
    if (selectedIndex === null || !filteredRequests) return;
    const next = selectedIndex + 1;
    if (next < filteredRequests.length) {
      setSelectedIndex(next);
      setSelectedRequest(filteredRequests[next]);
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      {/* Background image with overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/pray3.jpg"
          alt="Background"
          fill
          className="w-full h-full object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <PrayerRequestHeader setShowModal={setShowModal} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Requests"
              value={stats?.total || 0}
              icon={Heart}
              colorClass="text-purple-600"
              iconBgClass="bg-purple-100"
            />
            <StatCard
              title="Pending"
              value={stats?.pending || 0}
              icon={Activity}
              colorClass="text-yellow-600"
              iconBgClass="bg-yellow-100"
            />
            <StatCard
              title="Fulfilled"
              value={stats?.fulfilled || 0}
              icon={CheckCircle}
              colorClass="text-green-600"
              iconBgClass="bg-green-100"
            />
          </div>

          {/* Filters */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />

          {/* Request Cards Grid */}
          {isLoading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <RequestCardSkeleton />
                </div>
              ))}
            </motion.div>
          ) : isError ? (
            <div className="text-center py-12 text-white">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-2">
                Something went wrong while fetching prayer requests.
              </h3>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
            >
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.07 }}
                >
                  <RequestCard
                    request={request}
                    userId={userId}
                    onPrayNow={handlePrayNow}
                    onFulfillRequest={handleFulfillRequest}
                    onViewDetails={(req) => {
                      setSelectedRequest(req);
                      setShowDetailsModal(true);
                      setSelectedIndex(
                        filteredRequests.findIndex((r) => r.id === req.id)
                      );
                    }}
                    isLoadingPrayer={loadingPrayerId === request.id}
                    isLoadingFulfill={loadingFulfillId === request.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filteredRequests.length === 0 && (
            <div className="text-center py-12 text-white">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-2">
                No prayer requests found
              </h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showModal && (
          <Modal
            title="Share Your Prayer Request"
            onClose={() => setShowModal(false)}
          >
            <RequestForm setShowModal={setShowModal} userId={userId} />
          </Modal>
        )}

        {showDetailsModal && selectedRequest && (
          <Modal
            title="Prayer Request Details"
            onClose={() => setShowDetailsModal(false)}
          >
            <DetailedRequestModal
              selectedRequest={selectedRequest}
              userId={userId}
              handlePrayNow={handlePrayNow}
              onClose={() => setShowDetailsModal(false)}
              onPrev={handlePrev}
              onNext={handleNext}
              isLoadingPrayer={loadingPrayerId === selectedRequest.id}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}