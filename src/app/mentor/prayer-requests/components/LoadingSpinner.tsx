import React from 'react'

export default function LoadingSpinner() {
  return (
   <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin h-16 w-16 border-4 border-t-4 border-blue-600 rounded-full"></div>
   </div>
  )
}
