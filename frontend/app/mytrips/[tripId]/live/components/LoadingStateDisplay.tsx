/**
 * LoadingStateDisplay Component
 * 
 * A simple loading indicator component for the live trip mode.
 * Features include:
 * - Animated loading spinner
 * - Centered layout
 * - Clear loading message
 * - Responsive design
 * - Minimal visual distraction
 */

import React from 'react';

/**
 * LoadingStateDisplay Component
 * 
 * Renders a full-screen loading state with an animated spinner and loading message.
 * Provides visual feedback while trip data is being loaded.
 */
const LoadingStateDisplay: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Animated loading spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            
            {/* Loading message */}
            <p className="text-xl text-gray-700">Loading Live Trip Mode...</p>
        </div>
    );
};

export default LoadingStateDisplay; 