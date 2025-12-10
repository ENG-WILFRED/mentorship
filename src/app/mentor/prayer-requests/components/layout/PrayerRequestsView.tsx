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
import Image from "next/image";

type Filter = "all" | Status;

/**
 * Prayer Requests Page Component
 * Main page for students to view, submit, and interact with prayer requests.
 */

export default function PrayerRequestsView() {
  const [requests, setRequests] = useState<PrayerRequest[]>(data);
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [snapshotRequests, setSnapshotRequests] = useState<PrayerRequest[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Filter>("all");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

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

  const handleFulfillRequest = (requestId: number) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "fulfilled" } : req
      )
    );
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const fulfilledCount = requests.filter(
    (r) => r.status === "fulfilled"
  ).length;
  const totalRequests = requests.length;

  return (
    <div className="min-h-screen relative font-sans">
      {/* Background image with overlay */}
      {/* Background image centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/pray2.jpg"
          alt="Background"
          fill
          className="w-full h-full object-cover object-center"
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

          {/* Responsive layout: sidebar on lg, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: selectable list on large screens */}
            <aside className="hidden lg:block lg:col-span-1 bg-white/5 rounded-xl p-4 border border-white/10 h-full">
              <h4 className="text-sm font-semibold text-white/90 mb-3">Requests</h4>
              <div className="space-y-2 max-h-[60vh] overflow-auto">
                {filteredRequests.map((req, idx) => (
                  <button
                    key={req.id}
                    onClick={() => { setSelectedIndex(idx); setSelectedRequest(req); setSnapshotRequests(filteredRequests); setShowDetailsModal(true); }}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${selectedIndex === idx ? 'bg-purple-600/30' : 'hover:bg-white/5'}`}>
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <div className="text-sm font-semibold text-white truncate">{req.name}</div>
                        <div className="text-xs text-gray-300 truncate">{req.request.slice(0, 60)}{req.request.length > 60 ? '…' : ''}</div>
                      </div>
                      <div className="text-xs text-gray-200 ml-2">{new Date(req.date).toLocaleDateString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Cards grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredRequests.map((request, idx) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onPrayNow={handlePrayNow}
                    onFulfillRequest={handleFulfillRequest}
                    onViewDetails={(req) => {
                      setSelectedRequest(req);
                      setSelectedIndex(idx);
                      setSnapshotRequests(filteredRequests);
                      setShowDetailsModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

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
