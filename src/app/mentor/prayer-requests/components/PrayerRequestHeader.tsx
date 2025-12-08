import { Heart } from "lucide-react";
import React from "react";
import Button from "./Button";

interface PrayerRequestHeaderProps {
  setShowModal: (show: boolean) => void;
}

export default function PrayerRequestHeader({
  setShowModal,
}: PrayerRequestHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Student Prayer Requests
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A sacred space for your spiritual support. Share your prayer
            requests with our community and connect with mentors on your
            journey.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 flex items-center rounded-full font-medium hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart className="inline h-5 w-5 mr-2" />
            Share Your Prayer Request
          </Button>
        </div>
      </div>
    </header>
  );
}
