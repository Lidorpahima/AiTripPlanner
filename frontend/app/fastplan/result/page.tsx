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
import SideChatPanel, { ChatMessage } from "./components/SideChatPanel";

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

  // New state for SideChatPanel
  const [isSideChatOpen, setIsSideChatOpen] = useState(false);
  const [currentChatActivity, setCurrentChatActivity] = useState<Activity | null>(null);
  const [currentChatDayIndex, setCurrentChatDayIndex] = useState<number | null>(null);
  const [currentChatActivityIndex, setCurrentChatActivityIndex] = useState<number | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [sideChatLoading, setSideChatLoading] = useState(false);
  
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect to hide/show third-party chat widget (Brevo)
  useEffect(() => {
    const selectors = [
      'div.brevo-conversations__iframe-wrapper',      // PRIMARY TARGET: The wrapper div you found
      'iframe[id="brevo-chat-frame"]',
      'iframe[id="brevo-conversations-widget_chat-window"]',
      'div[data-brevo-chat-widget-container]',
      '#brevo-chat-widget-container',
      '.brevo-launcher-frame iframe',
      'button.header.js-header[aria-label*="Chat with us"]' 
    ];

    let widgetToHide: HTMLElement | null = null;

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // If we found the button itself, try to get its parent wrapper if it matches the primary target
        if (selector.startsWith('button.header')) {
            const wrapper = element.closest('div.brevo-conversations__iframe-wrapper');
            widgetToHide = wrapper as HTMLElement || element as HTMLElement; // Hide wrapper if found, else the button
        } else {
            widgetToHide = element as HTMLElement;
        }
        break; 
      }
    }
    
    // Fallback for other iframe patterns if the primary target or specific selectors aren't found
    if (!widgetToHide) {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src.includes('brevo.com') || iframe.src.includes('sendinblue.com')) {
          // If it's a brevo iframe, its parent might be the wrapper we want
          if (iframe.parentElement && iframe.parentElement.classList.contains('brevo-conversations__iframe-wrapper')) {
            widgetToHide = iframe.parentElement;
          } else {
            widgetToHide = iframe; // Hide the iframe itself as a fallback
          }
        } else if (window.getComputedStyle(iframe).position === 'fixed' && 
                   window.getComputedStyle(iframe).bottom === '0px' && 
                   window.getComputedStyle(iframe).right === '0px') {
          widgetToHide = iframe;
        }
      });
    }

    if (widgetToHide) {
      const originalDisplayStyle = widgetToHide.style.display;
      const originalVisibilityStyle = widgetToHide.style.visibility;

      if (isSideChatOpen) {
        widgetToHide.style.setProperty('display', 'none', 'important');
      } else {
        widgetToHide.style.display = originalDisplayStyle || ''; 
      }
      
      return () => {
        if (widgetToHide) { 
            widgetToHide.style.display = originalDisplayStyle || '';
        }
      };
    } else {
    }
  }, [isSideChatOpen]);

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
    // New logic for SideChatPanel
    setCurrentChatDayIndex(dayIndex);
    setCurrentChatActivityIndex(activityIndex);
    
    const activity = plan?.days[dayIndex]?.activities[activityIndex];
    if (activity) {
      setCurrentChatActivity(activity);
      // Initialize conversation with a system message or clear it
      setConversationHistory([
        {
          id: `system-${Date.now()}`,
          text: `Let's find an alternative for: "${activity.description}". What are you looking for?`,
          sender: 'system',
          timestamp: new Date(),
        }
      ]);
    } else {
      setCurrentChatActivity(null); // Should not happen if plan is loaded
      setConversationHistory([]);
      toast.error("Could not load activity details for chat.");
    }

    setIsSideChatOpen(true);
  }, [plan]); 

  const handleSideChatClose = useCallback(() => {
    
    // Force close with immediate visual feedback
    document.body.style.overflow = ''; // Restore scroll if it was disabled
    
    // Reset all related state
    setIsSideChatOpen(false);
    
    // Use a small timeout to ensure the panel closes visually before resetting the other states
    setTimeout(() => {
      setCurrentChatActivity(null);
      setCurrentChatDayIndex(null);
      setCurrentChatActivityIndex(null);
      setConversationHistory([]);
      setSideChatLoading(false);
    }, 300); // Matches the transition duration in the panel
    
  }, []);

  const handleSideChatSubmit = async (message: string /*, activityContext: Activity | null */) => {

    if (currentChatDayIndex === null || currentChatActivityIndex === null || !plan || !currentChatActivity) {
      toast.error("Cannot process chat request: missing context.");
      return;
    }


    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setConversationHistory(prev => [...prev, userMessage]);
    setSideChatLoading(true);

    let previousActivity = null;
    try {
      if (currentChatActivityIndex > 0 && plan.days[currentChatDayIndex] && plan.days[currentChatDayIndex].activities) {
        previousActivity = plan.days[currentChatDayIndex].activities[currentChatActivityIndex - 1];
      }
    } catch (e) {
      console.error("handleSideChatSubmit: Error determining previousActivity:", e); // Kept console.error for actual errors
    }

    let nextActivity = null;
    try {
      if (plan.days[currentChatDayIndex] && plan.days[currentChatDayIndex].activities && currentChatActivityIndex < plan.days[currentChatDayIndex].activities.length - 1) {
        nextActivity = plan.days[currentChatDayIndex].activities[currentChatActivityIndex + 1];
      }
    } catch (e) {
      console.error("handleSideChatSubmit: Error determining nextActivity:", e); // Kept console.error
    }
    
    let stringifiedBody = "";
    try {
      stringifiedBody = JSON.stringify({
        message,
        dayIndex: currentChatDayIndex,
        activityIndex: currentChatActivityIndex,
        plan: plan, 
        previousActivity: previousActivity, 
        nextActivity: nextActivity,       
      });
    } catch (e) {
      console.error("handleSideChatSubmit: Error stringifying body:", e); // Kept console.error
      toast.error("Error preparing request for AI.");
      setSideChatLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/chat-replace-activity/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringifiedBody
      });
      
      // console.log("Fetch response status:", response.status); // Removed console.log

      if (!response.ok) {
        console.error("Server returned an error status:", response.status, response.statusText); // Kept console.error
        let errorText = await response.text(); // Get raw text of the error response
        console.error("Raw error response from server:", errorText); // Kept console.error
        try {
            const errorData = JSON.parse(errorText); // Try to parse it as JSON
            throw new Error(errorData.error || errorData.details || `Server error: ${response.status}`);
        } catch (parseError) {
            // If parsing failed, use the raw text or a generic message
            throw new Error(errorText || `Server error: ${response.status} - Non-JSON response`);
        }
      }
      
      const responseText = await response.text(); // Get response as text first
      const data = JSON.parse(responseText); // Then parse
      
      if (!data || !data.activities || !Array.isArray(data.activities) || data.activities.length === 0) {
        throw new Error('No new activity suggestions received from AI.');
      }

      const aiSuggestedActivities: Activity[] = data.activities;
      let aiResponseMessageText = "";

      if (aiSuggestedActivities.length === 1) {
        const singleActivity = aiSuggestedActivities[0];
        aiResponseMessageText = `I've found an alternative for '${currentChatActivity.description}'! 🤩\n\nHow about this: **${singleActivity.description}**? \nThis option looks really promising! ✨ What do you think? 😉`;
      } else {
        aiResponseMessageText = `I've found a few ideas to replace '${currentChatActivity.description}'! 🤩\n\nHere's a sequence that might work well:\n`;
        aiSuggestedActivities.forEach((act, index) => {
          aiResponseMessageText += `\n${index + 1}. **${act.description}** (around ${act.time || 'flexible time'})`;
        });
        aiResponseMessageText += "\n\nWhat do you think of this sequence? 🤔";
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponseMessageText,
        sender: 'ai',
        timestamp: new Date(),
        suggestedActivities: aiSuggestedActivities // Store the array of activities
      };
      setConversationHistory(prev => [...prev, aiMessage]);

    } catch (e: any) {
      console.error("Error in side chat submit:", e); // Kept console.error
      const errorMessageText = e.message && e.message.includes('AI') 
        ? e.message 
        : `Error: ${e.message || 'Could not get suggestion.'}`;
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: errorMessageText,
        sender: 'system',
        timestamp: new Date(),
      };
      setConversationHistory(prev => [...prev, errorMessage]);
      toast.error(errorMessageText);
    } finally {
      setSideChatLoading(false);
    }
  };

  // Modified handler for accepting a single suggestion
  const handleAcceptSuggestion = (activityToAccept: Activity) => { 
    if (currentChatDayIndex === null || currentChatActivityIndex === null || !plan) {
      toast.error("Cannot accept suggestion: missing context.");
      return;
    }

    setPlan(prevPlan => {
      if (!prevPlan) return prevPlan;
      
      // Calculate cost differences first, so they are in scope for both day and total updates
      let minDiff = 0;
      let maxDiff = 0;

      const dayOfChange = prevPlan.days[currentChatDayIndex!];
      const oldActivityForCost = dayOfChange.activities[currentChatActivityIndex!];

      const oldMinCost = oldActivityForCost?.cost_estimate?.min || 0;
      const oldMaxCost = oldActivityForCost?.cost_estimate?.max || 0;
      const newMinCost = activityToAccept?.cost_estimate?.min || 0;
      const newMaxCost = activityToAccept?.cost_estimate?.max || 0;

      minDiff = newMinCost - oldMinCost;
      maxDiff = newMaxCost - oldMaxCost;
      
      const updatedPlan = { ...prevPlan };
      updatedPlan.days = prevPlan.days.map((day, dayIdx) => {
        if (dayIdx === currentChatDayIndex) {
          const currentActivities = [...day.activities];
          // const oldActivity = currentActivities[currentChatActivityIndex!]; // No longer needed here for cost

          currentActivities.splice(currentChatActivityIndex!, 1, activityToAccept); // Splice in the single activity
          
          // Update day_cost_estimate for the current day using pre-calculated diffs
          const updatedDayCostEstimate = {
            min: (day.day_cost_estimate?.min || 0) + minDiff,
            max: (day.day_cost_estimate?.max || 0) + maxDiff,
            currency: day.day_cost_estimate?.currency || 'USD',
          };

          return { ...day, activities: currentActivities, day_cost_estimate: updatedDayCostEstimate };
        }
        return day;
      });

      // Update total_cost_estimate for the entire plan
      if (updatedPlan.total_cost_estimate) {
        updatedPlan.total_cost_estimate = {
          ...updatedPlan.total_cost_estimate,
          min: (updatedPlan.total_cost_estimate.min || 0) + minDiff, 
          max: (updatedPlan.total_cost_estimate.max || 0) + maxDiff, 
        };
      }
      
      return updatedPlan;
    });
    
    const originalKey = `${currentChatDayIndex}-${currentChatActivityIndex}`;
    setPlaceDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[originalKey];
      return newDetails;
    });
    
    const confirmationText = `✅ Activity '${activityToAccept.description.substring(0, 30)}...' updated successfully!`;

    const confirmationMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      text: `${confirmationText} Closing chat.`, // Updated message
      sender: 'system',
      timestamp: new Date(),
    };
    setConversationHistory(prev => [...prev, confirmationMessage]);
    
    toast.success(confirmationText);
    handleSideChatClose(); // Close chat after accepting
  };

  // New handler for rejecting an individual activity from a list of suggestions
  const handleRejectIndividualActivity = (activityToReject: Activity, messageId: string) => {
    setConversationHistory(prevHistory => {
      const historyCopy = [...prevHistory];
      const messageIndex = historyCopy.findIndex(msg => msg.id === messageId);

      if (messageIndex !== -1 && historyCopy[messageIndex].suggestedActivities) {
        const updatedSuggestedActivities = historyCopy[messageIndex].suggestedActivities!.filter(
          activity => activity.description !== activityToReject.description // Simple comparison; consider more robust ID if available
        );

        historyCopy[messageIndex] = {
          ...historyCopy[messageIndex],
          suggestedActivities: updatedSuggestedActivities,
        };

        // If all sub-suggestions are rejected, add a follow-up system message
        if (updatedSuggestedActivities.length === 0) {
          const allRejectedMessage: ChatMessage = {
            id: `system-${Date.now()}`,
            text: "All specific options here have been addressed. You can ask for different suggestions or close the chat.",
            sender: 'system',
            timestamp: new Date(),
          };
          // Insert after the AI message that has been depleted
          historyCopy.splice(messageIndex + 1, 0, allRejectedMessage);
        }
      }
      return historyCopy;
    });
  };

  // Existing handler for rejecting a whole suggestion message (can be kept for single suggestions or future use)
  const handleRejectSuggestion = (messageId: string) => {
    // Find the rejected message in the conversation
    const rejectedMessageIndex = conversationHistory.findIndex(msg => msg.id === messageId);
    if (rejectedMessageIndex < 0) return;
    
    // Add a system message asking for more details
    const followUpMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      text: `Would you like to try again with more specific requirements? Please provide more details about what you're looking for.`,
      sender: 'system',
      timestamp: new Date(),
    };
    setConversationHistory(prev => [...prev, followUpMessage]);
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
      {/* Add new SideChatPanel */}
      <SideChatPanel
        isOpen={isSideChatOpen}
        onClose={handleSideChatClose}
        onSubmit={handleSideChatSubmit}
        activityContext={currentChatActivity}
        isLoading={sideChatLoading}
        conversation={conversationHistory}
        onAcceptSuggestion={handleAcceptSuggestion}
        onRejectIndividualActivity={handleRejectIndividualActivity}
        onRejectSuggestion={handleRejectSuggestion}
        destinationInfo={plan?.destination_info}
      />
    </div>
  );
}