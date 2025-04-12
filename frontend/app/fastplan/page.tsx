// app/fastplan/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image for destination cards

// --- Interfaces --- (Keep the FormData interface)
interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  tripStyle: string[];
  interests: string[];
  pace: string;
}

// --- Options --- (Keep the options arrays)
const TRIP_STYLE_OPTIONS = ["Relaxing", "Adventurous", "Cultural", "Romantic", "Family", "Budget", "Luxury"];
const INTEREST_OPTIONS = ["Food", "History", "Art", "Nature", "Shopping", "Nightlife", "Sports", "Museums"];
const PACE_OPTIONS = ["Relaxed", "Moderate", "Intense"];

// --- Example Popular Destinations (Replace with real data/images later) ---
const POPULAR_DESTINATIONS = [
  { name: "Paris, France", image: "/images/destinations/paris.jpg" }, // Ensure these images exist in /public/images/destinations/
  { name: "Tokyo, Japan", image: "/images/destinations/tokyo.jpg" },
  { name: "Rome, Italy", image: "/images/destinations/rome.jpg" },
  { name: "Bali, Indonesia", image: "/images/destinations/bali.jpg" },
];

export default function FastPlanPage() {
  // --- State ---
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    tripStyle: [],
    interests: [],
    pace: PACE_OPTIONS[1], // Default to Moderate
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // --- Handlers ---

  // Simplified handler for destination (updates state)
  const handleDestinationChange = (value: string) => {
     setFormData(prev => ({ ...prev, destination: value }));
  };

  // Function to go to the next step
  const nextStep = () => {
    // Add validation here if needed before proceeding
    if (currentStep === 1 && !formData.destination) {
        toast.warn("Please select or enter a destination.");
        return;
    }
     if (currentStep === 2 && (!formData.startDate || !formData.endDate)) {
         toast.warn("Please select both start and end dates.");
         return;
     }
     // Add validation for end date > start date later
    setCurrentStep(prev => prev + 1);
  };

   // Function to go back (optional)
   const prevStep = () => {
     setCurrentStep(prev => prev - 1);
   };

  // Other handlers remain similar (handleInputChange, handlePaceChange, handleCheckboxChange)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handlePaceChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, pace: e.target.value }));
  };
   const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
       const { value, checked } = e.target;
       setFormData(prev => {
         const currentValues = prev[field] as string[];
         if (checked) {
           return { ...prev, [field]: [...currentValues, value] };
         } else {
           return { ...prev, [field]: currentValues.filter(item => item !== value) };
         }
       });
   };


  // --- Submit Handler (remains mostly the same, triggered at the end) ---
  const handleSubmit = async () => { // No event needed here, called directly
    setIsLoading(true);
    console.log("Final Form Data Submitted:", formData);

    // ** BACKEND INTEGRATION WILL GO HERE **
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success("Trip plan generated successfully! (Simulation)");
      // router.push(`/trips/results?id=${result.id}`);
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX Structure with Conditional Rendering ---
  return (
    <div className="container mx-auto min-h-screen px-4 py-12 md:py-20">
      {/* Progress Indicator (Optional) */}

      <div className="mx-auto max-w-xl rounded-lg bg-white p-8 shadow-xl" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' ,marginTop: '20px'}}>
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">Plan Your Trip</h1>
        {/* Step 1: Destination */}
        {currentStep === 1 && (
          <div>
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
              Where do you want to explore?
            </h2>
            {/* Popular Destinations */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-600">Popular Destinations:</h3>
              <div className="grid grid-cols-2 gap-4">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.name}
                    type="button" // Important: prevent form submission
                    onClick={() => {
                        handleDestinationChange(dest.name);
                        // Optionally go to next step immediately after selection:
                        // nextStep();
                    }}
                    className={`relative h-32 overflow-hidden rounded-lg border-2 p-2 text-left shadow transition duration-200 hover:shadow-md ${
                        formData.destination === dest.name ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <Image
                       src={dest.image}
                       alt={dest.name}
                       fill // Use fill to cover the button area
                       style={{ objectFit: 'cover' }} // Cover the area
                       className="absolute inset-0 z-0 opacity-80"
                    />
                    <span className="relative z-10 rounded bg-black/50 px-2 py-1 text-sm font-semibold text-white shadow-sm">
                       {dest.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Input */}
            <div className="mb-6">
                <label htmlFor="destinationManual" className="mb-2 block text-lg font-semibold text-gray-600">
                    Or enter manually:
                </label>
                <input
                    type="text"
                    id="destinationManual"
                    name="destination"
                    value={formData.destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    placeholder="e.g., Kyoto, Japan"
                    className="form-input w-full rounded-md border-gray-300 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

             <div className="text-center">
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.destination} // Disable if no destination
                    className="btn rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    Next: Dates →
                </button>
            </div>
          </div>
        )}

        {/* Step 2: Dates */}
        {currentStep === 2 && (
          <div>
             <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
               When are you traveling?
             </h2>
            {/* Display selected destination */}
            <p className="mb-4 text-center text-lg text-gray-600">
                Destination: <span className="font-semibold">{formData.destination}</span>
            </p>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="mb-2 block text-lg font-semibold text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full rounded-md border-gray-300 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="mb-2 block text-lg font-semibold text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full rounded-md border-gray-300 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
                 <button
                     type="button"
                     onClick={prevStep} // Go back
                     className="btn rounded-lg bg-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 shadow hover:bg-gray-400"
                 >
                     ← Back
                 </button>
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.startDate || !formData.endDate} // Disable if dates missing
                    className="btn rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    Next: Style →
                </button>
            </div>
          </div>
        )}

         {/* Step 3: Style, Interests, Pace */}
        {currentStep === 3 && (
             <div>
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    Tell us about your preferences
                </h2>
                 {/* Display selected info */}
                 <p className="mb-4 text-center text-gray-600">
                     <span className="font-semibold">{formData.destination}</span> | <span className="font-semibold">{formData.startDate} to {formData.endDate}</span>
                 </p>

                 {/* Trip Style */}
                 <div className="mb-6">
                   <label className="mb-3 block text-lg font-semibold text-gray-700">Trip Style (select multiple)</label>
                   <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                     {TRIP_STYLE_OPTIONS.map((style) => (
                       <label key={style} className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                         <input type="checkbox" name="tripStyle" value={style} checked={formData.tripStyle.includes(style)} onChange={(e) => handleCheckboxChange(e, 'tripStyle')} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"/>
                         <span className="text-md text-gray-700">{style}</span>
                       </label>
                     ))}
                   </div>
                 </div>

                 {/* Interests */}
                 <div className="mb-6">
                    <label className="mb-3 block text-lg font-semibold text-gray-700">Interests (select multiple)</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {INTEREST_OPTIONS.map((interest) => (
                        <label key={interest} className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                          <input type="checkbox" name="interests" value={interest} checked={formData.interests.includes(interest)} onChange={(e) => handleCheckboxChange(e, 'interests')} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"/>
                          <span className="text-md text-gray-700">{interest}</span>
                        </label>
                      ))}
                    </div>
                 </div>

                 {/* Pace */}
                 <div className="mb-8">
                   <label className="mb-3 block text-lg font-semibold text-gray-700">Pace</label>
                   <div className="flex flex-wrap justify-around gap-4">
                     {PACE_OPTIONS.map((pace) => (
                       <label key={pace} className="flex items-center space-x-2">
                         <input type="radio" name="pace" value={pace} checked={formData.pace === pace} onChange={handlePaceChange} required className="h-5 w-5 text-blue-600 focus:ring-blue-500"/>
                         <span className="text-md font-medium text-gray-700">{pace}</span>
                       </label>
                     ))}
                   </div>
                 </div>


                {/* Submit & Back Buttons */}
                 <div className="mt-8 flex justify-between">
                     <button
                         type="button"
                         onClick={prevStep} // Go back
                         className="btn rounded-lg bg-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 shadow hover:bg-gray-400"
                     >
                         ← Back
                     </button>
                    <button
                        type="button" // Changed from submit, calling function directly
                        onClick={handleSubmit} // Call the final submit function
                        disabled={isLoading}
                        className={`btn rounded-lg px-8 py-4 text-xl font-bold text-white shadow-lg transition duration-300 ease-in-out ${
                          isLoading
                            ? 'cursor-not-allowed bg-gray-400'
                            : 'cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        }`}
                      >
                        {isLoading ? 'Generating Your Itinerary...' : '✨ Plan My Trip! ✨'}
                    </button>
                 </div>
             </div>
        )}

      </div> {/* End Card */}
    </div> // End Container
  );
}