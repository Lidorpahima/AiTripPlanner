import React from 'react';
import { motion } from 'framer-motion';

// Define a more specific FormData part for this component
interface Step5FormData {
  pace: string;
  budget: string;
  transportationMode: string;
}

// Define types for options arrays (can be shared)
interface Option {
  value: string;
  icon: string;
  description?: string;
}

interface Step5PaceBudgetTransportProps {
  formData: Step5FormData;
  PACE_OPTIONS: Option[];
  BUDGET_OPTIONS: Option[];
  TRANSPORTATION_MODE_OPTIONS: Option[];
  handleSingleSelectChange: (field: 'pace' | 'budget' | 'transportationMode', value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  fadeIn: any; // Animation variant
}

const Step5_PaceBudgetTransport: React.FC<Step5PaceBudgetTransportProps> = ({
  formData,
  PACE_OPTIONS,
  BUDGET_OPTIONS,
  TRANSPORTATION_MODE_OPTIONS,
  handleSingleSelectChange,
  nextStep,
  prevStep,
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        How do you like to travel?
      </h2>
      
      {/* Trip Pace */}
      <div>
        <h3 className="mb-3 font-medium text-gray-700 flex items-center">
          What pace do you prefer for your trip?
          <span className="group relative ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 translate-y-full w-48 px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Knowing your preferred pace helps us balance activities and free time, ensuring a comfortable trip.
            </span>
          </span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {PACE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSingleSelectChange('pace', option.value)}
              className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-blue-50 ${
                formData.pace === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200'
              }`}
            >
              <span className="mb-2 text-3xl">{option.icon}</span>
              <span className="font-medium">{option.value}</span>
              <span className="mt-2 text-sm text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Budget */}
      <div className="mt-8">
        <h3 className="mb-3 font-medium text-gray-700 flex items-center">
          What's your budget level?
          <span className="group relative ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 translate-y-full w-56 px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Understanding your budget helps us suggest suitable accommodations, activities, and dining options.
            </span>
          </span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {BUDGET_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSingleSelectChange('budget', option.value)}
              className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-blue-50 ${
                formData.budget === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200'
              }`}
            >
              <span className="mb-2 text-3xl">{option.icon}</span>
              <span className="font-medium">{option.value}</span>
              <span className="mt-2 text-sm text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Transportation Mode */}
      <div className="mt-8">
        <h3 className="mb-3 font-medium text-gray-700 flex items-center">
          Primary mode of transportation during your trip?
          <span className="group relative ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 translate-y-full w-64 px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              This helps us suggest activities and routes that match how you plan to get around (e.g., walking tours if no car, driving routes if you have one).
            </span>
          </span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {TRANSPORTATION_MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSingleSelectChange('transportationMode', option.value)}
              className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-blue-50 ${
                formData.transportationMode === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200'
              }`}
            >
              <span className="mb-2 text-3xl">{option.icon}</span>
              <span className="font-medium text-sm">{option.value}</span>
              <span className="mt-1 text-xs text-gray-500">{option.description}</span>
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
          className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-indigo-700"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
};

export default Step5_PaceBudgetTransport; 