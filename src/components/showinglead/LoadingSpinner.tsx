import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        {/* Spinner Circle */}
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>

        <p className="text-gray-600 text-sm sm:text-base dark:text-white font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
