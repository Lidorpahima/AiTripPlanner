/**
 * Step3_TripStyleAndTravelWith Component
 * 
 * The third step in the trip planning process where users select their trip style and travel companions.
 * Features include:
 * - Multi-select trip style options with icons
 * - Single-select travel companion options
 * - Animated transitions
 * - Responsive grid layouts
 * - Interactive selection cards
 * - Form validation
 * - Navigation controls
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Form data structure specific to the trip style and travel companion step
 * @property tripStyle - Array of selected trip styles
 * @property travelWith - Selected travel companion option
 */
interface Step3FormData {
  tripStyle: string[];
  travelWith: string;
}

/**
 * Option structure for selection items
 * @property value - The option's value
 * @property icon - Emoji or icon representing the option
 * @property description - Optional description for the option
 */
interface Option {
  value: string;
  icon: string;
  description?: string;
}

/**
 * Props interface for Step3_TripStyleAndTravelWith component
 * @property formData - Current form data containing trip style and travel companion selections
 * @property TRIP_STYLE_OPTIONS - Array of available trip style options
 * @property TRAVEL_WITH - Array of available travel companion options
 * @property handleCheckboxChange - Callback for trip style multi-select changes
 * @property handleSingleSelectChange - Callback for travel companion single-select changes
 * @property nextStep - Callback to proceed to next step
 * @property prevStep - Callback to return to previous step
 * @property fadeIn - Animation variants for fade-in effect
 */
interface Step3TripStyleAndTravelWithProps {
  formData: Step3FormData;
  TRIP_STYLE_OPTIONS: Option[];
  TRAVEL_WITH: Option[];
  handleCheckboxChange: (value: string, field: 'tripStyle') => void;
  handleSingleSelectChange: (field: 'travelWith', value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  fadeIn: any;
}

/**
 * Step3_TripStyleAndTravelWith Component
 * 
 * Renders the trip style and travel companion selection step with
 * interactive selection cards and navigation controls.
 */
const Step3_TripStyleAndTravelWith: React.FC<Step3TripStyleAndTravelWithProps> = ({
  formData,
  TRIP_STYLE_OPTIONS,
  TRAVEL_WITH,
  handleCheckboxChange,
  handleSingleSelectChange,
  nextStep,
  prevStep,
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-6">
      {/* Step title */}
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        What style of trip are you looking for?
      </h2>
      
      {/* Selection instructions */}
      <p className="text-center text-gray-500">Select all that apply to you</p>
      
      {/* Trip style selection grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {TRIP_STYLE_OPTIONS.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => handleCheckboxChange(style.value, 'tripStyle')}
            className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-blue-50 ${
              formData.tripStyle.includes(style.value)
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200'
            }`}
          >
            <span className="mb-2 text-3xl">{style.icon}</span>
            <span className="text-sm font-medium">{style.value}</span>
          </button>
        ))}
      </div>

      {/* Travel companion selection section */}
      <div className="mt-8">
        <h3 className="mb-3 font-medium text-gray-700">Who are you traveling with?</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {TRAVEL_WITH.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSingleSelectChange('travelWith', option.value)}
              className={`flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all duration-200 hover:bg-blue-50 ${
                formData.travelWith === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200'
              }`}
            >
              <span className="mb-1 text-2xl">{option.icon}</span>
              <span className="text-sm font-medium">{option.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="rounded-full border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={formData.tripStyle.length === 0}
          className={`rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out ${
            formData.tripStyle.length > 0
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              : 'cursor-not-allowed bg-gray-400'
          }`}
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
};

export default Step3_TripStyleAndTravelWith; 