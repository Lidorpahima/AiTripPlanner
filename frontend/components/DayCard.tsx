/**
 * DayCard Component
 * 
 * A component that displays a single day's itinerary in the trip plan.
 * Features:
 * - Day title and cost estimate display
 * - List of activities for the day
 * - Interactive activity cards with place details
 * - Cost formatting and currency handling
 * - Integration with maps and chat functionality
 */

import React from "react";
import ActivityCard from "../app/fastplan/result/components/ActivityCard"; 
import { Coins } from "lucide-react";
import { Activity, DayPlan } from "@/constants/planTypes";

/**
 * Props interface for the DayCard component
 * @property day - The day's plan data including activities and cost estimates
 * @property dayIndex - The index of the day in the overall trip plan
 * @property formatCurrency - Function to format currency values
 * @property handlePlaceClick - Handler for place selection events
 * @property handleChatRequest - Handler for chat interaction requests
 * @property handleOpenInMaps - Handler for opening locations in maps
 * @property getCategoryIcon - Function to get the appropriate icon for activity categories
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
 * Renders a card representing a single day in the trip itinerary.
 * Includes the day's title, cost estimate, and a list of activities.
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
      {/* Day Header */}
      <div className="bg-blue-600 py-3 px-4">
        <h2 className="text-white font-bold text-lg">{day.title}</h2>
      </div>
      <div className="p-4">
        {/* Cost Estimate Section */}
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
        {/* Activities List */}
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
