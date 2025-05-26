/**
 * Step2_TravelDates Component
 * 
 * The second step in the trip planning process where users select their travel dates.
 * Features include:
 * - Start and end date selection
 * - Date validation and error handling
 * - Trip duration calculation
 * - Animated transitions
 * - Responsive design
 * - Navigation controls
 * - Form validation
 */

import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';

/**
 * Form data structure specific to the travel dates step
 * @property destination - Selected destination for display in heading
 * @property startDate - Selected start date
 * @property endDate - Selected end date
 */
interface Step2FormData {
  destination: string;
  startDate: string;
  endDate: string;
}

/**
 * Props interface for Step2_TravelDates component
 * @property formData - Current form data containing dates
 * @property today - Today's date in YYYY-MM-DD format
 * @property dateError - Error message for date validation
 * @property handleInputChange - Callback for date input changes
 * @property getTripDuration - Function to calculate trip duration
 * @property nextStep - Callback to proceed to next step
 * @property prevStep - Callback to return to previous step
 * @property fadeIn - Animation variants for fade-in effect
 */
interface Step2TravelDatesProps {
  formData: Step2FormData;
  today: string;
  dateError: string | null;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  getTripDuration: () => number | null;
  nextStep: () => void;
  prevStep: () => void;
  fadeIn: any;
}

/**
 * Step2_TravelDates Component
 * 
 * Renders the travel dates selection step with date inputs,
 * duration display, and navigation controls.
 */
const Step2_TravelDates: React.FC<Step2TravelDatesProps> = ({
  formData,
  today,
  dateError,
  handleInputChange,
  getTripDuration,
  nextStep,
  prevStep,
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-6">
      {/* Step title with destination */}
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        When will you be traveling to {formData.destination.split(',')[0]}?
      </h2>
      
      {/* Date selection grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Start date input */}
        <div>
          <label htmlFor="startDate" className="mb-2 block text-lg font-medium text-gray-700">
            Start Date 📅
          </label>
          <input
            type="date"
            id="startDate-step2"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            min={today}
            className="w-full rounded-lg border border-gray-300 py-3 pl-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        {/* End date input */}
        <div>
          <label htmlFor="endDate" className="mb-2 block text-lg font-medium text-gray-700">
            End Date 📅
          </label>
          <input
            type="date"
            id="endDate-step2"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            min={formData.startDate || today}
            className="w-full rounded-lg border border-gray-300 py-3 pl-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {/* Date validation error message */}
          {dateError && (
              <div className="mt-2 text-sm text-red-600">{dateError}</div>
            )}
        </div>
      </div>

      {/* Trip duration display */}
      {getTripDuration() && (
        <div className="mt-4 flex items-center justify-center rounded-lg bg-indigo-50 p-4">
          <div className="flex items-center space-x-2 text-lg text-indigo-800">
            <span className="text-2xl">🗓️</span>
            <span>
              Your trip will be <strong>{getTripDuration()}</strong> {getTripDuration() === 1 ? 'day' : 'days'} long
            </span>
          </div>
        </div>
      )}

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
          disabled={!formData.startDate || !formData.endDate}
          className={`rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out ${
            formData.startDate && formData.endDate
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

export default Step2_TravelDates; 