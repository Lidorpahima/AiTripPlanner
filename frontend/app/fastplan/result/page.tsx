'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Star, Coffee, Utensils, Bed, Landmark, ShoppingBag, Bus } from 'lucide-react';

// Component imports
import TripItinerary from "./components/Tripltinerary"; 
import PlaceDetailsPopup from "./components/PlaceDetailsPopup";
import NavigationTabs from "./components/NavigationTabs";
import HeroSection from "./components/HeroSection";
import TripStats from "./components/TripStats";
import ItineraryTab from "./components/ItineraryTab";
import CostsTab from "./components/CostsTab";
import TipsTab from "@/components/TipsTab";
import LoadingDisplay from "./components/LoadingDisplay";
import ErrorDisplay from "./components/ErrorDisplay";
import ChatBubble from "./components/ChatBubble";

// Types import
import { Activity, PlaceDetailsData, TripPlan, OriginalRequestData } from "@/constants/planTypes";

// Helper function to format currency
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
  const chatAnchor = useRef<HTMLButtonElement | null>(null);
  
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Load trip data from session storage
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
  }, [router, loadingError]); 

  // Function to enhance plan data with cost estimates if not already present
  const enhancePlanWithEstimates = (planData: TripPlan) => {
    // Don't modify if already has cost data
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

  // Function to create full search query for a place
  function getFullPlaceQuery(placeName: string | null | undefined) {
    if (!placeName) return '';
    const city = plan?.destination_info?.city || '';
    const country = plan?.destination_info?.country || '';
    return [placeName, city, country].filter(Boolean).join(' ');
  }

  // Handler to open location in maps
  const handleOpenInMaps = useCallback((placeNameLookup: string | null | undefined) => {
    const fullQuery = getFullPlaceQuery(placeNameLookup);
    if (!fullQuery) {
      console.log("No place name provided for map lookup.");
      toast.info("Location information not available for this activity.", { autoClose: 2000 });
      return;
    }
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
    window.open(googleMapsUrl, '_blank');
  }, [plan]);

  // Handler for place details popup
  const handlePlaceClick = useCallback(async (dayIndex: number, activityIndex: number, placeNameLookup: string | null | undefined) => {
    const fullQuery = getFullPlaceQuery(placeNameLookup);
    if (!fullQuery) {
      console.log("No place name provided for lookup for this activity.");
      toast.info("Detailed information not available for this activity.", { autoClose: 2000 });
      return;
    }
    const key = `${dayIndex}-${activityIndex}`;
    setActivePopupQuery(fullQuery);
    if (placeDetails[key] && placeDetails[key] !== 'error') {
      setActivePopupKey(key);
      return;
    }
    setPlaceDetails(prev => ({ ...prev, [key]: 'loading' }));
    setActivePopupKey(key);
    const url = new URL(`${API_BASE}/api/place-details/`);
    url.searchParams.append('query', fullQuery);
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        if (response.status === 404) {
          toast.error(`Place details not found for "${fullQuery}" on Google Maps.`);
        } else {
          let serverErrorMessage = `HTTP error ${response.status}`;
          try {
            const errorBody = await response.json();
            serverErrorMessage = errorBody?.error || errorBody?.message || serverErrorMessage;
          } catch (parseError) {}
          toast.error(`Failed to get details: ${serverErrorMessage}`);
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      const data: PlaceDetailsData = await response.json();
      if (!data || typeof data !== 'object' || !data.name) {
        throw new Error("Invalid data format received from server.");
      }
      setPlaceDetails(prev => ({ ...prev, [key]: data }));
    } catch (err) {
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
  }, [plan, placeDetails, API_BASE]);

  // Function to handle closing the place details popup
  const handleClosePopup = useCallback(() => {
    setActivePopupKey(null);
    setActivePopupQuery("");
  }, []);

  // Function to handle chat request for activity replacement
  const handleChatRequest = useCallback((dayIndex: number, activityIndex: number, buttonRef: HTMLButtonElement) => {
    setChatDayIdx(dayIndex);
    setChatActIdx(activityIndex);
    chatAnchor.current = buttonRef;
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

  // Show loading state
  if (isLoading) {
    return <LoadingDisplay />;
  }

  // Show error state
  if (loadingError || !plan || !originalRequest) {
    return <ErrorDisplay errorMessage={loadingError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">
        {/* Hero Section */}
        <HeroSection plan={plan} originalRequest={originalRequest} />
        
        {/* Trip Stats Cards */}
        <TripStats 
          plan={plan} 
          originalRequest={originalRequest}
          formatCurrency={formatCurrency}
        />
        
        {/* Navigation Tabs */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Content based on active tab */}
        <div className="mb-12">
          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <ItineraryTab 
              plan={plan}
              formatCurrency={formatCurrency}
              handlePlaceClick={handlePlaceClick}
              handleChatRequest={handleChatRequest}
              handleOpenInMaps={handleOpenInMaps}
              getCategoryIcon={getCategoryIcon}
            />
          )}
          
          {/* Cost Breakdown Tab */}
          {activeTab === 'costs' && (
            <CostsTab 
              plan={plan}
              originalRequest={originalRequest}
              formatCurrency={formatCurrency}
            />
          )}
          
          {/* Local Tips Tab */}
          {activeTab === 'tips' && (
            <TipsTab 
              plan={plan}
              originalRequest={originalRequest}
            />
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

      {/* Popup components */}
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