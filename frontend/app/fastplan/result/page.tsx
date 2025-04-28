'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TripItinerary from "@/components/Tripltinerary"; 
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Clock, Coins, Star, DollarSign, Bus, Map, Calendar, CalendarCheck, Wallet, TicketIcon, Utensils, Coffee, Bed, Car, Train, Plane, Info, ShoppingBag, Gift, Navigation, Globe, ScrollText, Landmark, Share2, Copy, Mail, MessageCircle } from 'lucide-react';

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

interface OriginalRequestData {
    destination: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    tripStyle?: string[];
    budget?: string;
}

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
                              <p className="text-sm text-gray-800">{activity.description}</p>
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
    </div>
  );
}