"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { toast } from 'react-toastify';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ChevronLeft, ChevronRight, MapPin, Star, Phone, Globe, Clock, MessageSquare, Image as ImageIcon, X, Info, Share2, Copy, Mail, MessageCircle } from "lucide-react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 
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

interface OriginalRequestData {
    destination: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
}

interface TripItineraryProps {
    plan: TripPlan;                    
    originalRequestData: OriginalRequestData;
    onPlanNewTrip: () => void;         
  }

// --- Component: PlaceDetailsPopup ---
interface PlaceDetailsPopupProps {
    details: PlaceDetailsData | 'loading' | 'error';
    onClose: () => void;
    placeNameQuery: string;
}

const PlaceDetailsPopup: React.FC<PlaceDetailsPopupProps> = ({ details, onClose, placeNameQuery }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const router = useRouter();
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
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
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
    <Dialog open={true} onClose={onClose} className="relative z-50">
        {/* רקע כהה עם blur */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col">

            {/* Header עם Close */}
            <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                <DialogTitle as="h3" className="text-lg font-semibold text-gray-800">{name}</DialogTitle>
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
                    key={currentPhotoUrl}
                    src={currentPhotoUrl || '/images/loading.gif'}
                    alt={`${name} photo ${currentPhotoIndex + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        console.error("Image failed to load:", currentPhotoUrl);
                        e.currentTarget.src = '/images/loading.gif';
                    }}
                    unoptimized={process.env.NODE_ENV === 'development'}
                    />
                    {photos.length > 1 && (
                    <>
                        <button
                        onClick={() => handlePhotoChange('prev')}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60"
                        aria-label="Previous photo"
                        >
                        <ChevronLeft size={20} />
                        </button>
                        <button
                        onClick={() => handlePhotoChange('next')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60"
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
                    <ImageIcon size={24} className="mx-auto mb-1" />
                    No photos available.
                </div>
                )}

                {/* Basic Info */}
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
                        {website.replace(/^https?:\/\//, '')}
                    </a>
                    </div>
                )}
                </div>

                {/* Opening Hours */}
                {opening_hours && opening_hours.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-1 flex items-center">
                    <Clock size={16} className="mr-1 text-gray-600" /> Opening Hours
                    </h4>
                    <ul className="text-xs text-gray-700 list-disc list-inside pl-2 space-y-0.5">
                    {opening_hours.map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                </div>
                )}

                {/* Reviews */}
                {reviews && reviews.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <MessageSquare size={16} className="mr-1 text-gray-600" /> Reviews
                    </h4>
                    <div className="space-y-3">
                    {reviews.map((review, index) => (
                        <div key={index} className="border-t pt-2 text-xs">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-medium text-gray-800">{review.author_name}</span>
                            <div className="flex items-center text-yellow-500">
                            <Star size={12} className="mr-0.5 fill-current" /> {review.rating}/5
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
            </DialogPanel>
        </div>
        </div>
    </Dialog>
    );
};

// Function to format the itinerary text
function formatPlanText(plan: TripPlan): string {
    let text = `🗓️ Trip Plan\n`;
    text += plan.summary + "\n\n";
    plan.days.forEach((day, i) => {
        text += `Day ${i + 1}: ${day.title}\n`;
        day.activities.forEach((act, j) => {
            text += `  - ${act.time ? act.time + ' | ' : ''}${act.description}\n`;
        });
        text += "\n";
    });
    return text.trim();
}

// --- ChatBubble Component ---
const ChatBubble: React.FC<{
    isOpen: boolean;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    onClose: () => void;
    onSubmit: (message: string) => void;
    loading: boolean;
  }> = ({ isOpen, anchorRef, onClose, onSubmit, loading }) => {
    const [message, setMessage] = useState("");
    const bubbleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !anchorRef.current) return null;
    const rect = anchorRef.current.getBoundingClientRect();
    const style: React.CSSProperties = {
        position: "absolute",
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        zIndex: 1000,
        minWidth: 260,
        maxWidth: 320,
    };
    return (
        <div ref={bubbleRef} style={style} className="bg-white border shadow-lg rounded-xl p-4">
            <textarea
                className="w-full border rounded p-2 mb-2"
                rows={3}
                placeholder="What would you like to do instead?"
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={loading}
                autoFocus
            />
            <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="text-gray-600 hover:text-black text-sm">Cancel</button>
                <button
                    onClick={() => { if (message.trim()) onSubmit(message); }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    disabled={loading || !message.trim()}
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

// --- Component: TripItinerary ---
const TripItinerary: React.FC<TripItineraryProps> = ({ plan, originalRequestData, onPlanNewTrip }) => {
    const router = useRouter(); 
    const [localPlan, setLocalPlan] = useState<TripPlan>(plan);
    const [placeDetails, setPlaceDetails] = useState<Record<string, PlaceDetailsData | 'loading' | 'error'>>({});
    const [activePopupKey, setActivePopupKey] = useState<string | null>(null);
    const [activePopupQuery, setActivePopupQuery] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatDayIdx, setChatDayIdx] = useState<number|null>(null);
    const [chatActIdx, setChatActIdx] = useState<number|null>(null);
    const [chatAnchor, setChatAnchor] = useState<React.RefObject<HTMLButtonElement | null> | null>(null);


    // --- Fetching Logic (triggered by click) ---
    const handleClosePopup = useCallback(() => {
        setActivePopupKey(null);
        setActivePopupQuery("");
    }, [setActivePopupKey, setActivePopupQuery]); 

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

    // --- Chat Submit Handler ---
    const handleChatSubmit = async (message: string) => {
        if (chatDayIdx === null || chatActIdx === null) return;
        setChatLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/chat-replace-activity/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    dayIndex: chatDayIdx,
                    activityIndex: chatActIdx,
                    plan: localPlan
                })
            });
            if (!response.ok) throw new Error('Server error');
            const data = await response.json();
            if (!data || !data.activity) throw new Error('No new activity received');
            setLocalPlan(prevPlan => {
                const updatedPlan = { ...prevPlan };
                updatedPlan.days = [...prevPlan.days];
                updatedPlan.days[chatDayIdx] = { ...prevPlan.days[chatDayIdx] };
                updatedPlan.days[chatDayIdx].activities = [...prevPlan.days[chatDayIdx].activities];
                updatedPlan.days[chatDayIdx].activities[chatActIdx] = data.activity;
                return updatedPlan;
            });
            const key = `${chatDayIdx}-${chatActIdx}`;
            setPlaceDetails(prev => {
                const newDetails = { ...prev };
                delete newDetails[key];
                return newDetails;
            });
            toast.success('Activity replaced successfully!');
        } catch (e: any) {
            toast.error(e.message || 'An error occurred');
        } finally {
            setChatLoading(false);
            setChatOpen(false);
        }
    };

    const handleSaveTrip = async () => {
        const token = Cookies.get('access');
        const csrfToken = Cookies.get('csrftoken'); 
        if(!csrfToken) {
            toast.error("CSRF token not found. Please log in again.");
            return;
        }
        if (!token) {
            toast.error("Please log in to save your trip.");
            return;
        }
        if (isSaved) {
            toast.info("Trip already saved!");
            return;
        }
        setIsSaving(true);
        setSaveError(null);

        const formatDate = (date: string | Date | null | undefined): string | null => {
            if (!date) return null;
            try {
                const dateObj = new Date(date);
                if (isNaN(dateObj.getTime())) return null;
                return dateObj.toISOString().split('T')[0];
            } catch (e) { return null; }
        };

        const payload = {
            destination: originalRequestData.destination,
            start_date: formatDate(originalRequestData.startDate),
            end_date: formatDate(originalRequestData.endDate),
            plan_json: localPlan // The entire generated plan object
        };
        console.log("Saving trip with payload:", payload);
        console.log("CSRF Token:", csrfToken);

        try {
            const response = await fetch(`${API_BASE}/api/trips/save/`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRFToken': csrfToken, 
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            let data = {};
             if (response.status !== 204) { 
               try {
                   data = await response.json();
               } catch (jsonError) {
                   console.error("Could not parse JSON response even though status was not 204:", jsonError);
                   if (!response.ok) throw new Error("Server returned non-JSON error response.");
               }
             }


            if (response.ok) {
                console.log("Trip saved successfully:", data);
                toast.success('Trip saved successfully! 🎉');
                setIsSaved(true);
            } else {
                console.error("Failed to save trip - API Error:", response.status, data);
                const errorMessage = (data as any)?.detail || (data as any)?.error || `Failed to save (Status: ${response.status})`;
                setSaveError(errorMessage);
                toast.error(`Save failed: ${errorMessage}`);
            }
        } catch (err) {
            console.error("Network error saving trip:", err);
            const message = err instanceof Error ? err.message : "An unknown network error occurred.";
            setSaveError(`Network error: ${message}`);
            toast.error(`Network error: ${message}`);
        } finally {
            setIsSaving(false);
        }
    };
    // --- Component Render ---
    return (
        <div className="max-w-screen-2xl mx-auto px-4 pb-20">


            {/* Save Button */}
            <div className="text-center mt-12">
            <button
                    onClick={handleSaveTrip} 
                    disabled={isSaving || isSaved} 
                    className={`
                        text-white font-bold py-2.5 px-8 rounded-full shadow-lg text-base 
                        transition duration-150 ease-in-out 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        ${isSaving ? 'bg-gray-400 cursor-not-allowed' : ''} 
                        ${isSaved ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 cursor-default' 
                                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 hover:scale-105' 
                        }
                    `}
                >
                    {isSaving ? 'Saving...' : (isSaved ? '✓ Trip Saved' : '💾 Save to My Trips')}
                </button>
            </div>
            <div className="text-center mt-4">
                <button
                    onClick={() => {
                        router.push('/fastplan');
                    }} 
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                    Plan Another Trip
                </button>
            </div>

            {/* Render the Popup Conditionally */}
            {activePopupKey && (
                <PlaceDetailsPopup
                    details={placeDetails[activePopupKey] || 'loading'} 
                    onClose={handleClosePopup}
                    placeNameQuery={activePopupQuery} 
                />
            )}

            {chatAnchor && (
                <ChatBubble
                    isOpen={chatOpen}
                    anchorRef={chatAnchor}
                    onClose={() => setChatOpen(false)}
                    onSubmit={handleChatSubmit}
                    loading={chatLoading}
                />
            )}
        </div>
    );
};

export default TripItinerary;