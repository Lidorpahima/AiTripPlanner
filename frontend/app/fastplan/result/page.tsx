'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import TripItinerary from "@/components/Tripltinerary"; 
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Clock, Coins, Star, DollarSign, Bus, Map, Calendar, CalendarCheck, Wallet, TicketIcon, Utensils, Coffee, Bed, Car, Train, Plane, Info, ShoppingBag, Gift, Navigation, Globe, ScrollText, Landmark, Share2, Copy, Mail, MessageCircle, X, ChevronLeft, ChevronRight, ImageIcon, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Dialog } from '@headlessui/react';

// Function to format the itinerary text - copied from TripItinerary
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

// --- ShareButton Component ---
const ShareButton: React.FC<{ plan: TripPlan }> = ({ plan }) => {
    const [open, setOpen] = useState(false);
    const shareText = formatPlanText(plan);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            toast.success("Itinerary copied!");
        }
        setOpen(false);
    };
    const handleWhatsapp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
        setOpen(false);
    };
    const handleEmail = () => {
        window.open(`mailto:?subject=My Trip Itinerary&body=${encodeURIComponent(shareText)}`);
        setOpen(false);
    };
    return (
        <div className="relative inline-block text-left ml-2">
            <button
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setOpen((v) => !v)}
                title="Share"
                aria-label="Share itinerary"
            >
                <Share2 size={22} className="text-blue-600" />
            </button>
            
            {open && (
                <div
                    ref={menuRef}
                    className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-fade-in"
                >
                    <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-700 text-sm flex items-center gap-2">
                        <Share2 size={16} className="text-blue-500" /> Share this itinerary
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50 text-sm transition group"
                    >
                        <Copy size={18} className="mr-3 text-gray-500 group-hover:text-blue-600" />
                        <span>Copy Itinerary</span>
                    </button>
                    <div className="border-t border-gray-100 mx-3" />
                    <button
                        onClick={handleWhatsapp}
                        className="flex items-center w-full px-4 py-3 hover:bg-green-50 text-sm transition group"
                    >
                        <MessageCircle size={18} className="mr-3 text-green-500 group-hover:text-green-700" />
                        <span className="text-green-700 group-hover:underline">Share on WhatsApp</span>
                    </button>
                    <div className="border-t border-gray-100 mx-3" />
                    <button
                        onClick={handleEmail}
                        className="flex items-center w-full px-4 py-3 hover:bg-blue-50 text-sm transition group"
                    >
                        <Mail size={18} className="mr-3 text-blue-500 group-hover:text-blue-700" />
                        <span className="text-blue-700 group-hover:underline">Send by Email</span>
                    </button>
                </div>
            )}
        </div>
    );
};

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
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col">

            {/* Header עם Close */}
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
            </div>
        </div>
        </div>
    </Dialog>
    );
};

interface OriginalRequestData {
    destination: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    tripStyle?: string[];
    budget?: string;
}

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: string;
};

interface PlaceDetailsData {
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

interface PlaceDetails {
  name: string;
  price_level?: number;
  category?: string;
  estimated_cost?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface Activity {
  time: string;
  description: string;
  place_name_for_lookup: string | null;
  place_details?: PlaceDetails;
  cost_estimate?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface DayPlan {
  title: string;
  activities: Activity[];
  day_cost_estimate?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface TripPlan {
  summary: string;
  days: DayPlan[];
  destination_info?: {
    country: string;
    city: string;
    language: string;
    currency: string;
    exchange_rate?: number;
    budget_tips?: string[];
    transportation_options?: {
      name: string;
      description: string;
      cost_range?: string;
      app_link?: string;
      app_name?: string;
    }[];
    discount_options?: {
      name: string;
      description: string;
      price?: string;
      link?: string;
    }[];
    emergency_info?: {
      police: string;
      ambulance: string;
      tourist_police?: string;
    };
  };
  total_cost_estimate?: {
    min: number;
    max: number;
    currency: string;
    accommodations?: {
      min: number;
      max: number;
    };
    food?: {
      min: number;
      max: number;
    };
    attractions?: {
      min: number;
      max: number;
    };
    transportation?: {
      min: number;
      max: number;
    };
    other?: {
      min: number;
      max: number;
    };
  };
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Helper function to format currency - always use USD
const formatCurrency = (amount: number, currency: string = 'USD') => {
  // Always use USD for consistency regardless of the passed currency parameter
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Get icon for activity category
const getCategoryIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'restaurant': 
    case 'food': return <Utensils className="w-5 h-5" />;
    case 'cafe': return <Coffee className="w-5 h-5" />;
    case 'hotel': 
    case 'accommodation': return <Bed className="w-5 h-5" />;
    case 'museum': 
    case 'attraction': return <Landmark className="w-5 h-5" />;
    case 'shopping': return <ShoppingBag className="w-5 h-5" />;
    case 'transport': return <Bus className="w-5 h-5" />;
    default: return <Star className="w-5 h-5" />;
  }
};

export default function TripResultPage() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [originalRequest, setOriginalRequest] = useState<OriginalRequestData | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null); 
  const [activeTab, setActiveTab] = useState('itinerary');
  
  // Place details state
  const [placeDetails, setPlaceDetails] = useState<Record<string, PlaceDetailsData | 'loading' | 'error'>>({});
  const [activePopupKey, setActivePopupKey] = useState<string | null>(null);
  const [activePopupQuery, setActivePopupQuery] = useState<string>("");

  // Chat state for activity replacement
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatDayIdx, setChatDayIdx] = useState<number|null>(null);
  const [chatActIdx, setChatActIdx] = useState<number|null>(null);
  const [chatAnchor, setChatAnchor] = useState<React.RefObject<HTMLButtonElement | null> | null>(null);
  
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("fastplan_result");
    const storedRequest = sessionStorage.getItem("fastplan_request");

    let parsedPlan: TripPlan | null = null;
    let parsedRequest: OriginalRequestData | null = null;
    let errorOccurred = false; 

    if (storedPlan) {
      try {
        parsedPlan = JSON.parse(storedPlan);
      } catch (err) {
        console.error("❌ Failed to parse stored plan:", err);
        setLoadingError("Failed to load trip plan data.");
        errorOccurred = true;
      }
    } else {
        setLoadingError("Trip plan data not found in storage.");
        errorOccurred = true;
    }

    if (storedRequest) {
      try {
        parsedRequest = JSON.parse(storedRequest);
      } catch (err) {
        console.error("❌ Failed to parse stored request data:", err);
        setLoadingError(prev => prev ? `${prev} & Failed to load request details.` : "Failed to load request details.");
        errorOccurred = true;
      }
    } else {
         setLoadingError(prev => prev ? `${prev} & Original request data not found.` : "Original request data not found.");
         errorOccurred = true;
    }

    if (errorOccurred) {
        toast.error(loadingError || "Could not load trip data. Redirecting...");
        // Allow a brief delay to see the error before redirecting
        setTimeout(() => {
          sessionStorage.removeItem("fastplan_result");
          sessionStorage.removeItem("fastplan_request");
          router.push("/fastplan"); 
        }, 2000);
    } else if (parsedPlan && parsedRequest) {
        // Enhance the plan data if needed
        enhancePlanWithEstimates(parsedPlan);
        setPlan(parsedPlan);
        setOriginalRequest(parsedRequest); 
        setIsLoading(false); 
    } else {
        setLoadingError("Unexpected issue loading trip data.");
        toast.error("Unexpected issue loading trip data. Redirecting...");
        // Allow a brief delay to see the error before redirecting
        setTimeout(() => {
          sessionStorage.removeItem("fastplan_result");
          sessionStorage.removeItem("fastplan_request");
          router.push("/fastplan");
        }, 2000);
    }
  }, [router]); 

  // Function to enhance plan data with cost estimates if not already present
  const enhancePlanWithEstimates = (planData: TripPlan) => {
    // This is a placeholder function that would normally interact with an API
    // In a real implementation, we'd call the backend for actual estimates
    
    // If the plan already has cost data, don't modify it
    if (planData.total_cost_estimate) return;
    
    // Add destination information if missing
    if (!planData.destination_info) {
      const destination = originalRequest?.destination?.split(',')[0] || 'the destination';
      const country = originalRequest?.destination?.split(',')[1]?.trim() || 'the country';
      
      planData.destination_info = {
        city: destination,
        country: country,
        language: 'Local language',
        currency: 'USD',
        budget_tips: [
          'Consider purchasing city passes for attractions',
          'Local street food is often affordable and authentic',
          'Public transportation can save significantly over taxis',
          'Many museums have free entry days or discounted evening hours'
        ],
        transportation_options: [
          {
            name: 'Public Transit',
            description: 'Comprehensive network covering most attractions',
            cost_range: '$1-3 per ride',
            app_name: 'Google Maps',
            app_link: 'https://maps.google.com'
          },
          {
            name: 'Rideshare',
            description: 'Convenient for direct routes',
            cost_range: '$5-15 per ride',
            app_name: 'Uber or local equivalent',
            app_link: 'https://uber.com'
          },
          {
            name: 'Rental Bikes',
            description: 'Great for scenic areas and short distances',
            cost_range: '$10-20 per day'
          }
        ],
        discount_options: [
          {
            name: 'City Tourist Card',
            description: 'Includes major attractions and public transport',
            price: '$40-80 for 3 days'
          },
          {
            name: 'Museum Pass',
            description: 'Access to multiple museums',
            price: '$25-50'
          }
        ]
      };
    }
    
    // Add total cost estimate if missing
    if (!planData.total_cost_estimate) {
      const duration = planData.days.length;
      const budgetTier = originalRequest?.budget || 'Mid-range';
      
      // Base rates depend on budget
      let dailyBase = 0;
      if (budgetTier === 'Budget') dailyBase = 50;
      else if (budgetTier === 'Mid-range') dailyBase = 150;
      else if (budgetTier === 'Luxury') dailyBase = 350;
      else dailyBase = 150; // default to mid-range
      
      planData.total_cost_estimate = {
        min: duration * dailyBase * 0.8,
        max: duration * dailyBase * 1.4,
        currency: 'USD',
        accommodations: {
          min: duration * dailyBase * 0.3,
          max: duration * dailyBase * 0.5
        },
        food: {
          min: duration * dailyBase * 0.2,
          max: duration * dailyBase * 0.3
        },
        attractions: {
          min: duration * dailyBase * 0.15,
          max: duration * dailyBase * 0.25
        },
        transportation: {
          min: duration * dailyBase * 0.1,
          max: duration * dailyBase * 0.2
        },
        other: {
          min: duration * dailyBase * 0.05,
          max: duration * dailyBase * 0.15
        }
      };
    }
    
    // Add daily cost estimates if missing
    planData.days.forEach(day => {
      if (!day.day_cost_estimate) {
        // Calculate based on number of activities and their types
        const activityCount = day.activities.length;
        const totalDailyCost = planData.total_cost_estimate!.min / planData.days.length;
        
        day.day_cost_estimate = {
          min: totalDailyCost * 0.7,
          max: totalDailyCost * 1.3,
          currency: 'USD'
        };
      }
      
      // Add cost estimates to individual activities if missing
      day.activities.forEach(activity => {
        if (!activity.cost_estimate) {
          // Estimate based on description
          const description = activity.description.toLowerCase();
          let costFactor = 1;
          
          if (description.includes('museum') || description.includes('exhibit')) {
            costFactor = 0.7;
          } else if (description.includes('dinner') || description.includes('restaurant')) {
            costFactor = 1.5;
          } else if (description.includes('tour') || description.includes('guided')) {
            costFactor = 2;
          } else if (description.includes('free') || description.includes('walk')) {
            costFactor = 0.1;
          }
          
          activity.cost_estimate = {
            min: 5 * costFactor,
            max: 25 * costFactor,
            currency: 'USD'
          };
        }
      });
    });
  };

  // Function to handle location click and fetch place details
  const handlePlaceClick = useCallback(async (dayIndex: number, activityIndex: number, placeNameLookup: string | null | undefined) => {
    // Check if there's a place name to look up
    if (!placeNameLookup) {
      console.log("No place name provided for lookup for this activity.");
      toast.info("Detailed information not available for this activity.", { autoClose: 2000 });
      return;
    }

    const key = `${dayIndex}-${activityIndex}`;
    setActivePopupQuery(placeNameLookup);
    
    // If we already have the details, just show the popup
    if (placeDetails[key] && placeDetails[key] !== 'error') {
      console.log(`Details for '${placeNameLookup}' (key: ${key}) already available or loading.`);
      setActivePopupKey(key);
      return;
    }

    console.log(`Fetching details for: "${placeNameLookup}" (key: ${key}`);
    setPlaceDetails(prev => ({ ...prev, [key]: 'loading' }));
    setActivePopupKey(key);

    // Construct the URL with query parameters
    const url = new URL(`${API_BASE}/api/place-details/`);
    url.searchParams.append('query', placeNameLookup);

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`[fetchPlaceDetails Error] Place not found (404) for query: ${placeNameLookup}`);
          toast.error(`Place details not found for "${placeNameLookup}" on Google Maps.`);
        } else {
          console.error(`[fetchPlaceDetails Error] HTTP error ${response.status}: ${response.statusText}`);
          let serverErrorMessage = `HTTP error ${response.status}`;
          try {
            const errorBody = await response.json();
            serverErrorMessage = errorBody?.error || errorBody?.message || serverErrorMessage;
          } catch (parseError) {
            // Ignore if error body isn't valid JSON
          }
          toast.error(`Failed to get details: ${serverErrorMessage}`);
        }
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: PlaceDetailsData = await response.json();

      if (!data || typeof data !== 'object' || !data.name) {
        console.error("[fetchPlaceDetails Error] Invalid data received from API:", data);
        throw new Error("Invalid data format received from server.");
      }

      setPlaceDetails(prev => ({ ...prev, [key]: data }));
    } catch (err) {
      console.error(`[fetchPlaceDetails Error] Failed for query "${placeNameLookup}":`, err);
      setPlaceDetails(prev => ({ ...prev, [key]: 'error' }));

      if (err instanceof Error && !toast.isActive(`error-${key}`)) {
        if (err.message.includes("Failed to fetch")) {
          toast.error(`Network error. Could not connect to the server.`, { toastId: `error-${key}`});
        } else if (!err.message.startsWith("HTTP error")) {
          toast.error(`An unexpected error occurred: ${err.message}`, { toastId: `error-${key}`});
        }
      } else if (!toast.isActive(`error-${key}`)) {
        toast.error('An unexpected and unknown error occurred.', { toastId: `error-${key}`});
      }
    }
  }, [placeDetails, setActivePopupKey, setActivePopupQuery, API_BASE]);

  const handleOpenInMaps = useCallback((placeNameLookup: string | null | undefined) => {
    if (!placeNameLookup) {
      console.log("No place name provided for map lookup.");
      toast.info("Location information not available for this activity.", { autoClose: 2000 });
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeNameLookup)}`;
    
    window.open(googleMapsUrl, '_blank');
  }, []);

  // Function to handle closing the place details popup
  const handleClosePopup = useCallback(() => {
    setActivePopupKey(null);
    setActivePopupQuery("");
  }, []);

  // Function to handle chat request for activity replacement
  const handleChatRequest = useCallback((dayIndex: number, activityIndex: number, buttonRef: HTMLButtonElement) => {
    setChatDayIdx(dayIndex);
    setChatActIdx(activityIndex);
    setChatAnchor({ current: buttonRef });
    setChatOpen(true);
  }, []);

  // Function to handle chat submission for activity replacement
  const handleChatSubmit = async (message: string) => {
    if (chatDayIdx === null || chatActIdx === null || !plan) return;
    
    setChatLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/chat-replace-activity/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          dayIndex: chatDayIdx,
          activityIndex: chatActIdx,
          plan: plan
        })
      });
      
      if (!response.ok) throw new Error('Server error');
      
      const data = await response.json();
      if (!data || !data.activity) throw new Error('No new activity received');
      
      // Update the plan with the new activity
      setPlan(prevPlan => {
        if (!prevPlan) return prevPlan;
        
        const updatedPlan = { ...prevPlan };
        updatedPlan.days = [...prevPlan.days];
        updatedPlan.days[chatDayIdx] = { ...prevPlan.days[chatDayIdx] };
        updatedPlan.days[chatDayIdx].activities = [...prevPlan.days[chatDayIdx].activities];
        updatedPlan.days[chatDayIdx].activities[chatActIdx] = data.activity;
        return updatedPlan;
      });
      
      // Remove any cached place details for this activity
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Finalizing Your Trip</h2>
        <p className="text-gray-600 text-center max-w-md">
          Creating your personalized travel experience with all the details and cost estimates...
        </p>
      </div>
    );
  }

  if (loadingError || !plan || !originalRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Info className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Trip Data</h2>
          <p className="text-gray-600 mb-6">{loadingError || "Could not find complete trip information."}</p>
          <button
            onClick={() => router.push("/fastplan")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-full shadow-lg transition duration-300"
          >
            Plan a New Trip
          </button>
        </div>
      </div>
    );
  }

  const startDate = originalRequest.startDate ? new Date(originalRequest.startDate) : null;
  const endDate = originalRequest.endDate ? new Date(originalRequest.endDate) : null;
  const formattedStartDate = startDate ? startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not specified';
  const formattedEndDate = endDate ? endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not specified';
  const duration = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : plan.days.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">
        {/* Hero Section */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Your {plan.destination_info?.city || originalRequest.destination.split(',')[0]} Adventure
            </h1>
            {plan && <ShareButton plan={plan} />}
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            {plan.summary}
          </p>
          
          {/* Trip Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
            >
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-500 text-sm">Start Date</h3>
              <p className="font-semibold">{formattedStartDate}</p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
            >
              <CalendarCheck className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-500 text-sm">End Date</h3>
              <p className="font-semibold">{formattedEndDate}</p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
            >
              <Clock className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-500 text-sm">Duration</h3>
              <p className="font-semibold">{duration} Days</p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
            >
              <Wallet className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-500 text-sm">Budget Range</h3>
              <p className="font-semibold">
                {plan.total_cost_estimate ? 
                  `${formatCurrency(plan.total_cost_estimate.min)} - ${formatCurrency(plan.total_cost_estimate.max)}` : 'Not available'}
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md p-1 border border-gray-200 flex">
            <button 
              className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
                activeTab === 'itinerary' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('itinerary')}
            >
              Itinerary
            </button>
            <button 
              className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
                activeTab === 'costs' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('costs')}
            >
              Cost Breakdown
            </button>
            <button 
              className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
                activeTab === 'tips' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('tips')}
            >
              Local Tips
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div className="mb-12">
          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {plan.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-blue-600 py-3 px-4">
                      <h2 className="text-white font-bold text-lg">{day.title}</h2>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center">
                            <Coins className="h-4 w-4 mr-1" />
                            Estimated Cost:
                          </span>
                          <span className="font-semibold text-blue-700">
                            {day.day_cost_estimate ? 
                              `${formatCurrency(day.day_cost_estimate.min)} - ${formatCurrency(day.day_cost_estimate.max)}` : 
                              'Varies'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {day.activities.map((activity, activityIndex) => (
                          <div 
                            key={activityIndex}
                            className="border border-gray-100 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-200 transition-all"
                          >
                            <div className="flex justify-between items-start">
                              {activity.time && (
                                <span className="text-blue-700 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded">
                                  {activity.time}
                                </span>
                              )}
                              {activity.cost_estimate && (
                                <span className="text-gray-700 text-xs font-medium">
                                  {formatCurrency(activity.cost_estimate.min)} - {formatCurrency(activity.cost_estimate.max)}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex">
                              <div className="mr-2 mt-0.5">
                                {getCategoryIcon(activity.place_details?.category)}
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm text-gray-800">{activity.description}</p>
                                <div className="mt-2 flex space-x-2">
                                  {activity.place_name_for_lookup && (
                                    <button
                                      onClick={() => handlePlaceClick(dayIndex, activityIndex, activity.place_name_for_lookup)}
                                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                    >
                                      <ImageIcon size={12} /> Details
                                    </button>
                                  )}
                                  <button
                                    id={`chat-button-${dayIndex}-${activityIndex}`}
                                    onClick={(e) => handleChatRequest(dayIndex, activityIndex, e.currentTarget)}
                                    className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
                                  >
                                    <MessageSquare size={12} /> Suggest Alternative
                                  </button>
                                  {activity.place_name_for_lookup && (
                                    <button
                                      onClick={() => handleOpenInMaps(activity.place_name_for_lookup)}
                                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                    >
                                      <MapPin size={12} /> View Location
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Cost Breakdown Tab */}
          {activeTab === 'costs' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              {plan.total_cost_estimate && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">Trip Budget Estimate</h2>
                    <p className="opacity-90">
                      Estimated total cost for your {duration}-day trip to {originalRequest.destination.split(',')[0]}
                    </p>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold mr-2">
                        {formatCurrency(plan.total_cost_estimate.min)}
                      </span>
                      <span className="text-xl">to</span>
                      <span className="text-4xl font-bold ml-2">
                        {formatCurrency(plan.total_cost_estimate.max)}
                      </span>
                    </div>
                    <p className="text-sm mt-2 opacity-80">
                      Based on a {originalRequest.budget || 'Mid-range'} budget for {duration} days
                    </p>
                  </div>
                  
                  {/* Cost Breakdown Chart */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Breakdown</h3>
                    
                    {plan.total_cost_estimate.accommodations && (
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 flex items-center">
                            <Bed className="w-4 h-4 mr-2" /> Accommodations
                          </span>
                          <span className="font-medium">
                            {formatCurrency(plan.total_cost_estimate.accommodations.min)} - {formatCurrency(plan.total_cost_estimate.accommodations.max)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${(plan.total_cost_estimate.accommodations.min + plan.total_cost_estimate.accommodations.max) / 2 / plan.total_cost_estimate.max * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {plan.total_cost_estimate.food && (
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 flex items-center">
                            <Utensils className="w-4 h-4 mr-2" /> Food & Drinks
                          </span>
                          <span className="font-medium">
                            {formatCurrency(plan.total_cost_estimate.food.min)} - {formatCurrency(plan.total_cost_estimate.food.max)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 rounded-full" 
                            style={{ width: `${(plan.total_cost_estimate.food.min + plan.total_cost_estimate.food.max) / 2 / plan.total_cost_estimate.max * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {plan.total_cost_estimate.attractions && (
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 flex items-center">
                            <TicketIcon className="w-4 h-4 mr-2" /> Attractions & Activities
                          </span>
                          <span className="font-medium">
                            {formatCurrency(plan.total_cost_estimate.attractions.min)} - {formatCurrency(plan.total_cost_estimate.attractions.max)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full" 
                            style={{ width: `${(plan.total_cost_estimate.attractions.min + plan.total_cost_estimate.attractions.max) / 2 / plan.total_cost_estimate.max * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {plan.total_cost_estimate.transportation && (
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 flex items-center">
                            <Bus className="w-4 h-4 mr-2" /> Local Transportation
                          </span>
                          <span className="font-medium">
                            {formatCurrency(plan.total_cost_estimate.transportation.min)} - {formatCurrency(plan.total_cost_estimate.transportation.max)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full" 
                            style={{ width: `${(plan.total_cost_estimate.transportation.min + plan.total_cost_estimate.transportation.max) / 2 / plan.total_cost_estimate.max * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {plan.total_cost_estimate.other && (
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 flex items-center">
                            <ShoppingBag className="w-4 h-4 mr-2" /> Souvenirs & Miscellaneous
                          </span>
                          <span className="font-medium">
                            {formatCurrency(plan.total_cost_estimate.other.min)} - {formatCurrency(plan.total_cost_estimate.other.max)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full" 
                            style={{ width: `${(plan.total_cost_estimate.other.min + plan.total_cost_estimate.other.max) / 2 / plan.total_cost_estimate.max * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 flex items-center mb-2">
                        <Info className="w-4 h-4 mr-2" /> About These Estimates
                      </h4>
                      <p className="text-sm text-blue-700">
                        These estimates are based on average prices for a {originalRequest.budget || 'Mid-range'} budget in {originalRequest.destination}. 
                        Actual costs may vary based on seasonality, specific venues, and personal preferences. All figures are in {plan.total_cost_estimate.currency}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Discount Passes Section */}
              {plan.destination_info?.discount_options && plan.destination_info.discount_options.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-green-600" /> 
                    Money-Saving Passes & Discounts
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.destination_info.discount_options.map((option, index) => (
                      <div 
                        key={index}
                        className="bg-white border border-green-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h4 className="text-lg font-semibold text-green-700 mb-1">{option.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        {option.price && (
                          <p className="text-sm font-medium">Approximate cost: {option.price}</p>
                        )}
                        {option.link && (
                          <a 
                            href={option.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                          >
                            Learn more →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Local Tips Tab */}
          {activeTab === 'tips' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              {/* Transportation Options */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-blue-600" /> 
                    Getting Around {plan.destination_info?.city || originalRequest.destination.split(',')[0]}
                  </h3>
                  
                  <div className="space-y-4">
                    {plan.destination_info?.transportation_options?.map((option, index) => (
                      <div 
                        key={index}
                        className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-medium text-gray-800">{option.name}</h4>
                          {option.cost_range && (
                            <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                              {option.cost_range}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        
                        {option.app_name && (
                          <div className="mt-2 flex items-center text-sm">
                            <span className="text-gray-600 mr-2">Recommended app:</span>
                            {option.app_link ? (
                              <a 
                                href={option.app_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {option.app_name}
                              </a>
                            ) : (
                              <span className="font-medium">{option.app_name}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {(!plan.destination_info?.transportation_options || 
                      plan.destination_info.transportation_options.length === 0) && (
                        <p className="text-gray-500 italic">Transportation information not available for this destination.</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Budget Tips */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" /> 
                    Money-Saving Tips
                  </h3>
                  
                  {plan.destination_info?.budget_tips && plan.destination_info.budget_tips.length > 0 ? (
                    <ul className="space-y-2">
                      {plan.destination_info.budget_tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 font-bold mr-2">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Budget tips not available for this destination.</p>
                  )}
                </div>
              </div>
              
              {/* Destination Info */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-indigo-600" /> 
                    Useful Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plan.destination_info && (
                      <>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Country</h4>
                          <p className="text-gray-900">{plan.destination_info.country || 'Not specified'}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">City</h4>
                          <p className="text-gray-900">{plan.destination_info.city || originalRequest.destination.split(',')[0]}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Local Language</h4>
                          <p className="text-gray-900">{plan.destination_info.language || 'Not specified'}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Currency</h4>
                          <p className="text-gray-900">{plan.destination_info.currency || 'Not specified'}</p>
                        </div>
                        
                        {plan.destination_info.exchange_rate && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Exchange Rate</h4>
                            <p className="text-gray-900">1 USD = {plan.destination_info.exchange_rate} {plan.destination_info.currency}</p>
                          </div>
                        )}
                        
                        {plan.destination_info.emergency_info && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Emergency Numbers</h4>
                            <div className="space-y-1">
                              {plan.destination_info.emergency_info.police && (
                                <p className="text-sm">Police: <span className="font-medium">{plan.destination_info.emergency_info.police}</span></p>
                              )}
                              {plan.destination_info.emergency_info.ambulance && (
                                <p className="text-sm">Ambulance: <span className="font-medium">{plan.destination_info.emergency_info.ambulance}</span></p>
                              )}
                              {plan.destination_info.emergency_info.tourist_police && (
                                <p className="text-sm">Tourist Police: <span className="font-medium">{plan.destination_info.emergency_info.tourist_police}</span></p>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <TripItinerary 
            plan={plan} 
            originalRequestData={originalRequest} 
            onPlanNewTrip={() => {
              sessionStorage.removeItem("fastplan_result");
              sessionStorage.removeItem("fastplan_request");
              router.push("/fastplan"); 
            }} 
          />
        </div>
      </div>
      {activePopupKey && activePopupQuery && (
        <PlaceDetailsPopup
          details={placeDetails[activePopupKey]}
          onClose={handleClosePopup}
          placeNameQuery={activePopupQuery}
        />
      )}
      <ChatBubble
        isOpen={chatOpen}
        anchorRef={chatAnchor}
        onClose={() => setChatOpen(false)}
        onSubmit={handleChatSubmit}
        loading={chatLoading}
      />
    </div>
  );
}