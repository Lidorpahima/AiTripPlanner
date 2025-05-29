/**
 * HeroSection Component
 * 
 * A component that displays the main header section of the trip plan.
 * Features include:
 * - Animated entrance effect
 * - Trip destination title
 * - Trip summary
 * - Share functionality
 * - Responsive design
 * - Clean typography
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ShareButton from './ShareButton';
import { TripPlan, OriginalRequestData } from "@/constants/planTypes";

/**
 * Animation configuration for fade-in effect
 */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

/**
 * Props interface for HeroSection component
 * @property plan - The trip plan data
 * @property originalRequest - The original request data containing destination
 */
interface HeroSectionProps {
  plan: TripPlan;
  originalRequest: OriginalRequestData;
}

/**
 * HeroSection Component
 * 
 * Renders the main header section of the trip plan with the destination
 * title, trip summary, and share button.
 */
const HeroSection: React.FC<HeroSectionProps> = ({ plan, originalRequest }) => {
  return (
    <motion.div 
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center mb-8"
    >
      {/* Title and share button container */}
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 mt-17">
          Your {plan.destination_info?.city || originalRequest.destination.split(',')[0]} Adventure
        </h1>
        {plan && <ShareButton plan={plan} />}
      </div>
      {/* Trip summary */}
      <p className="text-xl text-gray-600 max-w-3xl">
        {plan.summary}
      </p>
    </motion.div>
  );
};

export default HeroSection;