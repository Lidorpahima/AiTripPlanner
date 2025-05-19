import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';

// Define a more specific FormData part for this component
// It needs several fields for the summary
interface Step6FormData {
  mustSeeAttractions: string;
  destination: string;
  startDate: string;
  endDate: string;
  tripStyle: string[];
  budget: string;
  pace: string;
  transportationMode: string;
  // Potentially travelWith if it were part of the summary, but it's not currently
}

interface Step6FinalTouchesProps {
  formData: Step6FormData;
  isLoading: boolean; // To disable continue button during API calls
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // Allow textarea
  getTripDuration: () => number | null;
  prevStep: () => void;
  goToStepSeven: () => void; // Specific function to navigate to step 7
  fadeIn: any; // Animation variant
}

const Step6_FinalTouches: React.FC<Step6FinalTouchesProps> = ({
  formData,
  isLoading,
  handleInputChange,
  getTripDuration,
  prevStep,
  goToStepSeven, // Renamed from nextStep for clarity as it specifically goes to step 7
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        Final touches for your perfect trip
      </h2>
      
      {/* Must-see attractions */}
      <div className="mt-8">
        <label htmlFor="mustSeeAttractions" className="mb-2 block font-medium text-gray-700">
          Any must-see attractions or special requests? (optional)
        </label>
        <textarea
          id="mustSeeAttractions-step6" // Unique ID
          name="mustSeeAttractions"
          value={formData.mustSeeAttractions}
          onChange={handleInputChange} // Modified to allow textarea event
          placeholder="E.g., I want to see the Eiffel Tower, experience a local cooking class, etc."
          className="w-full rounded-lg border border-gray-300 p-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          rows={4}
        />
      </div>
      
      {/* Trip Summary */}
      <div className="mt-8 rounded-xl bg-blue-50 p-6">
        <h3 className="mb-4 text-center text-xl font-semibold text-blue-800">Trip Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✈️</span>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{formData.destination}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p className="font-medium">{formData.startDate} to {formData.endDate} ({getTripDuration()} days)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-sm text-gray-500">Trip Style</p>
              <p className="font-medium">{formData.tripStyle.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💼</span>
            <div>
              <p className="text-sm text-gray-500">Preferences</p>
              <p className="font-medium">{formData.budget} · {formData.pace} pace · {formData.transportationMode}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-15">
        <button
          type="button"
          onClick={prevStep}
          className="rounded-full border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ←   Back
        </button>
        <button
          type="button"
          onClick={goToStepSeven} // Use the specific navigation function
          disabled={isLoading}    // Disable if parent is loading
          className={`rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300
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