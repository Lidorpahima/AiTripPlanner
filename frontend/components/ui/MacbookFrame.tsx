/**
 * Macbook Frame Component
 * 
 * A decorative component that wraps content in a MacBook-style frame.
 * Features:
 * - SVG-based MacBook frame design
 * - Responsive aspect ratio
 * - Customizable content area
 * - Realistic shadow and border effects
 * - Maintains aspect ratio across screen sizes
 */

"use client"

import React, { ReactNode } from 'react';

/**
 * Props interface for the MacbookFrame component
 * @property children - The content to be displayed inside the MacBook frame
 * @property className - Optional additional CSS classes for the container
 */
interface MacbookFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * MacbookFrame Component
 * 
 * Renders a MacBook-style frame around the provided content.
 * Uses SVG paths to create a realistic laptop frame with proper
 * proportions and styling.
 */
const MacbookFrame: React.FC<MacbookFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full aspect-[380/213] ${className}`}>
      {/* MacBook Frame SVG */}
      <svg
        width="380"
        height="213"
        viewBox="0 0 380 213"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Main Screen Frame */}
        <path 
          d="M44.5596 2.13037H334.132C338.653 2.13047 342.319 5.79621 342.319 10.3179V206.901H36.3721V10.3179C36.3721 5.79615 40.0378 2.13037 44.5596 2.13037Z" 
          fill="black" 
          stroke="#9FA2A5" 
          strokeWidth="3.27492"
        />
        {/* Base Top Edge */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M0.525391 200.142H379.475V207.969H0.525391V200.142Z" 
          fill="#D8D8D8"
        />
        {/* Base Bottom Edge */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M0.525391 207.969H379.475V207.969C379.475 210.405 377.5 212.38 375.064 212.38H4.93673C2.50041 212.38 0.525391 210.405 0.525391 207.969V207.969Z" 
          fill="#9FA2A5"
        />
        {/* Touch Bar Area */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M163.176 200.142H213.835V200.142C212.443 203.014 209.531 204.838 206.34 204.838H170.671C167.48 204.838 164.568 203.014 163.176 200.142V200.142Z" 
          fill="#9FA2A5"
        />
      </svg>
      {/* Content Container */}
      <div className="absolute inset-0">
        <div className="absolute top-[4%] left-[10.8%] right-[11%] bottom-[8%] bg-white rounded-md overflow-hidden shadow-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MacbookFrame;