'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorDisplayProps {
  errorMessage: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <Info className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Trip Data</h2>
        <p className="text-gray-600 mb-6">{errorMessage || "Could not find complete trip information."}</p>
        <button
          onClick={() => router.push("/fastplan")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-full shadow-lg transition duration-300"
        >
          Plan a New Trip
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;