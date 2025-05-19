'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, CalendarDays, MapPin, Plus, CheckCircle, Edit3, Trash2, Navigation, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { SavedTripData } from '../../page'; // Assuming SavedTripData is exported from mytrips/page.tsx
import Cookies from 'js-cookie'; // Added for accessing cookies

// Import SideChatPanel and related types
import SideChatPanel, { ChatMessage } from '@/app/fastplan/result/components/SideChatPanel';
import { Activity as FastPlanActivity, TripPlan as FastPlanTripPlan } from '@/constants/planTypes'; // Use Activity type from planTypes for consistency
import LiveTripHeader from './components/LiveTripHeader'; // Import the new header component
import LiveDayDetails from './components/LiveDayDetails'; // Import the new day details component
import ActivitiesList from './components/ActivitiesList'; // Import the new activities list component
import { PlanJson, LiveTripPlan, LiveDay, DayBase, ActivityBase, LiveActivity, DestinationInfo, TotalCostEstimate } from './liveTypes'; // Import types
import LoadingStateDisplay from './components/LoadingStateDisplay'; // Import Loading component
import ErrorStateDisplay from './components/ErrorStateDisplay'; // Import Error component
import { useSideChat, SideChatContext } from './hooks/useSideChat'; // Import the new hook
import DailyProgressBar from './components/DailyProgressBar';

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const dayNum = today.getDate().toString().padStart(2, '0'); // Renamed to avoid conflict
    return `${year}-${month}-${dayNum}`;
};

// --- Constants ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TripLiveModePage() {
    const [trip, setTrip] = useState<SavedTripData | null>(null);
    const [livePlan, setLivePlan] = useState<LiveTripPlan | null>(null);
    const [currentDayPlan, setCurrentDayPlan] = useState<LiveDay | null>(null);
    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const params = useParams();
    const tripId = params.tripId as string;

    // Use the side chat hook
    const {
        isSideChatOpen,
        sideChatContext, // This context is managed by the hook but needed for SideChatPanel props
        conversationHistory,
        sideChatLoading,
        handleOpenAddActivityChat,
        handleSideChatClose,
        handleSideChatSubmitForAdd,
        handleAcceptNewActivitySuggestion,
        handleRejectSuggestionForAdd,
        handleRejectIndividualActivity,
        // setConversationHistory // Not typically used directly from parent
    } = useSideChat({ livePlan, trip, setLivePlan, setCurrentDayPlan });

    // Effect to hide/show third-party chat widget (e.g., Brevo)
    useEffect(() => {
        const selectors = [
            'div.brevo-conversations__iframe-wrapper',
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
                if (selector.startsWith('button.header')) {
                    const wrapper = element.closest('div.brevo-conversations__iframe-wrapper');
                    widgetToHide = wrapper as HTMLElement || element as HTMLElement;
                } else {
                    widgetToHide = element as HTMLElement;
                }
                break; 
            }
        }
        
        if (!widgetToHide) {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                if (iframe.src.includes('brevo.com') || iframe.src.includes('sendinblue.com')) {
                    if (iframe.parentElement && iframe.parentElement.classList.contains('brevo-conversations__iframe-wrapper')) {
                        widgetToHide = iframe.parentElement;
                    } else {
                        widgetToHide = iframe;
                    }
                } else if (window.getComputedStyle(iframe).position === 'fixed' && 
                           window.getComputedStyle(iframe).bottom === '0px' && 
                           window.getComputedStyle(iframe).right === '0px') {
                    // A more generic check for floating bottom-right iframes if specific selectors fail
                    widgetToHide = iframe;
                }
            });
        }

        if (widgetToHide) {
            const widgetToHideElement = widgetToHide; // To satisfy TypeScript within the cleanup function
            const originalDisplayStyle = widgetToHideElement.style.display;
            
            // Hide the widget when TripLiveModePage is active
            widgetToHideElement.style.setProperty('display', 'none', 'important');
            
            return () => {
                // Restore the widget when TripLiveModePage is unmounted
                if (widgetToHideElement) { 
                    widgetToHideElement.style.display = originalDisplayStyle || '';
                }
            };
        } else {
            console.log("Live Mode: Brevo chat widget not found or already hidden.");
        }
    }, []); // Empty dependency array: runs once on mount, cleans up on unmount

    useEffect(() => {
        const storedTripData = sessionStorage.getItem('liveTripData');
        if (storedTripData) {
            try {
                const parsedTrip: SavedTripData = JSON.parse(storedTripData);
                if (parsedTrip.id.toString() === tripId) {
                    setTrip(parsedTrip);

                    if (parsedTrip.plan_json && parsedTrip.plan_json.days) {
                        const planJsonTyped = parsedTrip.plan_json as PlanJson; // Use the well-defined PlanJson
                        const initializedPlan: LiveTripPlan = {
                            ...planJsonTyped,
                            days: planJsonTyped.days.map((day: DayBase, dayIndex: number) => ({
                                ...day,
                                activities: day.activities.map((activity: ActivityBase, activityIndex: number) => ({
                                    ...activity,
                                    id: `day-${dayIndex}-activity-${activityIndex}-${Date.now()}`,
                                    is_completed: false 
                                }))
                            }))
                        };
                        setLivePlan(initializedPlan);
                    } else {
                        setError("Trip plan data is incomplete. Please try again.");
                        toast.error("Trip plan data is incomplete.");
                        router.push('/mytrips');
                    }
                    
                } else {
                    setError("Trip data mismatch. Please try starting Live Mode again.");
                    toast.error("Trip data mismatch.");
                    router.push('/mytrips');
                }
            } catch (e) {
                console.error("Error parsing trip data from sessionStorage:", e);
                setError("Could not load trip data. Please try again.");
                toast.error("Error loading trip data.");
                router.push('/mytrips');
            }
        } else {
            setError("No trip data found for Live Mode. Please start from My Trips.");
            toast.warn("No trip data found for Live Mode.");
            router.push('/mytrips');
        }
        setIsLoading(false);
    }, [tripId, router]);

    useEffect(() => {
        if (livePlan && livePlan.days) {
            const todayStr = getCurrentDateString();
            let activeDay: LiveDay | undefined | null = null;
            let activeDayIdx = 0;

            if (trip?.start_date && livePlan.days) {
                const tripStartDate = new Date(trip.start_date);
                for (let i = 0; i < livePlan.days.length; i++) {
                    const currentIterationDate = new Date(tripStartDate);
                    currentIterationDate.setDate(tripStartDate.getDate() + i);
                    const dayDateStr = currentIterationDate.toISOString().split('T')[0];
                    const originalPlanDayTitle = (trip.plan_json as PlanJson)?.days?.[i]?.title;
                    if (dayDateStr === todayStr && livePlan.days[i] && originalPlanDayTitle === livePlan.days[i].title) {
                        activeDay = livePlan.days[i];
                        activeDayIdx = i;
                        break;
                    }
                }
            }

            if (!activeDay && livePlan.days.length > 0) {
                 activeDay = livePlan.days[0]; 
                 activeDayIdx = 0; // Default to first day
            }
            setCurrentDayPlan(activeDay || null);
            setCurrentDayIndex(activeDayIdx);
        }
    }, [livePlan, trip]);

    const handleToggleComplete = (activityId: string) => {
        if (!currentDayPlan || !livePlan) return;

        const updatedLivePlan: LiveTripPlan = {
            ...livePlan,
            days: livePlan.days.map(day => {
                if (day.title === currentDayPlan.title) { 
                    return {
                        ...day,
                        activities: day.activities.map(activity =>
                            activity.id === activityId
                                ? { ...activity, is_completed: !activity.is_completed }
                                : activity
                        )
                    };
                }
                return day;
            })
        } as LiveTripPlan; 
        setLivePlan(updatedLivePlan);
        setCurrentDayPlan(prevDayPlan => prevDayPlan ? updatedLivePlan.days.find(d => d.title === prevDayPlan.title) || null : null);
    };

    const handleNavigateToDay = (dayIndex: number) => {
        if (livePlan && livePlan.days && livePlan.days[dayIndex]) {
            setCurrentDayIndex(dayIndex);
            setCurrentDayPlan(livePlan.days[dayIndex]);
        }
    };

    const handleNavigate = (placeName: string | null | undefined) => {
        if (!placeName) {
            toast.info("Location not specified for this activity.");
            return;
        }
        // Accessing destination_info via the typed livePlan or trip.plan_json (casted)
        const currentPlanJson = livePlan || (trip?.plan_json as PlanJson | undefined);
        const city = currentPlanJson?.destination_info?.city || trip?.destination?.split(',')[0] || '';
        const country = currentPlanJson?.destination_info?.country || trip?.destination?.split(',')[1]?.trim() || '';
        const fullQuery = [placeName, city, country].filter(Boolean).join(' ');
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
        window.open(googleMapsUrl, '_blank');
    };

    if (isLoading) {
        return <LoadingStateDisplay />;
    }

    if (error || !trip || !livePlan || !currentDayPlan) {
        return <ErrorStateDisplay error={error} />;
    }

    // Find current/next activity for highlighting (basic version)
    const now = new Date();
    let highlightedActivityId: string | null = null;
    const sortedActivities = [...currentDayPlan.activities].filter(a => !a.is_completed).sort((a, b) => {
        const timeA = a.time ? parseInt(a.time.replace(':', '')) : 9999;
        const timeB = b.time ? parseInt(b.time.replace(':', '')) : 9999;
        return timeA - timeB;
    });

    for (const activity of sortedActivities) {
        if (activity.time) {
            const [hours, minutes] = activity.time.split(':').map(Number);
            const activityDate = new Date(now);
            activityDate.setHours(hours, minutes, 0, 0);
            if (activityDate >= now) {
                highlightedActivityId = activity.id;
                break;
            }
        }
    }
    if (!highlightedActivityId && sortedActivities.length > 0) {
        highlightedActivityId = sortedActivities[0].id; // Highlight the first upcoming if all past or no time
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col">
            {/* Header */}
            <LiveTripHeader tripTitle={trip.title} tripDestination={trip.destination} />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto p-4 pb-20"> {/* Added pb-20 for FAB */}
                <LiveDayDetails 
                    currentDayPlanTitle={currentDayPlan.title}
                    currentDayIndex={currentDayIndex}
                    totalDays={livePlan.days.length}
                    onNavigateToDay={handleNavigateToDay}
                />

                {/* Daily Progress Bar */}
                <DailyProgressBar
                  completed={currentDayPlan.activities.filter(a => a.is_completed).length}
                  total={currentDayPlan.activities.length}
                />

                <ActivitiesList
                    currentDayPlan={currentDayPlan}
                    highlightedActivityId={highlightedActivityId}
                    onToggleComplete={handleToggleComplete}
                    onNavigate={handleNavigate}
                    onOpenAddActivityChat={handleOpenAddActivityChat}
                    currentDayIndex={currentDayIndex}
                />
            </main>

            {/* SideChatPanel for Adding Activities */}
            {isSideChatOpen && sideChatContext && (
                <SideChatPanel
                    isOpen={isSideChatOpen}
                    onClose={handleSideChatClose}
                    onSubmit={handleSideChatSubmitForAdd}
                    activityContext={null} // Explicitly null for add mode
                    panelMode="add" // Specify panelMode
                    addModeTitle={ `Add to: ${livePlan?.days[sideChatContext.dayIndex]?.title || `Day ${sideChatContext.dayIndex + 1}`}` } // Dynamic title
                    isLoading={sideChatLoading}
                    conversation={conversationHistory}
                    onAcceptSuggestion={handleAcceptNewActivitySuggestion}
                    onRejectIndividualActivity={handleRejectIndividualActivity}
                    onRejectSuggestion={handleRejectSuggestionForAdd} 
                    destinationInfo={livePlan?.destination_info || (trip?.plan_json as PlanJson)?.destination_info || undefined}
                />
            )}
        </div>
    );
} 