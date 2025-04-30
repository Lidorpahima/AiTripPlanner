'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bed, Utensils, TicketIcon, Bus, ShoppingBag, Info, Gift } from 'lucide-react';
import CostBreakdownCard from './CostBreakdownCard';
import { TripPlan, OriginalRequestData } from "@/constants/planTypes";

interface CostsTabProps {
  plan: TripPlan;
  originalRequest: OriginalRequestData;
  formatCurrency: (amount: number, currency?: string) => string;
}

const CostsTab: React.FC<CostsTabProps> = ({ plan, originalRequest, formatCurrency }) => {
  const duration = plan.days.length;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto"
    >
      {plan.total_cost_estimate && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Trip Budget Estimate</h2>
            <p className="opacity-90">
              Estimated total cost for your {duration}-day trip to {originalRequest.destination.split(',')[0]}
            </p>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold mr-2">
                {formatCurrency(plan.total_cost_estimate.min)}
              </span>
              <span className="text-xl">to</span>
              <span className="text-4xl font-bold ml-2">
                {formatCurrency(plan.total_cost_estimate.max)}
              </span>
            </div>
            <p className="text-sm mt-2 opacity-80">
              Based on a {originalRequest.budget || 'Mid-range'} budget for {duration} days
            </p>
          </div>
          
          {/* Cost Breakdown Chart */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Breakdown</h3>
            {plan.total_cost_estimate.accommodations && (
              <CostBreakdownCard
                icon={<Bed className="w-4 h-4 mr-2" />}
                label="Accommodations"
                min={plan.total_cost_estimate.accommodations.min}
                max={plan.total_cost_estimate.accommodations.max}
                formatCurrency={formatCurrency}
                colorClass="bg-blue-600"
              />
            )}
            {plan.total_cost_estimate.food && (
              <CostBreakdownCard
                icon={<Utensils className="w-4 h-4 mr-2" />}
                label="Food & Drinks"
                min={plan.total_cost_estimate.food.min}
                max={plan.total_cost_estimate.food.max}
                formatCurrency={formatCurrency}
                colorClass="bg-green-600"
              />
            )}
            {plan.total_cost_estimate.attractions && (
              <CostBreakdownCard
                icon={<TicketIcon className="w-4 h-4 mr-2" />}
                label="Attractions & Activities"
                min={plan.total_cost_estimate.attractions.min}
                max={plan.total_cost_estimate.attractions.max}
                formatCurrency={formatCurrency}
                colorClass="bg-purple-600"
              />
            )}
            {plan.total_cost_estimate.transportation && (
              <CostBreakdownCard
                icon={<Bus className="w-4 h-4 mr-2" />}
                label="Local Transportation"
                min={plan.total_cost_estimate.transportation.min}
                max={plan.total_cost_estimate.transportation.max}
                formatCurrency={formatCurrency}
                colorClass="bg-yellow-500"
              />
            )}
            {plan.total_cost_estimate.other && (
              <CostBreakdownCard
                icon={<ShoppingBag className="w-4 h-4 mr-2" />}
                label="Souvenirs & Miscellaneous"
                min={plan.total_cost_estimate.other.min}
                max={plan.total_cost_estimate.other.max}
                formatCurrency={formatCurrency}
                colorClass="bg-red-500"
              />
            )}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 flex items-center mb-2">
                <Info className="w-4 h-4 mr-2" /> About These Estimates
              </h4>
              <p className="text-sm text-blue-700">
                These estimates are based on average prices for a {originalRequest.budget || 'Mid-range'} budget in {originalRequest.destination}. 
                Actual costs may vary based on seasonality, specific venues, and personal preferences. All figures are in {plan.total_cost_estimate.currency}.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Discount Passes Section */}
      {plan.destination_info?.discount_options && plan.destination_info.discount_options.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-green-600" /> 
            Money-Saving Passes & Discounts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.destination_info.discount_options.map((option, index) => (
              <div 
                key={index}
                className="bg-white border border-green-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-semibold text-green-700 mb-1">{option.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                {option.price && (
                  <p className="text-sm font-medium">Approximate cost: {option.price}</p>
                )}
                {option.link && (
                  <a 
                    href={option.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CostsTab;