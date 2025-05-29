/**
 * TripStats Component
 * 
 * A component that displays key statistics about a trip plan.
 * Features include:
 * - Start and end dates
 * - Trip duration
 * - Budget range
 * - Animated entrance effects
 * - Responsive grid layout
 * - Clean, card-based design
 * - Icon-based visual indicators
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarCheck, Clock, Wallet } from 'lucide-react';
import { TripPlan, OriginalRequestData } from "@/constants/planTypes";

/**
 * Animation configuration for fade-in-up effect
 */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

/**
 * Props interface for TripStats component
 * @property plan - The trip plan data
 * @property originalRequest - The original request data containing dates
 * @property formatCurrency - Function to format currency values
 */
interface TripStatsProps {
  plan: TripPlan;
  originalRequest: OriginalRequestData;
  formatCurrency: (amount: number, currency?: string) => string;
}

/**
 * TripStats Component
 * 
 * Renders a grid of cards showing key trip statistics including dates,
 * duration, and budget information with smooth animations.
 */
const TripStats: React.FC<TripStatsProps> = ({ plan, originalRequest, formatCurrency }) => {
  // Parse and format dates
  const startDate = originalRequest.startDate ? new Date(originalRequest.startDate) : null;
  const endDate = originalRequest.endDate ? new Date(originalRequest.endDate) : null;
  const formattedStartDate = startDate ? startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not specified';
  const formattedEndDate = endDate ? endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not specified';
  
  // Calculate trip duration in days
  const duration = startDate && endDate ? (Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) + 1 : plan.days.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full justify-center max-w-4xl mx-auto">
      {/* Start Date Card */}
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <Calendar className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">Start Date</h3>
        <p className="font-semibold">{formattedStartDate}</p>
      </motion.div>
      
      {/* End Date Card */}
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <CalendarCheck className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">End Date</h3>
        <p className="font-semibold">{formattedEndDate}</p>
      </motion.div>
      
      {/* Duration Card */}
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <Clock className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">Duration</h3>
        <p className="font-semibold">{duration} Days</p>
      </motion.div>
      
      {/* Budget Range Card */}
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <Wallet className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">Budget Range</h3>
        <p className="font-semibold">
          {plan.total_cost_estimate ? 
            `${formatCurrency(plan.total_cost_estimate.min)} - ${formatCurrency(plan.total_cost_estimate.max)}` : 'Not available'}
        </p>
      </motion.div>
    </div>
  );
};

export default TripStats;