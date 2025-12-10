import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  Eye,
  GraduationCap,
  Heart,
  User,
} from "lucide-react";
import React from "react";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import { PrayerRequest } from "../../types";
import Button from "../Button";

interface RequestCardProps {
  request: PrayerRequest;
  onPrayNow: (id: number) => void;
  onFulfillRequest: (id: number) => void;
  onViewDetails: (request: PrayerRequest) => void;
}

/**
 * Request Card Component
 * Displays a single prayer request in a card format.
 */

export default function RequestCard({
  request,
  onPrayNow,
  onFulfillRequest,
  onViewDetails,
}: RequestCardProps) {
  const {
    id,
    name,
    email,
    request: text,
    date,
    status,
    priority,
    mentor,
    prayedBy,
    notes,
    studentId,
    grade,
    school,
    subject,
  } = request;

  return (
    <div
      onClick={() => onViewDetails(request)}
      role="button"
      tabIndex={0}
      className="
        break-inside-avoid bg-gradient-to-br from-white/85 to-white/70 backdrop-blur-md rounded-2xl shadow-md
        border border-gray-100 hover:shadow-xl transition-all duration-200
        cursor-pointer transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-300
      "
    >
      <div className="p-4 sm:p-5 md:p-6 lg:p-6">
        {/* Header: Name, Email, Status, Priority */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mb-2 truncate">{email}</p>
            <div className="flex items-center space-x-2 mb-2">
              <StatusBadge status={status} />
              <PriorityBadge priority={priority} />
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Heart
              className={`
                h-4 w-4 
                ${
                  priority === "high"
                    ? "text-red-600"
                    : priority === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              `}
            />
          </div>
        </div>

        {/* Main Request Text */}
        <p className="text-gray-700 mb-3 line-clamp-4 text-sm sm:text-sm md:text-base">
          {text}
        </p>

        {/* School/Grade/Mentor Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <GraduationCap className="h-4 w-4  mr-2 text-purple-600" />
            <span>{grade}</span>
          </div>
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-purple-600" />
            <span className="truncate">{school}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
            <span>{subject}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-purple-600" />
            <span>{mentor}</span>
          </div>
        </div>

        {/* Date and Student ID */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            {new Date(date).toLocaleDateString()}
          </span>
          <span>ID: {studentId}</span>
        </div>

        {/* Notes */}
        {notes && (
          <div className="bg-purple-100 border border-purple-200/50 rounded-lg p-2 mb-3">
            <p className="text-xs sm:text-sm text-purple-700">
              <span className="font-medium">Note:</span> {notes}
            </p>
          </div>
        )}

        {/* Prayed By List */}
        {prayedBy.length > 0 && (
          <div className="mb-3">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Prayed by:
            </p>
            <div className="flex flex-wrap gap-1">
              {prayedBy.map((prayer, index) => (
                <span
                  key={index}
                  className="bg-green-100/70 text-green-800 text-xs sm:text-sm px-2 py-1 rounded-full"
                >
                  {prayer}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {status !== "fulfilled" && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrayNow(id);
              }}
              className="
                flex items-center space-x-1
                bg-linear-to-r from-purple-600 to-pink-600 text-white
              rounded-lg
      
                hover:from-purple-700 hover:to-pink-700 transition-all
              "
              aria-label="Pray Now"
            >
              <Heart className="h-3 w-3" />
              <span>Pray Now</span>
            </Button>
          )}
          {status === "in-progress" && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFulfillRequest(id);
              }}
              className="
                flex items-center space-x-1
                bg-linear-to-r from-blue-600 to-purple-600 text-white
               rounded-lg
              
                hover:from-blue-700 hover:to-purple-700
              "
              aria-label="Fulfill Request"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Fulfill</span>
            </Button>
          )}
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(request);
            }}
            className="
              flex items-center space-x-1
              bg-white border border-gray-200 text-gray-700
               rounded-lg px-3 py-2
              text-xs sm:text-sm font-medium
              hover:bg-gray-50 shadow-sm
            "
            aria-label="View Details"
          >
            <Eye className="h-3 w-3" />
            <span>View Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
