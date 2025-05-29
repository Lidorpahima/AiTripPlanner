/**
 * ItineraryTab Component
 * 
 * A component that displays the trip itinerary in a grid layout.
 * Features include:
 * - Responsive grid layout for different screen sizes
 * - Fade-in animation on mount
 * - Day-by-day itinerary display
 * - Interactive place cards with various actions
 * - Currency formatting support
 * - Category icon display
 */

import React from "react";
import { motion } from "framer-motion";
import DayCard from "@/components/DayCard";
import { TripPlan } from "@/constants/planTypes";

/**
 * Props interface for the ItineraryTab component
 * @property plan - The complete trip plan containing daily itineraries
 * @property formatCurrency - Function to format currency values
 * @property handlePlaceClick - Callback for when a place is clicked
 * @property handleChatRequest - Callback for chat requests
 * @property handleOpenInMaps - Callback for opening places in maps
 * @property getCategoryIcon - Function to get the appropriate icon for a category
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
 * Renders a grid of DayCard components, each representing a day in the trip itinerary.
 * Includes fade-in animation and responsive grid layout that adapts to different screen sizes.
 */
const ItineraryTab: React.FC<ItineraryTabProps> = ({ plan, formatCurrency, handlePlaceClick, handleChatRequest, handleOpenInMaps, getCategoryIcon }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {/* Responsive grid layout for day cards */}
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

export default ItineraryTab;
