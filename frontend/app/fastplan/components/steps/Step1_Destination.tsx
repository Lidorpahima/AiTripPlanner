/**
 * Step1_Destination Component
 * 
 * The first step in the trip planning process where users select their destination.
 * Features include:
 * - Popular destinations grid with images and emojis
 * - Search input with autocomplete suggestions
 * - Selected destination display
 * - Animated transitions
 * - Responsive design
 * - Interactive UI elements
 * - Form validation
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; // Assuming toast might be used for step-specific warnings

/**
 * Form data structure for the trip planning process
 */
interface FormData {
  destination: string;
  // other formData fields if needed directly by this component
}

/**
 * Structure for popular destination items
 */
interface PopularDestination {
  name: string;
  image: string;
  emoji: string;
}

/**
 * Props interface for Step1_Destination component
 * @property formData - Current form data containing destination
 * @property searchInput - Current search input value
 * @property destinationSuggestions - List of destination suggestions
 * @property POPULAR_DESTINATIONS - List of popular destinations with images
 * @property handleDestinationChange - Callback for destination selection
 * @property handleDestinationSearch - Callback for search input changes
 * @property nextStep - Callback to proceed to next step
 * @property fadeIn - Animation variants for fade-in effect
 */
interface Step1DestinationProps {
  formData: FormData;
  searchInput: string;
  destinationSuggestions: string[];
  POPULAR_DESTINATIONS: PopularDestination[]; // Pass as prop
  handleDestinationChange: (value: string) => void;
  handleDestinationSearch: (value: string) => void;
  nextStep: () => void;
  // Add any other props that Step 1 needs from the parent, e.g., animation variants
  fadeIn: any; // Example: pass animation variants if they are defined in parent
}

/**
 * Step1_Destination Component
 * 
 * Renders the destination selection step with popular destinations,
 * search functionality, and navigation controls.
 */
const Step1_Destination: React.FC<Step1DestinationProps> = ({
  formData,
  searchInput,
  destinationSuggestions,
  POPULAR_DESTINATIONS,
  handleDestinationChange,
  handleDestinationSearch,
  nextStep,
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-6">
      {/* Step title */}
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        Where would you like to go? {formData.destination && "✈️"}
      </h2>
      
      {/* Popular destinations grid */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-600">Popular destinations:</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              type="button"
              onClick={() => handleDestinationChange(dest.name)}
              className={`group relative h-36 overflow-hidden rounded-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg ${
                formData.destination === dest.name 
                  ? 'ring-4 ring-blue-500 ring-offset-2' 
                  : 'ring-0'
              }`}
            >
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 opacity-60 transition-opacity group-hover:opacity-70"></div>
              {/* Destination image */}
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              {/* Destination name and emoji */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <span className="text-4xl">{dest.emoji}</span>
                <span className="mt-2 text-center text-lg font-medium text-white">{dest.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search input section */}
      <div className="relative mt-8">
        <label htmlFor="destination" className="mb-2 block font-medium text-gray-700">
          Search for any destination:
        </label>
        <div className="relative">
          <input
            type="text"
            id="destination-step1" // Changed ID to avoid conflict if original input is still in parent initially
            value={searchInput} // This should be controlled by parent and passed as prop
            onChange={(e) => handleDestinationSearch(e.target.value)} // Parent handles search logic
            placeholder="e.g. Barcelona, Tokyo, Cape Town..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-lg shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
        </div>
        
        {/* Autocomplete suggestions dropdown */}
        {destinationSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            <ul className="max-h-60 overflow-auto py-1">
              {destinationSuggestions.map((suggestion, idx) => (
                <li 
                  key={idx}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                  onClick={() => handleDestinationChange(suggestion)} // Parent handles selection
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Selected destination display */}
      {formData.destination && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-center">
          <p className="text-lg font-medium text-blue-800">
            Selected destination: <span className="font-semibold">{formData.destination}</span>
          </p>
        </div>
      )}

      {/* Navigation button */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={nextStep} // Parent handles step navigation
          disabled={!formData.destination}
          className={`relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out ${
            formData.destination
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              : 'cursor-not-allowed bg-gray-400'
          }`}
        >
          <span className="relative z-10">Let's plan your trip →</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Step1_Destination; 