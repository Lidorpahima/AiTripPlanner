/**
 * ActivityCard Component
 * 
 * A card component that displays individual activity information in the trip plan.
 * Features include:
 * - Activity time display
 * - Cost estimation
 * - Category icon
 * - Interactive buttons for details, chat, maps, and tickets
 * - Responsive design
 * - Hover effects
 */

import React from "react";
import { ImageIcon, MapPin, MessageSquare, Ticket } from "lucide-react";
import { Activity, PlaceDetailsData } from "@/constants/planTypes";

/**
 * Props interface for ActivityCard component
 * @property activity - The activity data to display
 * @property dayIndex - Index of the current day
 * @property activityIndex - Index of the activity in the day's list
 * @property onPlaceClick - Callback for viewing place details
 * @property onChatRequest - Callback for initiating chat about the activity
 * @property onOpenInMaps - Callback for opening location in maps
 * @property getCategoryIcon - Function to get the appropriate icon for activity category
 * @property formatCurrency - Function to format currency values
 */
interface ActivityCardProps {
  activity: Activity;
  dayIndex: number;
  activityIndex: number;
  onPlaceClick: (dayIndex: number, activityIndex: number, placeName: string | null | undefined) => void;
  onChatRequest: (dayIndex: number, activityIndex: number, buttonRef: HTMLButtonElement) => void;
  onOpenInMaps: (placeName: string | null | undefined) => void;
  getCategoryIcon: (category?: string) => React.ReactNode;
  formatCurrency: (amount: number, currency?: string) => string;
}

/**
 * ActivityCard Component
 * 
 * Renders a card displaying activity information with interactive features
 * for viewing details, suggesting alternatives, and accessing maps and tickets.
 */
const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  dayIndex,
  activityIndex,
  onPlaceClick,
  onChatRequest,
  onOpenInMaps,
  getCategoryIcon,
  formatCurrency,
}) => {
  return (
    <div className="border border-gray-100 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-200 transition-all">
      {/* Activity header with time and cost */}
      <div className="flex justify-between items-start">
        {activity.time && (
          <span className="text-blue-700 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded">
            {activity.time}
          </span>
        )}
        {activity.cost_estimate && (
          <span className="text-gray-700 text-xs font-medium">
            {formatCurrency(activity.cost_estimate.min)} - {formatCurrency(activity.cost_estimate.max)}
          </span>
        )}
      </div>

      {/* Activity content */}
      <div className="mt-2 flex">
        {/* Category icon */}
        <div className="mr-2 mt-0.5">
          {getCategoryIcon(activity.category)}
        </div>

        {/* Activity details and actions */}
        <div className="flex-grow">
          {/* Activity description */}
          <p className="text-sm text-gray-800">{activity.description}</p>

          {/* Action buttons */}
          <div className="mt-2 flex space-x-2 flex-wrap">
            {/* Place details button */}
            {activity.place_name_for_lookup && (
              <button
                onClick={() => onPlaceClick(dayIndex, activityIndex, activity.place_name_for_lookup)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 mb-1 md:mb-0"
              >
                <ImageIcon size={12} /> Details
              </button>
            )}

            {/* Chat suggestion button */}
            <button
              id={`chat-button-${dayIndex}-${activityIndex}`}
              onClick={e => onChatRequest(dayIndex, activityIndex, e.currentTarget)}
              className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1 mb-1 md:mb-0"
            >
              <MessageSquare size={12} /> Suggest Alternative
            </button>

            {/* Maps location button */}
            {activity.place_name_for_lookup && (
              <button
                onClick={() => onOpenInMaps(activity.place_name_for_lookup)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 mb-1 md:mb-0"
              >
                <MapPin size={12} /> View Location
              </button>
            )}

            {/* Ticket link */}
            {activity.ticket_url && (
              <a
                href={activity.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1 mb-1 md:mb-0"
              >
                <Ticket size={12} /> Tickets
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
