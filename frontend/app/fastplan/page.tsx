/**
 * FastPlan Page Component
 * 
 * A multi-step form component for creating personalized travel plans that provides:
 * - Step-by-step travel planning process
 * - Destination search with autocomplete
 * - Date selection with validation
 * - Trip style and interests selection
 * - Pace and budget preferences
 * - Transportation mode selection
 * - Travel companion selection
 * - Must-see attractions input
 * - Search mode selection
 * - Form validation at each step
 * - Loading states and error handling
 * - Responsive design with animations
 */

'use client';

import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Lottie from 'react-lottie'; 
import { motion } from 'framer-motion'; 
import LoadingDisplay from './result/components/LoadingDisplay';
import Step1_Destination from './components/steps/Step1_Destination';
import Step2_TravelDates from './components/steps/Step2_TravelDates';
import Step3_TripStyleAndTravelWith from './components/steps/Step3_TripStyleAndTravelWith';
import Step4_Interests from './components/steps/Step4_Interests';
import Step5_PaceBudgetTransport from './components/steps/Step5_PaceBudgetTransport';
import Step6_FinalTouches from './components/steps/Step6_FinalTouches';
import Step7_SearchMode, { SearchMode as Step7SearchModeType } from './components/steps/Step7_SearchMode';
import {
  TRIP_STYLE_OPTIONS,
  INTEREST_OPTIONS,
  PACE_OPTIONS,
  BUDGET_OPTIONS,
  TRANSPORTATION_MODE_OPTIONS,
  TRAVEL_WITH,
  POPULAR_DESTINATIONS,
  FormData
} from './constants'; // Import constants

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

/**
 * FastPlanPage Component
 * 
 * Main component that handles the multi-step travel planning process.
 * Manages form state, step navigation, and API interactions.
 */
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
    transportationMode: 'Walking & Public Transit',
    travelWith: '',
    mustSeeAttractions: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchInput);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<Step7SearchModeType>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Auto-scroll to top when changing steps
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 500); 

    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length > 2) { 
        try {
          const apiKey = process.env.NEXT_PUBLIC_SEARCH_KEY;
          if (!apiKey) {
            setDestinationSuggestions([]);
            return;
          }

          const url = `https://city-and-state-search-api.p.rapidapi.com/cities/search?q=${encodeURIComponent(debouncedSearchTerm)}`;
          const headers = {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "city-and-state-search-api.p.rapidapi.com"
          };
          
          const apiResponse = await fetch(url, { headers });

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({ message: `API Error: ${apiResponse.status}` }));

            if (apiResponse.status === 429) { 
              toast.warn("Too many requests for destination suggestions. Please try again in a moment.");
            } else if (apiResponse.status === 401 || apiResponse.status === 403) { 
              toast.warn("Could not fetch destination suggestions due to an authentication issue.");
            } else {
              toast.warn(`Failed to fetch destination suggestions: ${errorData.message || 'Unknown error'}`);
            }
            setDestinationSuggestions([]);
            return;
          }
          
          const data = await apiResponse.json();

          if (Array.isArray(data)) {
            const suggestions = data.map((item: any) => {
              let suggestion = item.name;
              if (item.state_name) {
                suggestion += `, ${item.state_name}`;
              }
              if (item.country_name) {
                suggestion += `, ${item.country_name}`;
              }
              return suggestion;
            }).slice(0, 10); // Limit to 10 suggestions
            setDestinationSuggestions(suggestions);
          } else {
            setDestinationSuggestions([]);
          }
        } catch (error: any) {
          console.error("Failed to fetch destination suggestions:", error);

          setDestinationSuggestions([]);
        }
      } else {
        setDestinationSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]); 

  /**
   * Handles destination input changes and updates form state
   * @param value - The selected destination value
   */
  const handleDestinationChange = (value: string) => {
    setFormData(prev => ({ ...prev, destination: value }));
    setSearchInput(value);
    setDestinationSuggestions([]);
  };

  /**
   * Handles destination search input and triggers suggestions
   * @param value - The search input value
   */
  const handleDestinationSearch = (value: string) => {
    setSearchInput(value);
  };

  /**
   * Validates and advances to the next step in the form
   * Performs validation checks based on current step
   */
  const nextStep = () => {
    if (currentStep === 1 && !formData.destination) {
      toast.warn("Please select or enter a destination.");
      return;
    }
    if (currentStep === 2) {
      if (!formData.startDate || !formData.endDate) {
        toast.warn("Please select both start and end dates.");
        return;
      }

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); // Normalize today's date to the beginning of the day

      const startDateObj = new Date(formData.startDate);
      startDateObj.setUTCHours(0, 0, 0, 0); // Normalize to UTC start of day to avoid timezone issues with comparison
      
      const endDateObj = new Date(formData.endDate);
      endDateObj.setUTCHours(0, 0, 0, 0); // Normalize to UTC start of day

      if (startDateObj < todayDate) {
        setDateError("Start date cannot be in the past.");
        toast.warn("Start date cannot be in the past.");
        return;
      }

      if (endDateObj < startDateObj) {
        setDateError("End date cannot be before start date.");
        toast.warn("End date cannot be before start date.");
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

  /**
   * Returns to the previous step in the form
   */
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  /**
   * Handles changes to form input fields
   * @param e - Change event from input elements
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles single-select field changes
   * @param field - The form field to update
   * @param value - The new value to set
   */
  const handleSingleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles checkbox field changes for trip style and interests
   * @param value - The value to toggle
   * @param field - The field to update ('tripStyle' or 'interests')
   */
  const handleCheckboxChange = (value: string, field: 'tripStyle' | 'interests') => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  /**
   * Calculates the duration of the trip in days
   * @returns The number of days between start and end dates, or null if dates are not set
   */
  const getTripDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  /**
   * Handles form submission and initiates travel plan generation
   * Validates search mode selection before proceeding
   */
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
        body: JSON.stringify({ 
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          tripStyle: formData.tripStyle,
          interests: formData.interests,
          pace: formData.pace,
          budget: formData.budget,
          transportationMode: formData.transportationMode,
          travelWith: formData.travelWith ? [formData.travelWith] : [],
          mustSeeAttractions: formData.mustSeeAttractions,
          searchMode 
        }),
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
      setIsLoading(false);
    }
  };
  
  // --- Progress bar calculation ---
  const progressPercentage = ((currentStep - 1) / 7) * 100;

  if (isLoading) {
    return <LoadingDisplay />;
  }

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
            <span className="text-blue-600">Step {currentStep} of 7</span>
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
            {/* Add responsive styles for buttons */}
            <style jsx global>{`
              button {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                min-height: 44px; /* Minimum touch target size */
              }
              @media (max-width: 640px) {
                button {
                  padding: 12px 24px; /* Larger touch target on mobile */
                }
              }
            `}</style>
            {/* Step 1: Destination Selection */}
            {currentStep === 1 && (
              <Step1_Destination
                formData={formData}
                searchInput={searchInput}
                destinationSuggestions={destinationSuggestions}
                POPULAR_DESTINATIONS={POPULAR_DESTINATIONS}
                handleDestinationChange={handleDestinationChange}
                handleDestinationSearch={handleDestinationSearch}
                nextStep={nextStep}
                fadeIn={fadeIn}
              />
            )}

            {/* Step 2: Travel Dates */}
            {currentStep === 2 && (
              <Step2_TravelDates
                formData={formData}
                today={today}
                dateError={dateError}
                handleInputChange={handleInputChange}
                getTripDuration={getTripDuration}
                nextStep={nextStep}
                prevStep={prevStep}
                fadeIn={fadeIn}
              />
            )}

            {/* Step 3: Trip Style */}
            {currentStep === 3 && (
              <Step3_TripStyleAndTravelWith
                formData={formData}
                TRIP_STYLE_OPTIONS={TRIP_STYLE_OPTIONS}
                TRAVEL_WITH={TRAVEL_WITH}
                handleCheckboxChange={handleCheckboxChange}
                handleSingleSelectChange={handleSingleSelectChange}
                nextStep={nextStep}
                prevStep={prevStep}
                fadeIn={fadeIn}
              />
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <Step4_Interests
                formData={formData}
                INTEREST_OPTIONS={INTEREST_OPTIONS}
                handleCheckboxChange={handleCheckboxChange}
                nextStep={nextStep}
                prevStep={prevStep}
                fadeIn={fadeIn}
              />
            )}

            {/* Step 5: Pace and Budget */}
            {currentStep === 5 && (
              <Step5_PaceBudgetTransport
                formData={formData}
                PACE_OPTIONS={PACE_OPTIONS}
                BUDGET_OPTIONS={BUDGET_OPTIONS}
                TRANSPORTATION_MODE_OPTIONS={TRANSPORTATION_MODE_OPTIONS}
                handleSingleSelectChange={handleSingleSelectChange}
                nextStep={nextStep}
                prevStep={prevStep}
                fadeIn={fadeIn}
              />
            )}

            {/* Step 6: Must-See (was Step 7) */}
            {currentStep === 6 && (
              <Step6_FinalTouches
                formData={formData}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                getTripDuration={getTripDuration}
                prevStep={prevStep}
                goToStepSeven={() => setCurrentStep(7)}
                fadeIn={fadeIn}
              />
            )}

            {/* Step 7: Search Mode (was step 8) */}
            {currentStep === 7 && (
              <Step7_SearchMode
                searchMode={searchMode}
                setSearchMode={setSearchMode}
                handleSubmit={handleSubmit}
                prevStep={prevStep}
                fadeIn={fadeIn}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}