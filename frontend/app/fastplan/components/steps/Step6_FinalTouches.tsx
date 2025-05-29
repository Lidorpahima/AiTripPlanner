/**
 * Step6_FinalTouches Component
 * 
 * The sixth step in the trip planning process where users can add final details
 * and review their trip summary before proceeding to search mode.
 * Features include:
 * - Optional must-see attractions input
 * - Comprehensive trip summary display
 * - Animated transitions
 * - Loading state handling
 * - Navigation controls
 * - Form validation
 */

import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';

/**
 * Form data structure specific to the final touches step
 * @property mustSeeAttractions - User's must-see attractions or special requests
 * @property destination - Selected destination
 * @property startDate - Trip start date
 * @property endDate - Trip end date
 * @property tripStyle - Array of selected trip styles
 * @property budget - Selected budget level
 * @property pace - Selected trip pace
 * @property transportationMode - Selected transportation mode
 */
interface Step6FormData {
  mustSeeAttractions: string;
  destination: string;
  startDate: string;
  endDate: string;
  tripStyle: string[];
  budget: string;
  pace: string;
  transportationMode: string;
}

/**
 * Props interface for Step6_FinalTouches component
 * @property formData - Current form data containing all trip details
 * @property isLoading - Loading state to disable continue button during API calls
 * @property handleInputChange - Callback for input changes
 * @property getTripDuration - Function to calculate trip duration
 * @property prevStep - Callback to return to previous step
 * @property goToStepSeven - Callback to proceed to step 7 (search mode)
 * @property fadeIn - Animation variants for fade-in effect
 */
interface Step6FinalTouchesProps {
  formData: Step6FormData;
  isLoading: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getTripDuration: () => number | null;
  prevStep: () => void;
  goToStepSeven: () => void;
  fadeIn: any;
}

/**
 * Step6_FinalTouches Component
 * 
 * Renders the final touches step with must-see attractions input,
 * trip summary display, and navigation controls.
 */
const Step6_FinalTouches: React.FC<Step6FinalTouchesProps> = ({
  formData,
  isLoading,
  handleInputChange,
  getTripDuration,
  prevStep,
  goToStepSeven,
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-6">
      {/* Step title */}
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        Final touches for your perfect trip
      </h2>
      
      {/* Must-see attractions input */}
      <div className="mt-8">
        <label htmlFor="mustSeeAttractions" className="mb-2 block font-medium text-gray-700">
          Any must-see attractions or special requests? (optional)
        </label>
        <textarea
          id="mustSeeAttractions-step6"
          name="mustSeeAttractions"
          value={formData.mustSeeAttractions}
          onChange={handleInputChange}
          placeholder="E.g., I want to see the Eiffel Tower, experience a local cooking class, etc."
          className="w-full rounded-lg border border-gray-300 p-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
          rows={4}
        />
      </div>
      
      {/* Trip Summary section */}
      <div className="mt-8 rounded-xl bg-blue-50 p-6">
        <h3 className="mb-4 text-center text-xl font-semibold text-blue-800">Trip Summary</h3>
        <div className="space-y-3">
          {/* Destination summary */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✈️</span>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{formData.destination}</p>
            </div>
          </div>
          
          {/* Dates summary */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p className="font-medium">{formData.startDate} to {formData.endDate} ({getTripDuration()} days)</p>
            </div>
          </div>
          
          {/* Trip style summary */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-sm text-gray-500">Trip Style</p>
              <p className="font-medium">{formData.tripStyle.join(', ')}</p>
            </div>
          </div>
          
          {/* Preferences summary */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💼</span>
            <div>
              <p className="text-sm text-gray-500">Preferences</p>
              <p className="font-medium">{formData.budget} · {formData.pace} pace · {formData.transportationMode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between gap-15">
        <button
          type="button"
          onClick={prevStep}
          className="rounded-full border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 cursor-pointer"
        >
          ←   Back
        </button>
        <button
          type="button"
          onClick={goToStepSeven}
          disabled={isLoading}
          className={`rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer
            ${isLoading
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
          `}
          aria-label="Continue to search mode selection"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

export default Step6_FinalTouches; 