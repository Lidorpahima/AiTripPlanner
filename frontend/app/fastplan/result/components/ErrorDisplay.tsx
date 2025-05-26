/**
 * ErrorDisplay Component
 * 
 * A component that displays error states when trip data cannot be loaded.
 * Features include:
 * - Error icon and message
 * - Gradient background
 * - Call-to-action button
 * - Responsive design
 * - Clean typography
 * - Navigation integration
 */

'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Props interface for ErrorDisplay component
 * @property errorMessage - The error message to display, or null for default message
 */
interface ErrorDisplayProps {
  errorMessage: string | null;
}

/**
 * ErrorDisplay Component
 * 
 * Renders a full-screen error state with an informative message
 * and a button to start planning a new trip.
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* Error card container */}
      <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full text-center">
        {/* Error icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <Info className="h-8 w-8 text-red-600" />
        </div>
        {/* Error message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Trip Data</h2>
        <p className="text-gray-600 mb-6">{errorMessage || "Could not find complete trip information."}</p>
        {/* Action button */}
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