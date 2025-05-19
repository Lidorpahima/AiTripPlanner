import React from 'react';
import { motion } from 'framer-motion';

// Define a more specific FormData part for this component
interface Step3FormData {
  tripStyle: string[];
  travelWith: string;
}

// Define types for options arrays
interface Option {
  value: string;
  icon: string;
  description?: string; // Optional for pace, budget etc.
}

interface Step3TripStyleAndTravelWithProps {
  formData: Step3FormData;
  TRIP_STYLE_OPTIONS: Option[];
  TRAVEL_WITH: Option[];
  handleCheckboxChange: (value: string, field: 'tripStyle') => void; // field type narrowed
  handleSingleSelectChange: (field: 'travelWith', value: string) => void; // field type narrowed
  nextStep: () => void;
  prevStep: () => void;
  fadeIn: any; // Animation variant
}

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
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        What style of trip are you looking for?
      </h2>
      
      <p className="text-center text-gray-500">Select all that apply to you</p>
      
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
        {/* Travel With */}
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