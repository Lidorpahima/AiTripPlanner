"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from 'react-toastify'; // נצטרך להוסיף toast אם לא קיים
import { ChevronLeft, ChevronRight, MapPin, Star, Phone, Globe, Clock, MessageSquare, Image as ImageIcon, X, Info } from "lucide-react";
// הגדרת כתובת ה-API
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // חשוב לשמור את המפתח כאן רק אם אין דרך אחרת והוא מיועד לשימוש בצד לקוח בלבד (כמו הצגת מפה סטטית). עדיף שה-Backend יטפל ביצירת URL-ים לתמונות.

// --- Types ---
type Review = {
  author_name: string;
  rating: number;
  text: string;
  time: string;
};
type Activity = {
    time: string;
    description: string;
    place_name_for_lookup: string | null;
};
type PlaceDetailsData = {
  name: string;
  address: string | null; 
  rating?: number | null; 
  total_ratings?: number | null;
  phone?: string | null;
  website?: string | null; 
  price_level?: number | null; 
  location: { lat: number; lng: number } | null; 
  photos: string[]; 
  opening_hours: string[];
  reviews: Review[];
};

type DayPlan = {
  title: string;
  activities: Activity[];
};

type TripPlan = {
  summary: string;
  days: DayPlan[];
};

interface Props {
  plan: TripPlan;
  // onRemoveActivity?: (dayIndex: number, activityIndex: number) => void; // אפשר להחזיר אם צריך
}

// --- Helper Functions ---

// --- Component: PlaceDetailsPopup ---
interface PlaceDetailsPopupProps {
    details: PlaceDetailsData | 'loading' | 'error';
    onClose: () => void;
    placeNameQuery: string; // שם המקום כפי שחיפשנו אותו
}

const PlaceDetailsPopup: React.FC<PlaceDetailsPopupProps> = ({ details, onClose, placeNameQuery }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handlePhotoChange = (direction: 'next' | 'prev') => {
        if (typeof details !== 'object' || !details.photos || details.photos.length === 0) return;
        setCurrentPhotoIndex(prev => {
            const newIndex = direction === 'next' ? prev + 1 : prev - 1;
            if (newIndex >= details.photos.length) return 0;
            if (newIndex < 0) return details.photos.length - 1;
            return newIndex;
        });
    };

    useEffect(() => {
        // Reset photo index when details change
        setCurrentPhotoIndex(0);
    }, [details]);

    // Handle loading and error states
    if (details === 'loading') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <p className="font-semibold">Loading details for {placeNameQuery}...</p>
                    {/* Add a simple spinner */}
                    <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                    <button onClick={onClose} className="mt-4 text-sm text-gray-600 hover:text-black">Cancel</button>
                </div>
            </div>
        );
    }

    if (details === 'error') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <p className="font-semibold text-red-600">Could not load details</p>
                    <p className="text-sm text-gray-700 mb-4">Failed to fetch details for "{placeNameQuery}". The place might not be found on Google Maps or there was a network issue.</p>
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded text-sm">Close</button>
                </div>
            </div>
        );
    }

    // --- Render successful details ---
    const { name, address, rating, total_ratings, phone, website, photos, opening_hours, reviews, location } = details;
    const currentPhotoUrl = photos?.[currentPhotoIndex];
    // Map Link (using coordinates if available, otherwise address)
    const mapLink = location
        ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || name)}`;


    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-black p-1 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="overflow-y-auto p-4 flex-grow">
                    {/* Image Section */}
                    {photos && photos.length > 0 && (
                        <div className="relative mb-4 rounded-lg overflow-hidden">
                            <Image
                                // Key change forces re-render on src change, useful if URLs could be unstable
                                key={currentPhotoUrl}
                                src={currentPhotoUrl || '/placeholder-image.png'} // Provide a real placeholder
                                alt={`${name} photo ${currentPhotoIndex + 1}`}
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    console.error("Image failed to load:", currentPhotoUrl);
                                    // Optional: Try next image or show placeholder
                                    e.currentTarget.src = '/placeholder-image.png'; // Fallback image
                                }}
                                unoptimized={process.env.NODE_ENV === 'development'} // Maybe unoptimize in dev
                            />
                             {photos.length > 1 && (
                                <>
                                <button
                                    onClick={() => handlePhotoChange('prev')}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60 focus:outline-none"
                                    aria-label="Previous photo"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => handlePhotoChange('next')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60 focus:outline-none"
                                    aria-label="Next photo"
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">
                                    {currentPhotoIndex + 1} / {photos.length}
                                </div>
                                </>
                            )}
                        </div>
                    )}
                     {!photos || photos.length === 0 && (
                         <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                             <ImageIcon size={24} className="mx-auto mb-1"/>
                             No photos available.
                         </div>
                     )}


                    {/* Basic Info Section */}
                    <div className="space-y-2 text-sm mb-4">
                         {rating && total_ratings && (
                            <div className="flex items-center text-yellow-500">
                                <Star size={16} className="mr-1 fill-current" />
                                <strong>{rating.toFixed(1)}</strong>
                                <span className="text-gray-600 ml-1">({total_ratings} reviews)</span>
                            </div>
                        )}
                        {address && (
                            <div className="flex items-start">
                                <MapPin size={16} className="mr-2 mt-0.5 text-gray-600 flex-shrink-0" />
                                <span className="text-gray-800">{address}</span>
                                <a
                                    href={mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 hover:underline text-xs whitespace-nowrap"
                                    title="View on Google Maps"
                                >
                                    (View Map)
                                </a>
                            </div>
                        )}
                        {phone && (
                            <div className="flex items-center">
                                <Phone size={16} className="mr-2 text-gray-600" />
                                <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
                            </div>
                        )}
                         {website && (
                            <div className="flex items-center">
                                <Globe size={16} className="mr-2 text-gray-600" />
                                <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                    {website.replace(/^https?:\/\//, '')} {/* Remove http(s) for cleaner display */}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Opening Hours */}
                    {opening_hours && opening_hours.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-1 flex items-center"><Clock size={16} className="mr-1 text-gray-600" /> Opening Hours</h4>
                            <ul className="text-xs text-gray-700 list-disc list-inside pl-2 space-y-0.5">
                                {opening_hours.map((line, index) => <li key={index}>{line}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Reviews */}
                    {reviews && reviews.length > 0 && (
                         <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2 flex items-center"><MessageSquare size={16} className="mr-1 text-gray-600" /> Reviews</h4>
                            <div className="space-y-3">
                                {reviews.map((review, index) => (
                                    <div key={index} className="border-t pt-2 text-xs">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="font-medium text-gray-800">{review.author_name}</span>
                                            <div className="flex items-center text-yellow-500">
                                                <Star size={12} className="mr-0.5 fill-current"/> {review.rating}/5
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-1">{review.text}</p>
                                        <p className="text-gray-500 text-right text-[10px]">{review.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                     {!reviews || reviews.length === 0 && (
                         <div className="text-center text-sm text-gray-500 py-2">No reviews available.</div>
                     )}

                </div>
            </div>
        </div>
    );
};


// --- Component: TripItinerary ---
const TripItinerary: React.FC<Props> = ({ plan }) => {
    // State to hold fetched details: key is "dayIndex-activityIndex", value is details object, 'loading', or 'error'
    const [placeDetails, setPlaceDetails] = useState<Record<string, PlaceDetailsData | 'loading' | 'error'>>({});
    // State to track which popup is currently open (using the "dayIndex-activityIndex" key)
    const [activePopupKey, setActivePopupKey] = useState<string | null>(null);
    // State to store the query used for the active popup (for display in loading/error states)
    const [activePopupQuery, setActivePopupQuery] = useState<string>("");

    // --- Fetching Logic (triggered by click) ---
    const handleClosePopup = useCallback(() => {
        setActivePopupKey(null);
        setActivePopupQuery("");
    }, [setActivePopupKey, setActivePopupQuery]); // הוספנו תלויות אם משתמשים ב-ESLint hook rules

    const fetchPlaceDetails = useCallback(async (key: string, placeQuery: string) => {
      if (placeDetails[key] && placeDetails[key] !== 'error') {
          console.log(`Details for '${placeQuery}' (key: ${key}) already available or loading.`);
          setActivePopupKey(key);
          setActivePopupQuery(placeQuery);
          return;
      }
  
      console.log(`Fetching details for: "${placeQuery}" (key: ${key})`);
      setPlaceDetails(prev => ({ ...prev, [key]: 'loading' }));
      setActivePopupKey(key);
      setActivePopupQuery(placeQuery);
  
      // Construct the URL with query parameters
      const url = new URL(`${API_BASE}/api/place-details/`);
      url.searchParams.append('query', placeQuery);
  
      try {
          const response = await fetch(url.toString()); // Use fetch
  
          // Check if the response status indicates success (2xx)
          if (!response.ok) {
              // Handle specific errors like 404 (Not Found)
              if (response.status === 404) {
                  console.warn(`[fetchPlaceDetails Error] Place not found (404) for query: ${placeQuery}`);
                  toast.error(`Place details not found for "${placeQuery}" on Google Maps.`);
              } else {
                  // Handle other non-successful statuses (e.g., 500 Internal Server Error)
                  console.error(`[fetchPlaceDetails Error] HTTP error ${response.status}: ${response.statusText}`);
                  // Try to get error message from response body if backend provides one
                  let serverErrorMessage = `HTTP error ${response.status}`;
                  try {
                      const errorBody = await response.json(); // Attempt to parse error body
                      serverErrorMessage = errorBody?.error || errorBody?.message || serverErrorMessage;
                  } catch (parseError) {
                      // Ignore if error body isn't valid JSON
                  }
                  toast.error(`Failed to get details: ${serverErrorMessage}`);
              }
               // Throw an error to be caught by the catch block, ensuring state is set to 'error'
               throw new Error(`HTTP error ${response.status}`);
          }
  
          // If response is OK, parse the JSON body
          const data: PlaceDetailsData = await response.json();
  
          // Basic validation if needed (e.g., check if data has expected properties)
          if (!data || typeof data !== 'object' || !data.name) {
               console.error("[fetchPlaceDetails Error] Invalid data received from API:", data);
               throw new Error("Invalid data format received from server.");
          }
  
          // Update state with the fetched data
          setPlaceDetails(prev => ({ ...prev, [key]: data }));
  
      } catch (err) { // Catches network errors and errors thrown above
          console.error(`[fetchPlaceDetails Error] Failed for query "${placeQuery}":`, err);
          setPlaceDetails(prev => ({ ...prev, [key]: 'error' })); // Ensure state is 'error'
  
          // Check if the error is a standard Error object and show its message
          // Note: We already showed specific toasts for HTTP errors inside the try block
          if (err instanceof Error && !toast.isActive(`error-${key}`)) { // Avoid duplicate toasts if already shown
              // Check if it's the generic "Failed to fetch" which usually means network/CORS issue
              if (err.message.includes("Failed to fetch")) {
                   toast.error(`Network error. Could not connect to the server.`, { toastId: `error-${key}`});
              } else if (!err.message.startsWith("HTTP error")) {
                   // Show other generic errors unless it's the HTTP error we already handled
                   toast.error(`An unexpected error occurred: ${err.message}`, { toastId: `error-${key}`});
              }
          } else if (!toast.isActive(`error-${key}`)) {
              // Handle cases where 'err' might not be an Error instance
              toast.error('An unexpected and unknown error occurred.', { toastId: `error-${key}`});
          }
  
          // Ensure popup reflects the error state correctly if it was the active one
          if (activePopupKey === key) {
              setActivePopupQuery(placeQuery);
          }
      }
  }, [placeDetails, setActivePopupKey, setActivePopupQuery, setPlaceDetails]); // Ensure all dependencies are listed

    // --- Activity Click Handler ---
    const handleActivityClick = useCallback((dayIndex: number, activityIndex: number, placeNameLookup: string | null | undefined) => {
        // **** בדיקה אם יש שם לחיפוש ****
        if (!placeNameLookup) {
            console.log("No place name provided for lookup for this activity.");
            toast.info("Detailed information not available for this activity.", { autoClose: 2000 });
            return;
        }

        const key = `${dayIndex}-${activityIndex}`;
        setActivePopupQuery(placeNameLookup);
        fetchPlaceDetails(key, placeNameLookup);

    }, [fetchPlaceDetails, setActivePopupQuery]); 

    // --- Component Render ---
    return (
        <div className="max-w-screen-2xl mx-auto px-4 pb-20">
            {/* Header */}
            <h1 className="text-4xl font-bold text-center mt-8 sm:mt-12 md:mt-16 mb-2">🗓️ Trip Plan</h1>
            <p className="text-lg sm:text-xl text-center text-gray-700 mt-0 mb-8 sm:mb-12 max-w-4xl mx-auto px-2">
                {plan.summary}
            </p>

            {/* Itinerary Grid */}
            <div
                className="grid gap-6"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }} // Slightly wider minimum
            >
                {plan.days.map((day, dayIndex) => (
                    <div
                        key={dayIndex}
                        className="bg-white rounded-xl shadow-lg px-5 py-4 transition-shadow hover:shadow-xl duration-300 border border-gray-200 flex flex-col"
                    >
                        {/* Day Title */}
                        <h2 className="text-lg font-semibold mb-4 text-center border-b pb-2 text-indigo-800">
                            {day.title}
                        </h2>

                        {/* Activities List */}
                        <ul className="space-y-3 flex-grow">
                            {day.activities.map((activity: Activity, activityIndex: number) => { 
                                const key = `${dayIndex}-${activityIndex}`;
                                const currentDetailState = placeDetails[key];
                                // **** בדיקה אם אפשר לקבל פרטים ****
                                const canFetchDetails = !!activity.place_name_for_lookup;

                                return (
                                    <li
                                        key={key}
                                        // **** עיצוב ופונקציונליות מותנים ****
                                        className={`flex flex-col group rounded-lg p-3 transition duration-200 ease-in-out border border-gray-200 relative ${
                                            canFetchDetails
                                                ? 'cursor-pointer bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200' // סגנון לחיץ
                                                : 'bg-gray-100 opacity-80' // סגנון לא לחיץ
                                        }`}
                                        // **** קליק מותנה ****
                                        onClick={canFetchDetails ? () => handleActivityClick(dayIndex, activityIndex, activity.place_name_for_lookup) : undefined}
                                        title={canFetchDetails ? "Click for details" : "No specific location details available"}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            {/* **** שימוש ישיר ב-activity.time **** */}
                                            {activity.time && <span className="text-indigo-700 font-bold text-xs">{activity.time}</span>}
                                            <div className="ml-auto flex items-center space-x-1">
                                                {/* Loading/Error Indicator */}
                                                {currentDetailState === 'loading' && <span className="text-xs text-blue-500">Loading...</span>}
                                                {currentDetailState === 'error' && <span className="text-xs text-red-500">Details unavailable</span>}
                                                {/* **** אייקון לפריט לא לחיץ **** */}
                                                {!canFetchDetails && <Info size={12} className="text-gray-400" />}
                                            </div>
                                        </div>
                                        {/* **** שימוש ישיר ב-activity.description **** */}
                                        <span className={`text-gray-800 text-sm leading-normal ${!canFetchDetails ? 'text-gray-600' : ''}`}>
                                            {activity.description}
                                        </span>
                                        {/* **** הצגת אייקון רק אם לחיץ **** */}
                                        {canFetchDetails && (
                                            <span className="absolute top-2 right-2 text-gray-400 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ImageIcon size={14}/>
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <div className="text-center mt-12">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-full shadow-lg text-base transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                    💾 Save to My Trips
                </button>
            </div>

            {/* Render the Popup Conditionally */}
            {activePopupKey && (
                <PlaceDetailsPopup
                    details={placeDetails[activePopupKey] || 'loading'} // Pass current state
                    onClose={handleClosePopup}
                    placeNameQuery={activePopupQuery} // Pass the query used
                />
            )}

        </div>
    );
};

export default TripItinerary;