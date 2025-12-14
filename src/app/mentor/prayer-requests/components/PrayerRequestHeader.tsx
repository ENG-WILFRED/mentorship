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
    <header className="bg-linear-to-br from-indigo-500/15 via-purple-500/15 to-pink-400/15 backdrop-blur-sm">
      <div
        className="
          max-w-4xl mx-auto 
          px-4 sm:px-6 lg:px-8
          py-4 sm:py-6 md:py-8
        "
      >
        {/* Title / Description */}
        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          {/* Icon */}
          <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
            <div
              className="
                bg-linear-to-r from-purple-600 to-pink-600
                p-2.5 sm:p-3 md:p-4
                rounded-full shadow-lg
              "
            >
              <Heart
                className="
                  text-white
                  h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7
                "
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2  text-white">
            Student Prayer Requests
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            A sacred space for your spiritual support. Share your prayer requests with our community and connect with mentors on your journey.
          </p>
        </div>

        {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <a
            href="/mentor/dashboard"
            className="
              bg-white/10 text-white border border-white/20
              flex items-center justify-center rounded-full font-medium
              px-6 py-4 sm:px-8
              hover:bg-white/20
              shadow-lg hover:shadow-xl transform hover:scale-105
              transition-all
            "
          >
            ← Back to Dashboard
          </a>
          <Button
            type="button"
            onClick={() => setShowModal(true)}
            className="
              bg-linear-to-r from-purple-600 to-pink-600 text-white
              flex items-center justify-center rounded-full font-medium
              px-6 py-4 sm:px-8
              hover:from-purple-700 hover:to-pink-700
              shadow-lg hover:shadow-xl transform hover:scale-105
            "
          >
            <Heart className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Share Your Prayer Request
          </Button>
        </div>
      </div>
    </header>
  );
}
