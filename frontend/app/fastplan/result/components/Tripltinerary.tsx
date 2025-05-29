/**
 * TripItinerary Component
 * 
 * The main component for displaying a complete trip itinerary.
 * Features include:
 * - Day-by-day itinerary display
 * - Place details popup with photos and information
 * - Chat integration for modifications
 * - Google Maps integration
 * - Share functionality
 * - Save trip functionality
 * - Authentication handling
 * - Responsive design
 * - Loading and error states
 */

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { toast } from 'react-toastify';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ChevronLeft, ChevronRight, MapPin, Star, Phone, Globe, Clock, MessageSquare, Image as ImageIcon, X, Info, Share2, Copy, Mail, MessageCircle } from "lucide-react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 

/**
 * Type definitions for the component
 */

/**
 * Review data structure from Google Maps API
 */
type Review = {
  author_name: string;
  rating: number;
  text: string;
  time: string;
};

/**
 * Activity data structure
 */
type Activity = {
    time: string;
    description: string;
    place_name_for_lookup: string | null;
};

/**
 * Place details data structure from Google Maps API
 */
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

/**
 * Day plan data structure
 */
type DayPlan = {
  title: string;
  activities: Activity[];
};

/**
 * Trip plan data structure
 */
type TripPlan = {
  summary: string;
  days: DayPlan[];
};

/**
 * Original request data structure
 */
interface OriginalRequestData {
    destination: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
}

/**
 * Props interface for TripItinerary component
 * @property plan - The trip plan data
 * @property originalRequestData - The original request data
 * @property onPlanNewTrip - Callback for planning a new trip
 */
interface TripItineraryProps {
    plan: TripPlan;                    
    originalRequestData: OriginalRequestData;
    onPlanNewTrip: () => void;         
}

/**
 * Props interface for PlaceDetailsPopup component
 * @property details - Place details data or loading/error state
 * @property onClose - Callback to close the popup
 * @property placeNameQuery - Name of the place being displayed
 */
interface PlaceDetailsPopupProps {
    details: PlaceDetailsData | 'loading' | 'error';
    onClose: () => void;
    placeNameQuery: string;
}

/**
 * PlaceDetailsPopup Component
 * 
 * Renders a modal dialog with detailed information about a place,
 * including photos, contact information, opening hours, and reviews.
 */
const PlaceDetailsPopup: React.FC<PlaceDetailsPopupProps> = ({ details, onClose, placeNameQuery }) => {
    // State for photo gallery navigation
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const router = useRouter();

    /**
     * Handles photo navigation in the gallery
     * @param direction - 'next' or 'prev' to indicate navigation direction
     */
    const handlePhotoChange = (direction: 'next' | 'prev') => {
        if (typeof details !== 'object' || !details.photos || details.photos.length === 0) return;
        setCurrentPhotoIndex(prev => {
            const newIndex = direction === 'next' ? prev + 1 : prev - 1;
            if (newIndex >= details.photos.length) return 0;
            if (newIndex < 0) return details.photos.length - 1;
            return newIndex;
        });
    };

    // Reset photo index when details change
    useEffect(() => {
        setCurrentPhotoIndex(0);
    }, [details]);

    // Loading state
    if (details === 'loading') {
        return (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <p className="font-semibold">Loading details for {placeNameQuery}...</p>
                    <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                    <button onClick={onClose} className="mt-4 text-sm text-gray-600 hover:text-black">Cancel</button>
                </div>
            </div>
        );
    }

    // Error state
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

    // Extract place details
    const { name, address, rating, total_ratings, phone, website, photos, opening_hours, reviews, location } = details;
    const currentPhotoUrl = photos?.[currentPhotoIndex];
    const mapLink = location
        ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || name)}`;

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col">
                        {/* Header with close button */}
                        <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                            <DialogTitle as="h3" className="text-lg font-semibold text-gray-800">{name}</DialogTitle>
                            <button onClick={onClose} className="text-gray-500 hover:text-black p-1 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable content area */}
                        <div className="overflow-y-auto p-4 flex-grow">
                            {/* Photo gallery section */}
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
                                    {/* Photo navigation controls */}
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

                            {/* No photos state */}
                            {!photos || photos.length === 0 && (
                                <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                                    <ImageIcon size={24} className="mx-auto mb-1" />
                                    No photos available.
                                </div>
                            )}

                            {/* Basic information section */}
                            <div className="space-y-2 text-sm mb-4">
                                {/* Rating display */}
                                {rating && total_ratings && (
                                    <div className="flex items-center text-yellow-500">
                                        <Star size={16} className="mr-1 fill-current" />
                                        <strong>{rating.toFixed(1)}</strong>
                                        <span className="text-gray-600 ml-1">({total_ratings} reviews)</span>
                                    </div>
                                )}
                                {/* Address with map link */}
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
                                {/* Phone number */}
                                {phone && (
                                    <div className="flex items-center">
                                        <Phone size={16} className="mr-2 text-gray-600" />
                                        <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
                                    </div>
                                )}
                                {/* Website link */}
                                {website && (
                                    <div className="flex items-center">
                                        <Globe size={16} className="mr-2 text-gray-600" />
                                        <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                            {website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Opening hours section */}
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

                            {/* Reviews section */}
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
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

/**
 * Formats the trip plan into a readable text format
 * @param plan - The trip plan to format
 * @returns Formatted text string with trip details
 */
function formatPlanText(plan: TripPlan): string {
    let text = `🗓️ Trip Plan\n`;
    text += plan.summary + "\n\n";
    plan.days.forEach((day, i) => {
        text += `Day ${i + 1}: ${day.title}\n`;
        day.activities.forEach((act: any) => {
            text += `  - ${act.time ? act.time + ' | ' : ''}${act.description}\n`;
        });
        text += "\n";
    });
    return text.trim();
}

/**
 * ChatBubble Component
 * 
 * Renders a floating chat bubble for quick modifications to the trip plan.
 */
const ChatBubble: React.FC<{
    isOpen: boolean;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    onClose: () => void;
    onSubmit: (message: string) => void;
    loading: boolean;
}> = ({ isOpen, anchorRef, onClose, onSubmit, loading }) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    /**
     * Handles clicks outside the chat bubble to close it
     */
    function handleClickOutside(event: MouseEvent) {
        if (anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
            onClose();
        }
    }

    // Add click outside listener
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div
            className={`fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <div className="p-4">
                <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about this activity..."
                    className="w-full h-20 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => {
                            if (message.trim()) {
                                onSubmit(message.trim());
                                setMessage('');
                            }
                        }}
                        disabled={loading || !message.trim()}
                        className={`px-4 py-2 rounded-lg text-white ${
                            loading || !message.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Refreshes the authentication token
 * @returns New token or null if refresh failed
 */
async function refreshAuthToken(): Promise<string | null> {
    try {
        const refresh = Cookies.get('refresh');
        if (!refresh) {
            console.error('No refresh token available');
            return null;
        }

        const response = await fetch(`${API_BASE}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': window.location.origin
            },
            credentials: 'include',
            body: JSON.stringify({ refresh })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access) {
                Cookies.remove('access');
                Cookies.remove('refresh');

                Cookies.set('access', data.access, {
                    path: '/',
                    expires: 7,
                    sameSite: 'lax'
                });
                if (data.refresh) {
                    Cookies.set('refresh', data.refresh, {
                        path: '/',
                        expires: 30,
                        sameSite: 'lax'
                    });
                }
                return data.access;
            }
        }
        return null;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
}

/**
 * TripItinerary Component
 * 
 * The main component that displays the complete trip itinerary with all its features.
 */
const TripItinerary: React.FC<TripItineraryProps> = ({ plan, originalRequestData, onPlanNewTrip }) => {
    const router = useRouter(); 
    const [localPlan, setLocalPlan] = useState<TripPlan>(plan);
    const [placeDetails, setPlaceDetails] = useState<Record<string, PlaceDetailsData | 'loading' | 'error'>>({});
    const [activePopupKey, setActivePopupKey] = useState<string | null>(null);
    const [activePopupQuery, setActivePopupQuery] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatDayIdx, setChatDayIdx] = useState<number|null>(null);
    const [chatActIdx, setChatActIdx] = useState<number|null>(null);
    const [chatAnchor, setChatAnchor] = useState<React.RefObject<HTMLButtonElement | null> | null>(null);
    const { logout } = useAuth();

    // --- Fetching Logic (triggered by click) ---
    const handleClosePopup = useCallback(() => {
        setActivePopupKey(null);
        setActivePopupQuery("");
    }, [setActivePopupKey, setActivePopupQuery]); 

    const fetchPlaceDetails = useCallback(async (key: string, placeQuery: string) => {
      if (placeDetails[key] && placeDetails[key] !== 'error') {
          // console.log(`Details for '${placeQuery}' (key: ${key}) already available or loading.`); // Removed console.log
          setActivePopupKey(key);
          setActivePopupQuery(placeQuery);
          return;
      }
  
      // console.log(`Fetching details for: "${placeQuery}" (key: ${key})`); // Removed console.log
      setPlaceDetails(prev => ({ ...prev, [key]: 'loading' }));
      setActivePopupKey(key);
      setActivePopupQuery(placeQuery);
  
      // Construct the URL with query parameters
      const url = new URL(`${API_BASE}/api/place-details/`);
      url.searchParams.append('query', placeQuery);
  
      try {
          const response = await fetch(url.toString()); 
  
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
                      const errorBody = await response.json(); 
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

            toast.info("Detailed information not available for this activity.", { autoClose: 2000 });
            return;
        }

        const key = `${dayIndex}-${activityIndex}`;
        setActivePopupQuery(placeNameLookup);
        fetchPlaceDetails(key, placeNameLookup);

    }, [fetchPlaceDetails, setActivePopupQuery]); 

    // --- Chat Submit Handler ---
    const handleChatSubmit = async (message: string) => {
        if (chatDayIdx === null || chatActIdx === null) {
            console.log("Chat day or activity index is null, chatDayIdx:", chatDayIdx, "chatActIdx:", chatActIdx);
            return;
        }
        setChatLoading(true);
        try {
            console.log("im in")
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
            console.log("response:", response);
            if (!response.ok) throw new Error('Server error');
            const data = await response.json();
            console.log("data:", data);
            if (!data || !data.activity) throw new Error('No new activity received');
            setLocalPlan(prevPlan => {
                const updatedPlan = { ...prevPlan };
                updatedPlan.days = [...prevPlan.days];
                updatedPlan.days[chatDayIdx] = { ...prevPlan.days[chatDayIdx] };
                updatedPlan.days[chatDayIdx].activities = [...prevPlan.days[chatDayIdx].activities];
                updatedPlan.days[chatDayIdx].activities[chatActIdx] = data.activity;
                console.log("Updated plan:", updatedPlan);
                sessionStorage.setItem("fastplan_result", JSON.stringify(updatedPlan));
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
            console.log("error:", e);
            toast.error(e.message || 'An error occurred');
        } finally {
            console.log("finally"); 
            setChatLoading(false);
            setChatOpen(false);
        }
    };

    const handleSaveTrip = async () => {
        const attemptSave = async (tokenToUse: string | undefined, isRetry: boolean = false) => {
            try {
                if (!tokenToUse) {
                    // If no token, try to get refresh token
                    const refresh = Cookies.get('refresh');
                    if (refresh) {
                        try {
                            const refreshRes = await fetch(`${API_BASE}/api/token/refresh/`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Origin': window.location.origin
                                },
                                credentials: 'include',
                                body: JSON.stringify({ refresh })
                            });

                            if (refreshRes.ok) {
                                const refreshData = await refreshRes.json();
                                if (refreshData.access) {
                                    // Update tokens after successful refresh
                                    Cookies.remove('access');
                                    Cookies.remove('refresh');

                                    Cookies.set('access', refreshData.access, {
                                        path: '/',
                                        expires: 7,
                                        sameSite: 'lax'
                                    });
                                    if (refreshData.refresh) {
                                        Cookies.set('refresh', refreshData.refresh, {
                                            path: '/',
                                            expires: 30,
                                            sameSite: 'lax'
                                        });
                                    }
                                    // Retry save with new token
                                    await attemptSave(refreshData.access, true);
                                    return;
                                }
                            }
                        } catch (err) {
                            console.error('Token refresh failed:', err);
                        }
                    }
                    
                    // If no refresh token or refresh failed, redirect to login
                    toast.error("Please log in to save your trip.");
                    logout();
                    router.push('/signin');
                    setIsSaving(false);
                    return;
                }

                // Get CSRF token
                const csrfResponse = await fetch(`${API_BASE}/api/csrf/`, {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (!csrfResponse.ok) {
                    toast.error("Failed to get CSRF token. Please try again.");
                    setIsSaving(false);
                    return;
                }

                setIsSaving(true);
                setSaveError(null);

                const response = await fetch(`${API_BASE}/api/trips/save/`, { 
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${tokenToUse}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        title: plan.summary,
                        destination: originalRequestData.destination,
                        plan_json: plan,
                        original_request: originalRequestData
                    })
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        if (isRetry) {
                            console.error("Token refresh failed or retried save also failed with token error."); 
                            toast.error("Session issue. Please log out and log in again.");
                            setSaveError("Session invalid. Please re-login.");
                            Cookies.remove('access');
                            Cookies.remove('refresh');
                            logout();
                            router.push('/signin');
                            return;
                        }
                        const newAccessToken = await refreshAuthToken();
                        if (newAccessToken) {
                            await attemptSave(newAccessToken, true);
                            return;
                        } else {
                            toast.error("Your session has expired. Please log in again to save your trip.");
                            setSaveError("Session expired. Please log in again.");
                            logout();
                            router.push('/signin');
                            return;
                        }
                    }
                    const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
                    throw new Error(errorData.detail || `Failed to save trip (status: ${response.status})`);
                }

                const savedTrip = await response.json();
                setIsSaved(true);
                toast.success('Trip saved successfully!');
                router.push(`/mytrips/${savedTrip.id}/live`);

            } catch (err: any) {
                console.error("Error saving trip:", err); 
                const message = err instanceof Error ? err.message : "An unknown error occurred.";
                setSaveError(`Error: ${message}`);
                toast.error(`Error: ${message}`);
            } finally {
                setIsSaving(false);
            }
        };
        
        const initialAccessToken = Cookies.get('access');
        if (!initialAccessToken && !isSaved) {
            toast.error("Please log in to save your trip.");
            logout();
            router.push('/signin');
            return;
        }
        await attemptSave(initialAccessToken);
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