import React from "react";
import { ImageIcon, MapPin, MessageSquare } from "lucide-react";
import { Activity, PlaceDetailsData } from "@/constants/planTypes";

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
      <div className="mt-2 flex">
        <div className="mr-2 mt-0.5">
        {getCategoryIcon(activity.category)}
        </div>
        <div className="flex-grow">
          <p className="text-sm text-gray-800">{activity.description}</p>
          <div className="mt-2 flex space-x-2">
            {activity.place_name_for_lookup && (
              <button
                onClick={() => onPlaceClick(dayIndex, activityIndex, activity.place_name_for_lookup)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <ImageIcon size={12} /> Details
              </button>
            )}
            <button
              id={`chat-button-${dayIndex}-${activityIndex}`}
              onClick={e => onChatRequest(dayIndex, activityIndex, e.currentTarget)}
              className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
            >
              <MessageSquare size={12} /> Suggest Alternative
            </button>
            {activity.place_name_for_lookup && (
              <button
                onClick={() => onOpenInMaps(activity.place_name_for_lookup)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <MapPin size={12} /> View Location
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
