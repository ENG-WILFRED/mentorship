import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative">
        {/* Spinner Circle */}
        <div className="w-16 h-16 border-4 border-solid border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        {/* Blue section of spinner */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-solid border-t-4 border-pink-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
