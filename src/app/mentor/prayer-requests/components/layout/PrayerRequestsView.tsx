import React, { useState } from "react";
import { CheckCircle, Activity, Heart, Plus } from "lucide-react";
import StatCard from "../StatCard";
import FilterBar from "../FilterBar";
import RequestCard from "../student/RequestCard";
import { data } from "../../constants/data";
import Modal from "../Modal";
import RequestForm from "../student/RequestForm";
import DetailedRequestModal from "../student/RequestDetails";
import { PrayerRequest, Status } from "../../types";
import PrayerRequestHeader from "../PrayerRequestHeader";

type Filter = "all" | Status;

/**
 * Prayer Requests Page Component
 * Main page for students to view, submit, and interact with prayer requests.
 */

export default function PrayerRequestsView() {
  const [requests, setRequests] = useState<PrayerRequest[]>(data);

  // State for modals and filters
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Filter>("all");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  // Filter requests based on search term and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Handler to mark a request as prayed for
  const handlePrayNow = (requestId: number) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "in-progress",
              prayedBy: [...req.prayedBy, "Current User"],
            }
          : req
      )
    );
  };

  // Handler to mark a request as fulfilled
  const handleFulfillRequest = (requestId: number) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "fulfilled" } : req
      )
    );
  };

  // Calculate statistics
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const fulfilledCount = requests.filter(
    (r) => r.status === "fulfilled"
  ).length;
  const totalRequests = requests.length;
  return (
    <div className="min-h-screen bg-linear-to-r from-pink-100 via-purple-100 to-pink-100">
      {/* Header Section */}
      <PrayerRequestHeader setShowModal={setShowModal} />

      {/* Stats Cards Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        {/* Filters and Search Section */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* Masonry Grid of Request Cards Section */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onPrayNow={handlePrayNow}
              onFulfillRequest={handleFulfillRequest}
              onViewDetails={(req) => {
                setSelectedRequest(req);
                setShowDetailsModal(true);
              }}
            />
          ))}
        </div>

        {/* Empty State Section */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 mb-2">
              No prayer requests found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* New Prayer Request Modal */}
      {showModal && (
        <Modal
          title="Share Your Prayer Request"
          onClose={() => setShowModal(false)}
        >
          <RequestForm setShowModal={setShowModal} />
        </Modal>
      )}

      {/* Detailed Request Modal */}
      {showDetailsModal && selectedRequest && (
        <Modal
          title="Prayer Request Details"
          onClose={() => setShowDetailsModal(false)}
        >
          <DetailedRequestModal
            selectedRequest={selectedRequest}
            handlePrayNow={handlePrayNow}
            onClose={() => setShowDetailsModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
