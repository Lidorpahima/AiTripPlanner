/**
 * Tips Tab Component
 * 
 * Displays useful information and tips for travelers about their destination.
 * Features:
 * - Transportation options with cost ranges and app recommendations
 * - Money-saving tips and budget advice
 * - Essential destination information
 * - Emergency contact numbers
 * - Animated entrance effects
 * - Responsive grid layout
 */

import React from "react";
import { motion } from "framer-motion";
import { Navigation, DollarSign, Globe } from "lucide-react";
import { TripPlan, OriginalRequestData } from "@/constants/planTypes";

/**
 * Props interface for the TipsTab component
 * @property plan - The complete trip plan data
 * @property originalRequest - The original trip request data
 */
interface TipsTabProps {
  plan: TripPlan;
  originalRequest: OriginalRequestData;
}

/**
 * TipsTab Component
 * 
 * Renders a tab showing comprehensive travel tips and destination information,
 * including transportation options, budget tips, and essential details.
 */
const TipsTab: React.FC<TipsTabProps> = ({ plan, originalRequest }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto">
    {/* Transportation Options Section */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-blue-600" /> 
          Getting Around {plan.destination_info?.city || originalRequest.destination.split(',')[0]}
        </h3>
        <div className="space-y-4">
          {/* Transportation Options List */}
          {plan.destination_info?.transportation_options?.map((option, index) => (
            <div 
              key={index}
              className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
            >
              {/* Option Header with Cost Range */}
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-medium text-gray-800">{option.name}</h4>
                {option.cost_range && (
                  <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                    {option.cost_range}
                  </span>
                )}
              </div>
              {/* Option Description */}
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              {/* Recommended App Link */}
              {option.app_name && (
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-gray-600 mr-2">Recommended app:</span>
                  {option.app_link ? (
                    <a 
                      href={option.app_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {option.app_name}
                    </a>
                  ) : (
                    <span className="font-medium">{option.app_name}</span>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* No Transportation Info Fallback */}
          {(!plan.destination_info?.transportation_options || plan.destination_info.transportation_options.length === 0) && (
            <p className="text-gray-500 italic">Transportation information not available for this destination.</p>
          )}
        </div>
      </div>
    </div>

    {/* Budget Tips Section */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" /> 
          Money-Saving Tips
        </h3>
        {/* Budget Tips List */}
        {plan.destination_info?.budget_tips && plan.destination_info.budget_tips.length > 0 ? (
          <ul className="space-y-2">
            {plan.destination_info.budget_tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 font-bold mr-2">•</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Budget tips not available for this destination.</p>
        )}
      </div>
    </div>

    {/* Destination Information Section */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-indigo-600" /> 
          Useful Information
        </h3>
        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.destination_info && (
            <>
              {/* Basic Destination Info */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Country</h4>
                <p className="text-gray-900">{plan.destination_info.country || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">City</h4>
                <p className="text-gray-900">{plan.destination_info.city || originalRequest.destination.split(',')[0]}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Local Language</h4>
                <p className="text-gray-900">{plan.destination_info.language || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Currency</h4>
                <p className="text-gray-900">{plan.destination_info.currency || 'Not specified'}</p>
              </div>
              {/* Exchange Rate Info */}
              {plan.destination_info.exchange_rate && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Exchange Rate</h4>
                  <p className="text-gray-900">1 USD = {plan.destination_info.exchange_rate} {plan.destination_info.currency}</p>
                </div>
              )}
              {/* Emergency Contact Info */}
              {plan.destination_info.emergency_info && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Emergency Numbers</h4>
                  <div className="space-y-1">
                    {plan.destination_info.emergency_info.police && (
                      <p className="text-sm">Police: <span className="font-medium">{plan.destination_info.emergency_info.police}</span></p>
                    )}
                    {plan.destination_info.emergency_info.ambulance && (
                      <p className="text-sm">Ambulance: <span className="font-medium">{plan.destination_info.emergency_info.ambulance}</span></p>
                    )}
                    {plan.destination_info.emergency_info.tourist_police && (
                      <p className="text-sm">Tourist Police: <span className="font-medium">{plan.destination_info.emergency_info.tourist_police}</span></p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

export default TipsTab;
