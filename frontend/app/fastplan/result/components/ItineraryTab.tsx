/**
 * ItineraryTab Component
 * 
 * A component that displays the complete trip itinerary in a grid layout.
 * Features include:
 * - Day-by-day itinerary display
 * - Animated entrance effect
 * - Responsive grid layout
 * - Interactive place information
 * - Chat integration
 * - Google Maps integration
 * - Category icons
 * - Currency formatting
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DayCard from './DayCard';
import { TripPlan } from "@/constants/planTypes";

/**
 * Props interface for ItineraryTab component
 * @property plan - The complete trip plan data
 * @property formatCurrency - Function to format currency values
 * @property handlePlaceClick - Callback for when a place is clicked
 * @property handleChatRequest - Callback for chat requests
 * @property handleOpenInMaps - Callback for opening place in Google Maps
 * @property getCategoryIcon - Function to get the icon for a category
 */
interface ItineraryTabProps {
  plan: TripPlan;
  formatCurrency: (amount: number, currency?: string) => string;
  handlePlaceClick: (dayIndex: number, activityIndex: number, placeName: string | null | undefined) => void;
  handleChatRequest: (dayIndex: number, activityIndex: number, buttonRef: HTMLButtonElement) => void;
  handleOpenInMaps: (placeName: string | null | undefined) => void;
  getCategoryIcon: (category?: string) => React.ReactNode;
}

/**
 * ItineraryTab Component
 * 
 * Renders a grid of day cards showing the complete trip itinerary
 * with a smooth fade-in animation.
 */
const ItineraryTab: React.FC<ItineraryTabProps> = ({ 
  plan, 
  formatCurrency, 
  handlePlaceClick, 
  handleChatRequest, 
  handleOpenInMaps, 
  getCategoryIcon 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Responsive grid of day cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plan.days.map((day, dayIndex) => (
          <DayCard
            key={dayIndex}
            day={day}
            dayIndex={dayIndex}
            formatCurrency={formatCurrency}
            handlePlaceClick={handlePlaceClick}
            handleChatRequest={handleChatRequest}
            handleOpenInMaps={handleOpenInMaps}
            getCategoryIcon={getCategoryIcon}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ItineraryTab;