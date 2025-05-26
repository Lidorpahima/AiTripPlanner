/**
 * DayCard Component
 * 
 * A component that displays a single day's itinerary in the trip plan.
 * Features include:
 * - Day title header
 * - Estimated cost display
 * - List of activities with details
 * - Interactive place information
 * - Chat integration
 * - Google Maps integration
 * - Category icons
 * - Currency formatting
 */

import React from "react";
import ActivityCard from "./ActivityCard"; // Corrected import path
import { Coins } from "lucide-react";
import { Activity, DayPlan } from "@/constants/planTypes";

/**
 * Props interface for DayCard component
 * @property day - The day plan data containing title and activities
 * @property dayIndex - Index of the day in the trip plan
 * @property formatCurrency - Function to format currency values
 * @property handlePlaceClick - Callback for when a place is clicked
 * @property handleChatRequest - Callback for chat requests
 * @property handleOpenInMaps - Callback for opening place in Google Maps
 * @property getCategoryIcon - Function to get the icon for a category
 */
interface DayCardProps {
  day: DayPlan;
  dayIndex: number;
  formatCurrency: (amount: number, currency?: string) => string;
  handlePlaceClick: (dayIndex: number, activityIndex: number, placeName: string | null | undefined) => void;
  handleChatRequest: (dayIndex: number, activityIndex: number, buttonRef: HTMLButtonElement) => void;
  handleOpenInMaps: (placeName: string | null | undefined) => void;
  getCategoryIcon: (category?: string) => React.ReactNode;
}

/**
 * DayCard Component
 * 
 * Renders a card containing a single day's itinerary with its activities
 * and estimated costs.
 */
const DayCard: React.FC<DayCardProps> = ({
  day,
  dayIndex,
  formatCurrency,
  handlePlaceClick,
  handleChatRequest,
  handleOpenInMaps,
  getCategoryIcon,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Day title header */}
      <div className="bg-blue-600 py-3 px-4">
        <h2 className="text-white font-bold text-lg">{day.title}</h2>
      </div>
      <div className="p-4">
        {/* Estimated cost section */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              <Coins className="h-4 w-4 mr-1" />
              Estimated Cost:
            </span>
            <span className="font-semibold text-blue-700">
              {day.day_cost_estimate ?
                `${formatCurrency(day.day_cost_estimate.min)} - ${formatCurrency(day.day_cost_estimate.max)}` :
                'Varies'}
            </span>
          </div>
        </div>
        {/* Activities list */}
        <div className="space-y-4">
          {day.activities.map((activity, activityIndex) => (
            <ActivityCard
              key={activityIndex}
              activity={activity}
              dayIndex={dayIndex}
              activityIndex={activityIndex}
              onPlaceClick={handlePlaceClick}
              onChatRequest={handleChatRequest}
              onOpenInMaps={handleOpenInMaps}
              getCategoryIcon={getCategoryIcon}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayCard;
