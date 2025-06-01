/**
 * Live Mode Page Component
 * 
 * A dynamic page component that enables users to interact with their trip plan in real-time.
 * Features include:
 * - Real-time activity tracking and completion
 * - Day-by-day navigation
 * - Activity notes and modifications
 * - Side chat for trip modifications
 * - Progress tracking
 * - Authentication and token management
 * - Responsive design with swipeable activities
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, CalendarDays, MapPin, Plus, CheckCircle, Edit3, Trash2, Navigation, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { SavedTripData } from '../../page'; 
import Cookies from 'js-cookie'; 
import { useActivityNotes } from './hooks/useActivityNotes';
import { useAuth } from '@/app/(auth)/context/AuthContext';

import SideChatPanel, { ChatMessage } from '@/app/fastplan/result/components/SideChatPanel';
import { Activity as FastPlanActivity, TripPlan as FastPlanTripPlan } from '@/constants/planTypes'; // Use Activity type from planTypes for consistency
import LiveTripHeader from './components/LiveTripHeader';
import LiveDayDetails from './components/LiveDayDetails'; 
import ActivitiesList from './components/ActivitiesList'; 
import { PlanJson, LiveTripPlan, LiveDay, DayBase, ActivityBase, LiveActivity, DestinationInfo, TotalCostEstimate } from './liveTypes'; // Import types
import LoadingStateDisplay from './components/LoadingStateDisplay'; 
import ErrorStateDisplay from './components/ErrorStateDisplay'; 
import { useSideChat, SideChatContext } from './hooks/useSideChat'; 
import DailyProgressBar from './components/DailyProgressBar';
import SwipeableActivities from './components/SwipeableActivities';
import NoteModal from './components/NoteModal';
import { saveNote } from './components/saveNote';

/**
 * Utility function to get current date in YYYY-MM-DD format
 * @returns {string} Current date string
 */
const getCurrentDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const dayNum = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${dayNum}`;
};

/**
 * Checks if a JWT token is expired
 * @param {string | undefined} token - JWT token to check
 * @returns {boolean} True if token is expired or invalid
 */
function isTokenExpired(token: string | undefined): boolean {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

/**
 * Attempts to refresh the access token using a refresh token
 * @param {string | undefined} refreshToken - Refresh token to use
 * @returns {Promise<string | null>} New access token or null if refresh failed
 */
async function refreshAccessToken(refreshToken: string | undefined): Promise<string | null> {
    if (!refreshToken) return null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!res.ok) return null;
        const data = await res.json();
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
        return null;
    } catch {
        return null;
    }
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * TripLiveModePage Component
 * 
 * Main component for the live trip mode interface. Manages:
 * - Trip data and state
 * - Authentication
 * - Activity tracking
 * - Navigation
 * - Notes and modifications
 */
export default function TripLiveModePage() {
    // State management
    const [trip, setTrip] = useState<SavedTripData | null>(null);
    const [livePlan, setLivePlan] = useState<LiveTripPlan | null>(null);
    const [currentDayPlan, setCurrentDayPlan] = useState<LiveDay | null>(null);
    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [tokenState, setTokenState] = useState<string>('');
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [noteActivityId, setNoteActivityId] = useState<string | null>(null);
    const [noteInitial, setNoteInitial] = useState('');
    const [swipeView, setSwipeView] = useState(false);

    // Router and params setup
    const router = useRouter();
    const params = useParams();
    const tripId = params.tripId as string;
    const token = Cookies.get('access');
    const refreshToken = Cookies.get('refresh');
    const { logout } = useAuth();

    /**
     * Effect hook for token management
     * Handles token validation and refresh
     */
    useEffect(() => {
        async function checkAndRefreshToken() {
            let currentToken = Cookies.get('access');
            if (!currentToken || isTokenExpired(currentToken)) {
                const newToken = await refreshAccessToken(refreshToken);
                if (newToken) {
                    setTokenState(newToken);
                    setAuthLoading(false);
                } else {
                    toast.error('Session expired. Please log in again.');
                    logout?.();
                    router.push('/signin');
                }
            } else {
                setTokenState(currentToken);
                setAuthLoading(false);
            }
        }
        checkAndRefreshToken();
    }, [refreshToken, router, logout]);

    // Activity notes hook
    const { notes, setNotes, loading: notesLoading } = useActivityNotes(tripId, tokenState);

    // Side chat functionality
    const {
        isSideChatOpen,
        sideChatContext,
        conversationHistory,
        sideChatLoading,
        handleOpenAddActivityChat,
        handleSideChatClose,
        handleSideChatSubmitForAdd,
        handleAcceptNewActivitySuggestion,
        handleRejectSuggestionForAdd,
        handleRejectIndividualActivity,
    } = useSideChat({ livePlan, trip, setLivePlan, setCurrentDayPlan });

    /**
     * Effect hook to manage third-party chat widget visibility
     * Hides external chat widgets when live mode is active
     */
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
        }
    }, []);

    /**
     * Effect hook to initialize trip data
     * Loads and validates trip data from session storage or fetches from API
     */
    useEffect(() => {
        async function loadTripData() {
            try {
                // First try to get from session storage
        const storedTripData = sessionStorage.getItem('liveTripData');
                let tripData: SavedTripData | null = null;

        if (storedTripData) {
            try {
                const parsedTrip: SavedTripData = JSON.parse(storedTripData);
                if (parsedTrip.id.toString() === tripId) {
                            tripData = parsedTrip;
                        }
                    } catch (e) {
                        console.error('Error parsing stored trip data:', e);
                    }
                }

                // If no valid data in session storage, fetch from API
                if (!tripData) {
                    if (!tokenState) {
                        setError('Authentication required');
                        return;
                    }

                    const response = await fetch(`${API_BASE_URL}/api/my-trips/${tripId}/`, {
                        headers: {
                            'Authorization': `Bearer ${tokenState}`,
                            'Accept': 'application/json',
                        },
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error('Trip not found. Please make sure you have saved this trip.');
                        } else if (response.status === 401) {
                            throw new Error('Authentication required. Please log in again.');
                        } else {
                            throw new Error(`Failed to fetch trip data: ${response.statusText}`);
                        }
                    }

                    tripData = await response.json();
                    // Store in session storage for future use
                    sessionStorage.setItem('liveTripData', JSON.stringify(tripData));
                }

                if (tripData) {
                    setTrip(tripData);

                    if (tripData.plan_json && tripData.plan_json.days) {
                        try {
                            const planJsonTyped = tripData.plan_json as PlanJson;
                        const initializedPlan: LiveTripPlan = {
                            ...planJsonTyped,
                            days: planJsonTyped.days.map((day: DayBase, dayIndex: number) => ({
                                ...day,
                                activities: day.activities.map((activity: ActivityBase, activityIndex: number) => ({
                                    ...activity,
                                        id: `${dayIndex}-${activityIndex}`,
                                        is_completed: false,
                                        notes: '',
                                        cost_estimate: null
                                }))
                            }))
                        };
                        setLivePlan(initializedPlan);
                            setCurrentDayPlan(initializedPlan.days[0]);
                        } catch (e) {
                            console.error('Error initializing plan:', e);
                            setError('Error initializing trip plan');
                        }
                    } else {
                        setError('Invalid trip plan data');
                    }
                }
            } catch (e) {
                console.error('Error loading trip data:', e);
                setError('Failed to load trip data');
            } finally {
                setIsLoading(false);
            }
        }

        if (!authLoading) {
            loadTripData();
        }
    }, [tripId, tokenState, authLoading]);

    /**
     * Effect hook to update current day plan
     * Updates the current day when live plan changes
     */
    useEffect(() => {
        if (livePlan && livePlan.days && livePlan.days.length > 0) {
            setCurrentDayPlan(livePlan.days[currentDayIndex] || livePlan.days[0]);
        }
    }, [livePlan]);
    
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

    // Handler for marking activity as completed and moving to next
    const handleCompleteAndNext = (activityId: string) => {
        handleToggleComplete(activityId);
        // Optionally, you can scroll to next activity or let SwipeableActivities handle it
    };

    // Handler for skipping (just move to next activity)
    const handleSkip = (activityId: string) => {
        // No-op for now, SwipeableActivities will handle index
    };

    // Handler for opening note modal
    const handleNote = (activityId: string) => {
        setNoteActivityId(activityId);
        // Find the note for this activity
        const found = currentDayPlan?.activities.find(a => a.id === activityId);
        const idx = currentDayPlan?.activities.findIndex(a => a.id === activityId) ?? 0;
        const noteKey = `${currentDayIndex}-${idx}`;
        setNoteInitial(notes[noteKey]?.note || '');
        setNoteModalOpen(true);
    };

    // Handler for saving note
    const handleSaveNote = (newNote: string) => {
        if (noteActivityId == null) return;
        const idx = currentDayPlan?.activities.findIndex(a => a.id === noteActivityId) ?? 0;
        saveNote({
            tripId,
            dayIndex: currentDayIndex,
            activityIndex: idx,
            note: newNote,
            is_done: false,
            token: tokenState,
        }).then(() => {
            setNotes(prev => ({ ...prev, [`${currentDayIndex}-${idx}`]: { note: newNote, is_done: false } }));
        });
    };

    // Handler for opening Google Maps for an activity
    const handleMap = (activityId: string) => {
        const activity = currentDayPlan?.activities.find(a => a.id === activityId);
        if (!activity) return;
        handleNavigate(activity.place_name_for_lookup);
    };

    if (authLoading) {
        return <LoadingStateDisplay />;
    }

    if (isLoading) {
        return <LoadingStateDisplay />;
    }

    if (error || !trip || !livePlan || !currentDayPlan) {
        return <ErrorStateDisplay error={error} />;
    }

    // Find current/next activity for highlighting (basic version)
    const firstIncomplete = currentDayPlan.activities.find(a => !a.is_completed);
    const highlightedActivityId = firstIncomplete ? firstIncomplete.id : null;

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

                {/* Mobile-only Swipe View Toggle */}
                <div className="md:hidden flex justify-center mb-2">
                                    <button 
                        className={`px-4 py-2 rounded-full font-semibold shadow transition-colors ${swipeView ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
                        onClick={() => setSwipeView(v => !v)}
                    >
                        {swipeView ? 'List View' : 'Swipe View'}
                                    </button>
                </div>

                {/* Mobile: SwipeableActivities, Desktop: ActivitiesList */}
                <div className="md:hidden">
                    {swipeView ? (
                        <SwipeableActivities
                            activities={currentDayPlan.activities}
                            currentDayIndex={currentDayIndex}
                            highlightedActivityId={highlightedActivityId}
                            onAdd={(afterActivityId) => handleOpenAddActivityChat(currentDayIndex, afterActivityId)}
                            onComplete={handleCompleteAndNext}
                            onMap={handleMap}
                            onNote={handleNote}
                        />
                    ) : (
                        <ActivitiesList
                            currentDayPlan={currentDayPlan}
                            highlightedActivityId={highlightedActivityId}
                            onToggleComplete={handleToggleComplete}
                            onNavigate={handleNavigate}
                            onOpenAddActivityChat={handleOpenAddActivityChat}
                            currentDayIndex={currentDayIndex}
                            tripId={tripId}
                            token={tokenState}
                            notes={notes}
                            setNotes={setNotes}
                        />
                                                )}
                                            </div>
                {/* Desktop: Always show ActivitiesList */}
                <div className="hidden md:block">
                    <ActivitiesList
                        currentDayPlan={currentDayPlan}
                        highlightedActivityId={highlightedActivityId}
                        onToggleComplete={handleToggleComplete}
                        onNavigate={handleNavigate}
                        onOpenAddActivityChat={handleOpenAddActivityChat}
                        currentDayIndex={currentDayIndex}
                        tripId={tripId}
                        token={tokenState}
                        notes={notes}
                        setNotes={setNotes}
                    />
                                        </div>
                {/* Note Modal */}
                <NoteModal
                    isOpen={noteModalOpen}
                    initialNote={noteInitial}
                    onSave={handleSaveNote}
                    onClose={() => setNoteModalOpen(false)}
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