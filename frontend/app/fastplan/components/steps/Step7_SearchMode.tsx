import React from 'react';
import { motion } from 'framer-motion';

// Define type for searchMode, can be moved to a shared types file later
export type SearchMode = 'quick' | 'normal' | 'deep' | null;

interface Step7SearchModeProps {
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void; // Accept null for initial or cleared state
  handleSubmit: () => void;
  prevStep: () => void;
  fadeIn: any; // Animation variant
}

const Step7_SearchMode: React.FC<Step7SearchModeProps> = ({
  searchMode,
  setSearchMode,
  handleSubmit,
  prevStep,
  fadeIn,
}) => {
  return (
    <motion.div variants={fadeIn} className="space-y-8">
      <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        Choose your itinerary search mode
      </h2>
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
        {/* Quick Search */}
        <button
          type="button"
          onClick={() => setSearchMode('quick')}
          className={`flex-1 rounded-xl border-2 p-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            searchMode === 'quick'
              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <span className="text-lg font-semibold">Quick Search</span>
          </div>
          <p className="mt-2 text-gray-600 text-sm">
            Fastest results (~30 seconds). <br />
            <span className="font-medium text-blue-700">Does not include live events for your exact dates.</span>
          </p>
        </button>

        {/* Normal Search */}
        <button
          type="button"
          onClick={() => setSearchMode('normal')}
          className={`flex-1 rounded-xl border-2 p-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
            searchMode === 'normal'
              ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔎</span>
            <span className="text-lg font-semibold">Normal Search</span>
          </div>
          <p className="mt-2 text-gray-600 text-sm">
            Most comprehensive (~1 minute). <br />
            <span className="font-medium text-purple-700">Includes live events for your selected dates.</span>
          </p>
        </button>

        {/* AI Expert Mode */}
        <button
          type="button"
          onClick={() => setSearchMode('deep')}
          className={`flex-1 rounded-xl border-2 p-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            searchMode === 'deep'
              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <span className="text-lg font-semibold">AI Expert</span>
          </div>
          <p className="mt-2 text-gray-600 text-sm">
            Get an itinerary crafted by our most advanced AI. <br />
            <span className="font-medium text-emerald-700">Includes deep personalization and expert tips.</span>
          </p>
        </button>
      </div>
      <div className="mt-8 flex justify-between gap-8">
        <button
          type="button"
          onClick={prevStep}
          className="rounded-full border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!searchMode}
          className={`group relative overflow-hidden rounded-full px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300
            ${searchMode
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-105'
              : 'cursor-not-allowed bg-gray-400'}
          `}
          aria-label="Generate Trip"
        >
          <div className="flex items-center justify-center">
            <span className="mr-2 text-yellow-300 animate-pulse">✨</span>
            <span className="relative">
              Generate Trip
              <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-white/50 rounded-full transform scale-x-0 transition-transform group-hover:scale-x-100 duration-300 origin-left"></span>
            </span>
            <span className="ml-2 text-yellow-300 animate-pulse">✨</span>
          </div>
          <span className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white opacity-30 group-hover:animate-shine"></span>
        </button>
      </div>
    </motion.div>
  );
};

export default Step7_SearchMode; 