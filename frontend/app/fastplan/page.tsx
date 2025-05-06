'use client';

import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Lottie from 'react-lottie'; // Import Lottie for animations
import { motion } from 'framer-motion'; // For smooth animations

// --- Interfaces ---
interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  tripStyle: string[];
  interests: string[];
  pace: string;
  budget: string;
  accommodation: string;
  localExperiences: string[];
  travelWith: string[];
  mustSeeAttractions: string;
}

// --- Options ---
const TRIP_STYLE_OPTIONS = [
  { value: "Relaxing", icon: "🏖️" },
  { value: "Adventurous", icon: "🧗‍♂️" }, 
  { value: "Cultural", icon: "🏛️" },
  { value: "Romantic", icon: "💑" },
  { value: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "Budget", icon: "💰" },
  { value: "Luxury", icon: "✨" }
];

const INTEREST_OPTIONS = [
  { value: "Food & Cuisine", icon: "🍲" },
  { value: "History & Heritage", icon: "🏺" },
  { value: "Art & Culture", icon: "🎭" },
  { value: "Nature & Outdoors", icon: "🌿" },
  { value: "Shopping", icon: "🛍️" },
  { value: "Nightlife", icon: "🥂" },
  { value: "Beaches", icon: "🏝️" },
  { value: "Photography", icon: "📸" },
  { value: "Wildlife", icon: "🦁" },
  { value: "Architecture", icon: "🏙️" }
];

const PACE_OPTIONS = [
  { value: "Relaxed", icon: "🐢", description: "Plenty of downtime between activities" },
  { value: "Moderate", icon: "🚶", description: "Balanced pace with some free time" },
  { value: "Intense", icon: "🏃‍♂️", description: "Action-packed with lots to see" }
];

const BUDGET_OPTIONS = [
  { value: "Budget", icon: "💰", description: "Economical options & local experiences" },
  { value: "Mid-range", icon: "💰💰", description: "Comfortable with occasional splurges" },
  { value: "Luxury", icon: "💰💰💰", description: "Premium experiences & accommodations" },
];

const ACCOMMODATION_OPTIONS = [
  { value: "Hostel", icon: "🛏️" },
  { value: "Budget Hotel", icon: "🏨" },
  { value: "Mid-range Hotel", icon: "🏨+" },
  { value: "Luxury Hotel", icon: "🏨✨" },
  { value: "Apartment/Airbnb", icon: "🏠" },
  { value: "Resort", icon: "🌴" },
  { value: "Local Homestay", icon: "👨‍👩‍👧" }
];

const LOCAL_EXPERIENCES = [
  { value: "Local Cuisine", icon: "🍽️" },
  { value: "Guided Tours", icon: "🧭" },
  { value: "Cultural Workshops", icon: "🧵" },
  { value: "Hidden Gems", icon: "💎" },
  { value: "Off-the-beaten-path", icon: "🗺️" },
  { value: "Local Festivals", icon: "🎭" },
  { value: "Cooking Classes", icon: "👨‍🍳" },
  { value: "Local Markets", icon: "🛒" }
];

const TRAVEL_WITH = [
  { value: "Solo", icon: "🧍" },
  { value: "Partner", icon: "💑" },
  { value: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "Friends", icon: "👯" },
  { value: "Group Tour", icon: "🧑‍🤝‍🧑" }
];

// --- Example Destinations with Real Images ---
const POPULAR_DESTINATIONS = [
  { name: "Paris, France", image: "/images/destinations/paris.jpg", emoji: "🗼" },
  { name: "Tokyo, Japan", image: "/images/destinations/tokyo.jpg", emoji: "🏯" },
  { name: "Rome, Italy", image: "/images/destinations/rome.jpg", emoji: "🏛️" },
  { name: "Bali, Indonesia", image: "/images/destinations/bali.jpg", emoji: "🌴" },
  { name: "New York, USA", image: "/images/destinations/new-york.jpg", emoji: "🗽" },
  { name: "Bangkok, Thailand", image: "/images/destinations/bangkok.jpg", emoji: "🛕" },
];

// Define step animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export default function FastPlanPage() {
  // --- State ---
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    tripStyle: [],
    interests: [],
    pace: 'Moderate',
    budget: 'Mid-range',
    accommodation: '',
    localExperiences: [],
    travelWith: [],
    mustSeeAttractions: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<'quick' | 'normal' | 'deep' | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // Auto-scroll to top when changing steps
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // --- Handlers ---
  const handleDestinationChange = (value: string) => {
    setFormData(prev => ({ ...prev, destination: value }));
    setSearchInput(value);
    setDestinationSuggestions([]);
  };

  const handleDestinationSearch = (value: string) => {
    setSearchInput(value);
    // Simulate destination suggestions (would be replaced by real API call)
    if (value.length > 2) {
      const mockSuggestions = [
        `${value} City, Country`,
        `${value} Beach, Island`,
        `${value}town, Europe`,
        `${value} Mountains, Asia`
      ];
      setDestinationSuggestions(mockSuggestions);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const nextStep = () => {
    // Validation logic based on current step
    if (currentStep === 1 && !formData.destination) {
      toast.warn("Please select or enter a destination.");
      return;
    }
    if (currentStep === 2) {
      if (!formData.startDate || !formData.endDate) {
        toast.warn("Please select both start and end dates.");
        return;
      }
      if (formData.endDate < formData.startDate) {
        setDateError("End date cannot be before start date.");
        return;
      }
      setDateError(null);
    }
    if (currentStep === 3 && formData.tripStyle.length === 0) {
      toast.warn("Please select at least one trip style.");
      return;
    }
    if (currentStep === 4 && formData.interests.length === 0) {
      toast.warn("Please select at least one interest.");
      return;
    }

    // Move to next step with animation effect
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSingleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string, field: 'tripStyle' | 'interests' | 'localExperiences' | 'travelWith') => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  // Calculate trip duration
  const getTripDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  // --- Submit Handler ---
  const handleSubmit = async () => {
    if (!searchMode) {
      toast.warn("Please select a search mode.");
      return;
    }
    setIsLoading(true);
    
    try {
      // Add brief delay to show loading animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plantrip/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ ...formData, searchMode }),
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      const result = await response.json();
      sessionStorage.setItem("fastplan_result", JSON.stringify(result));
      const originalRequest = {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        searchMode,
      };
      sessionStorage.setItem("fastplan_request", JSON.stringify(originalRequest));
      toast.success("Your perfect trip plan is ready!");
      router.push('/fastplan/result');
  
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- Progress bar calculation ---
  const progressPercentage = ((currentStep - 1) / 8) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-17 md:py-20" ref={containerRef}>
        {/* Progress bar */}
        <div className="mx-auto mb-2 max-w-3xl">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-sm font-medium text-gray-500">
            <span>Start</span>
            <span className="text-blue-600">Step {currentStep} of 8</span>
            <span>Finish</span>
          </div>
        </div>

        <motion.div 
          key={currentStep}
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}
        >
          {/* Header section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <h1 className="text-center text-3xl font-bold">AI Trip Planner</h1>
            <p className="mt-2 text-center text-lg opacity-90">Create your perfect personalized travel experience</p>
          </div>
          
          <div className="p-8">
            {/* Step 1: Destination Selection */}
            {currentStep === 1 && (
              <motion.div variants={fadeIn} className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                  Where would you like to go? {formData.destination && "✈️"}
                </h2>
                
                {/* Popular Destinations */}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 opacity-60 transition-opacity group-hover:opacity-70"></div>
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-700 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          <span className="text-4xl">{dest.emoji}</span>
                          <span className="mt-2 text-center text-lg font-medium text-white">{dest.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative mt-8">
                  <label htmlFor="destination" className="mb-2 block font-medium text-gray-700">
                    Search for any destination:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="destination"
                      value={searchInput}
                      onChange={(e) => handleDestinationSearch(e.target.value)}
                      placeholder="e.g. Barcelona, Tokyo, Cape Town..."
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-lg shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                  </div>
                  
                  {/* Destination Suggestions */}
                  {destinationSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <ul className="max-h-60 overflow-auto py-1">
                        {destinationSuggestions.map((suggestion, idx) => (
                          <li 
                            key={idx}
                            className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                            onClick={() => handleDestinationChange(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Selected destination */}
                {formData.destination && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-lg font-medium text-blue-800">
                      Selected destination: <span className="font-semibold">{formData.destination}</span>
                    </p>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={nextStep}
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
            )}

            {/* Step 2: Travel Dates */}
            {currentStep === 2 && (
              <motion.div variants={fadeIn} className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                  When will you be traveling to {formData.destination.split(',')[0]}?
                </h2>
                
                {/* Trip dates */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="startDate" className="mb-2 block text-lg font-medium text-gray-700">
                      Start Date 📅
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    
                  </div>
                  <div>
                    <label htmlFor="endDate" className="mb-2 block text-lg font-medium text-gray-700">
                      End Date 📅
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {dateError && (
                        <div className="mt-2 text-sm text-red-600">{dateError}</div>
                      )}
                  </div>
                </div>

                {/* Trip duration calculation */}
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
            )}

            {/* Step 3: Trip Style */}
            {currentStep === 3 && (
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
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <motion.div variants={fadeIn} className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                  What are you interested in exploring?
                </h2>
                
                <p className="text-center text-gray-500">Select all that interest you</p>
                
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
            )}

            {/* Step 5: Pace and Budget */}
            {currentStep === 5 && (
              <motion.div variants={fadeIn} className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                  How do you like to travel?
                </h2>
                
                {/* Trip Pace */}
                <div>
                  <h3 className="mb-3 font-medium text-gray-700">What pace do you prefer for your trip?</h3>
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
                  <h3 className="mb-3 font-medium text-gray-700">What's your budget level?</h3>
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
            )}

            {/* Step 6: Accommodation and Local Experiences */}
            {currentStep === 6 && (
              <motion.div variants={fadeIn} className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                  Let's personalize your experience
                </h2>
                
                {/* Accommodation */}
                <div>
                  <h3 className="mb-3 font-medium text-gray-700">Preferred accommodation type:</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {ACCOMMODATION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSingleSelectChange('accommodation', option.value)}
                        className={`flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all duration-200 hover:bg-blue-50 ${
                          formData.accommodation === option.value
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
                
                {/* Travel With */}
                <div className="mt-8">
                  <h3 className="mb-3 font-medium text-gray-700">Who are you traveling with?</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    {TRAVEL_WITH.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleCheckboxChange(option.value, 'travelWith')}
                        className={`flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all duration-200 hover:bg-blue-50 ${
                          formData.travelWith.includes(option.value)
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
                
                {/* Local Experiences */}
                <div className="mt-8">
                  <h3 className="mb-3 font-medium text-gray-700">What local experiences are you interested in?</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {LOCAL_EXPERIENCES.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleCheckboxChange(option.value, 'localExperiences')}
                        className={`flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all duration-200 hover:bg-blue-50 ${
                          formData.localExperiences.includes(option.value)
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
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-indigo-700"
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Final Details */}
            {currentStep === 7 && (
              <motion.div variants={fadeIn} className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                  Final touches for your perfect trip
                </h2>
                
                {/* Must-see attractions */}
                <div>
                  <label htmlFor="mustSeeAttractions" className="mb-2 block font-medium text-gray-700">
                    Any must-see attractions or special requests? (optional)
                  </label>
                  <textarea
                    id="mustSeeAttractions"
                    name="mustSeeAttractions"
                    value={formData.mustSeeAttractions}
                    onChange={handleInputChange}
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
                        <p className="text-sm text-gray-500">Budget & Pace</p>
                        <p className="font-medium">{formData.budget} · {formData.pace} pace</p>
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
                    onClick={() => setCurrentStep(8)}
                    disabled={isLoading}
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
            )}

            {/* Step 8: Search Mode */}
            {currentStep === 8 && (
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
                    onClick={handleSubmit}
                    disabled={!searchMode || isLoading}
                    className={`group relative overflow-hidden rounded-full px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300
                      ${searchMode && !isLoading
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-105'
                        : 'cursor-not-allowed bg-gray-400'}
                    `}
                    aria-label="Generate My Dream Trip"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating Your Perfect Trip...</span>
                      </span>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2 text-yellow-300 animate-pulse">✨</span>
                        <span className="relative">
                          Generate My Dream Trip
                          <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-white/50 rounded-full transform scale-x-0 transition-transform group-hover:scale-x-100 duration-300 origin-left"></span>
                        </span>
                        <span className="ml-2 text-yellow-300 animate-pulse">✨</span>
                      </div>
                    )}
                    {!isLoading && (
                      <span className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white opacity-30 group-hover:animate-shine"></span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}