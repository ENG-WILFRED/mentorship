import { useEffect, useState } from "react";
import { CheckCircle, Activity, Heart } from "lucide-react";
import StatCard from "../StatCard";
import FilterBar from "../FilterBar";
import RequestCard from "../student/RequestCard";
import { PrayerRequest, StatusOptions } from "../../lib/types";
import PrayerRequestHeader from "../PrayerRequestHeader";
import Image from "next/image";
import { motion } from "framer-motion";
import RequestCardSkeleton from "../student/RequestCardSkeleton";
import Modal from "../Modal";
import RequestForm from "../student/RequestForm";
import DetailedRequestModal from "../student/RequestDetails";
import { fetchPrayerRequests } from "@/actions/prayer/fetchPrayerRequests";

type Filter = "all" | StatusOptions;

/**
 * Prayer Requests Page Component
 * Main page for students to view, submit, and interact with prayer requests.
 */
export default function PrayerRequestsView() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]); // Start with an empty array
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [snapshotRequests, setSnapshotRequests] = useState<PrayerRequest[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Filter>("all");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch prayer requests from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRequests = await fetchPrayerRequests({
          status: filterStatus !== "all" ? filterStatus : undefined, 
          search: searchTerm || undefined, 
        });
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching prayer requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filterStatus, searchTerm]); 

  // Filter logic
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.school?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handlePrayNow = (requestId: number) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "IN_PROGRESS",
            prayedBy: [...(req.prayedBy || []), "Current User"],
            }
          : req
      )
    );
  };

  const handleFulfillRequest = (requestId: number) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "FULFILLED" } : req
      )
    );
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const fulfilledCount = requests.filter((r) => r.status === "FULFILLED").length;
  const totalRequests = requests.length;

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
        {/* Overlay */}
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
              value={totalRequests}
              icon={Heart}
              colorClass="text-purple-600"
              iconBgClass="bg-purple-100"
            />
            <StatCard
              title="Pending"
              value={pendingCount}
              icon={Activity}
              colorClass="text-yellow-600"
              iconBgClass="bg-yellow-100"
            />
            <StatCard
              title="Fulfilled"
              value={fulfilledCount}
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
          <motion.div
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="break-inside-avoid mb-4">
                    <RequestCardSkeleton />
                  </div>
                ))
              : filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    className="break-inside-avoid mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.07 }}
                  >
                    <RequestCard
                      request={request}
                      onPrayNow={handlePrayNow}
                      onFulfillRequest={handleFulfillRequest}
                      onViewDetails={(req) => {
                        setSelectedRequest(req);
                        setShowDetailsModal(true);
                        setSnapshotRequests(filteredRequests);
                        setSelectedIndex(filteredRequests.findIndex(r => r.id === req.id));
                      }}
                    />
                  </motion.div>
                ))}
          </motion.div>

          {/* Empty state */}
          {filteredRequests.length === 0 && (
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
            <RequestForm setShowModal={setShowModal} />
          </Modal>
        )}

        {showDetailsModal && selectedRequest && (
          <Modal
            title="Prayer Request Details"
            onClose={() => setShowDetailsModal(false)}
          >
            <DetailedRequestModal
              selectedRequest={selectedRequest}
              handlePrayNow={handlePrayNow}
              onClose={() => setShowDetailsModal(false)}
              onPrev={() => {
                if (selectedIndex === null || !snapshotRequests) return;
                const prev = selectedIndex - 1;
                if (prev >= 0) {
                  setSelectedIndex(prev);
                  setSelectedRequest(snapshotRequests[prev]);
                }
              }}
              onNext={() => {
                if (selectedIndex === null || !snapshotRequests) return;
                const next = selectedIndex + 1;
                if (next < snapshotRequests.length) {
                  setSelectedIndex(next);
                  setSelectedRequest(snapshotRequests[next]);
                }
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
