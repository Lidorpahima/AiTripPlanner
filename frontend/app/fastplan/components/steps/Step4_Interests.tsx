/**
 * Step4_Interests Component
 * 
 * The fourth step in the trip planning process where users select their interests
 * for activities and attractions during their trip.
 * Features include:
 * - Multi-select interest options with icons
 * - Animated transitions
 * - Responsive grid layout
 * - Interactive selection cards
 * - Form validation
 * - Navigation controls
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Form data structure specific to the interests step
 * @property interests - Array of selected interests
 */
interface Step4FormData {
  interests: string[];
}

/**
 * Option structure for interest selection items
 * @property value - The interest's value
 * @property icon - Emoji or icon representing the interest
 * @property description - Optional description for the interest
 */
interface Option {
  value: string;
  icon: string;
  description?: string;
}

/**
 * Props interface for Step4_Interests component
 * @property formData - Current form data containing selected interests
 * @property INTEREST_OPTIONS - Array of available interest options
 * @property handleCheckboxChange - Callback for interest multi-select changes
 * @property nextStep - Callback to proceed to next step
 * @property prevStep - Callback to return to previous step
 * @property fadeIn - Animation variants for fade-in effect
 */
interface Step4InterestsProps {
  formData: Step4FormData;
  INTEREST_OPTIONS: Option[];
  handleCheckboxChange: (value: string, field: 'interests') => void;
  nextStep: () => void;
  prevStep: () => void;
  fadeIn: any;
}

/**
 * Step4_Interests Component
 * 
 * Renders the interests selection step with interactive selection cards
 * and navigation controls.
 */
const Step4_Interests: React.FC<Step4InterestsProps> = ({
  formData,
  INTEREST_OPTIONS,
  handleCheckboxChange,
  nextStep,
  prevStep,
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-6">
      {/* Step title */}
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        What are you interested in exploring?
      </h2>
      
      {/* Selection instructions */}
      <p className="text-center text-gray-500">Select all that interest you</p>
      
      {/* Interest selection grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {INTEREST_OPTIONS.map((interest) => (
          <button
            key={interest.value}
            type="button"
            onClick={() => handleCheckboxChange(interest.value, 'interests')}
            className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-blue-50 ${
              formData.interests.includes(interest.value)
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200'
            }`}
          >
            <span className="mb-2 text-3xl">{interest.icon}</span>
            <span className="text-sm font-medium">{interest.value}</span>
          </button>
        ))}
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
          disabled={formData.interests.length === 0}
          className={`rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out ${
            formData.interests.length > 0
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

export default Step4_Interests; 