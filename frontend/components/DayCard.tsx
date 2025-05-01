import React from "react";
import ActivityCard from "../app/fastplan/result/components/ActivityCard"; 
import { Coins } from "lucide-react";
import { Activity, DayPlan } from "@/constants/planTypes";

interface DayCardProps {
  day: DayPlan;
  dayIndex: number;
  formatCurrency: (amount: number, currency?: string) => string;
  handlePlaceClick: (dayIndex: number, activityIndex: number, placeName: string | null | undefined) => void;
  handleChatRequest: (dayIndex: number, activityIndex: number, buttonRef: HTMLButtonElement) => void;
  handleOpenInMaps: (placeName: string | null | undefined) => void;
  getCategoryIcon: (category?: string) => React.ReactNode;
}

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
      <div className="bg-blue-600 py-3 px-4">
        <h2 className="text-white font-bold text-lg">{day.title}</h2>
      </div>
      <div className="p-4">
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
