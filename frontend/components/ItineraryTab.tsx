import React from "react";
import { motion } from "framer-motion";
import DayCard from "@/components/DayCard";
import { TripPlan } from "@/constants/planTypes";

interface ItineraryTabProps {
  plan: TripPlan;
  formatCurrency: (amount: number, currency?: string) => string;
  handlePlaceClick: (dayIndex: number, activityIndex: number, placeName: string | null | undefined) => void;
  handleChatRequest: (dayIndex: number, activityIndex: number, buttonRef: HTMLButtonElement) => void;
  handleOpenInMaps: (placeName: string | null | undefined) => void;
  getCategoryIcon: (category?: string) => React.ReactNode;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ plan, formatCurrency, handlePlaceClick, handleChatRequest, handleOpenInMaps, getCategoryIcon }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
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
