/**
 * LoadingDisplay Component
 * 
 * A component that displays a loading state while the trip plan is being generated.
 * Features include:
 * - Animated spinning globe icon
 * - Gradient background
 * - Loading message
 * - Responsive design
 * - Clean typography
 * - Centered layout
 */

'use client';

import React from 'react';
import { Globe } from 'lucide-react';

/**
 * LoadingDisplay Component
 * 
 * Renders a full-screen loading state with an animated globe icon
 * and informative message about the trip plan generation process.
 */
const LoadingDisplay: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* Animated loading spinner with globe icon */}
      <div className="w-24 h-24 mb-8 relative">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="h-12 w-12 text-blue-600" />
        </div>
      </div>
      {/* Loading message */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Finalizing Your Trip</h2>
      <p className="text-gray-600 text-center max-w-md">
        Creating your personalized travel experience with all the details and cost estimates...
      </p>
    </div>
  );
};

export default LoadingDisplay;