import { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { ChatMessage } from '@/app/fastplan/result/components/SideChatPanel';
import { ActivityBase, LiveActivity, LiveTripPlan, PlanJson } from '../liveTypes'; 
import { Activity as FastPlanActivity } from '@/constants/planTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SideChatContext {
    dayIndex: number;
    insertAfterActivityId: string | null;
}

interface UseSideChatProps {
    livePlan: LiveTripPlan | null;
    trip: any; // Consider using a more specific type if available, e.g., SavedTripData
    setLivePlan: React.Dispatch<React.SetStateAction<LiveTripPlan | null>>;
    setCurrentDayPlan: React.Dispatch<React.SetStateAction<any | null>>; // Consider LiveDay | null
}

export const useSideChat = ({ livePlan, trip, setLivePlan, setCurrentDayPlan }: UseSideChatProps) => {
    const [isSideChatOpen, setIsSideChatOpen] = useState(false);
    const [sideChatContext, setSideChatContext] = useState<SideChatContext | null>(null);
    const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
    const [sideChatLoading, setSideChatLoading] = useState(false);

    const handleOpenAddActivityChat = (dayIdx: number, afterActivityId: string | null) => {
        if (!livePlan || !livePlan.days[dayIdx]) {
            toast.error("Cannot open chat: Day data not found.");
            return;
        }
        setSideChatContext({ dayIndex: dayIdx, insertAfterActivityId: afterActivityId });

        const currentDayForChat = livePlan.days[dayIdx];
        let systemMessageText = `Adding a new activity for ${currentDayForChat.title || `Day ${dayIdx + 1}`}.`;
        if (afterActivityId) {
            const precedingActivity = currentDayForChat.activities.find(act => act.id === afterActivityId);
            if (precedingActivity) {
                systemMessageText += `\nThis will be after "${precedingActivity.description?.substring(0, 30)}...".`;
            }
        } else {
            systemMessageText += `\nThis will be the first activity of the day.`;
        }
        systemMessageText += "\nWhat would you like to add?";

        setConversationHistory([
            {
                id: `system-add-${Date.now()}`,
                text: systemMessageText,
                sender: 'system',
                timestamp: new Date(),
            }
        ]);
        setIsSideChatOpen(true);
    };

    const handleSideChatClose = () => {
        setIsSideChatOpen(false);
        setTimeout(() => {
            setSideChatContext(null);
            setConversationHistory([]);
            setSideChatLoading(false);
        }, 300);
    };

    const handleSideChatSubmitForAdd = async (message: string) => {
        if (!sideChatContext || !livePlan) {
            toast.error("Chat context is missing.");
            return;
        }

        const userMessage: ChatMessage = {
            id: `user-add-${Date.now()}`,
            text: message,
            sender: 'user',
            timestamp: new Date(),
        };
        setConversationHistory(prev => [...prev, userMessage]);
        setSideChatLoading(true);

        const { dayIndex, insertAfterActivityId } = sideChatContext;
        const dayDataForPrompt = livePlan.days[dayIndex];

        let previousActivityContext: ActivityBase | null = null;
        let nextActivityContext: ActivityBase | null = null;
        const activitiesForContext = dayDataForPrompt.activities;

        if (insertAfterActivityId === null) {
            if (activitiesForContext.length > 0) {
                nextActivityContext = activitiesForContext[0];
            }
        } else {
            const precedingIndex = activitiesForContext.findIndex(act => act.id === insertAfterActivityId);
            if (precedingIndex !== -1) {
                previousActivityContext = activitiesForContext[precedingIndex];
                if (precedingIndex + 1 < activitiesForContext.length) {
                    nextActivityContext = activitiesForContext[precedingIndex + 1];
                }
            }
        }

        const originalRequestData = (trip?.plan_json as PlanJson)?.original_request || {};
        const planJsonForAPI = trip?.plan_json ? { ...trip.plan_json } : {};

        const payload = {
            user_query: message,
            destination: trip?.destination || "",
            current_day_title: dayDataForPrompt.title || `Day ${dayIndex + 1}`,
            existing_activities_today: dayDataForPrompt.activities.map(a => ({ description: a.description, time: a.time })),
            insert_after_activity_description: previousActivityContext?.description || null,
            next_activity_description: nextActivityContext?.description || null,
            original_trip_preferences: {
                interests: originalRequestData.interests || [],
                pace: originalRequestData.pace || 'moderate',
                budget: originalRequestData.budget || 'Mid-range',
                tripStyle: originalRequestData.tripStyle || [],
                transportationMode: originalRequestData.transportationMode || 'Walking & Public Transit',
            },
            plan: planJsonForAPI,
        };

        try {
            const accessToken = Cookies.get('access');
            if (!accessToken) {
                throw new Error("Access token not found. Please log in again.");
            }

            const response = await fetch(`${API_BASE_URL}/api/chat-add-activity/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Failed to add activity. Please try again." }));
                throw new Error(errorData.detail || errorData.error || `Server error ${response.status}`);
            }

            const responseData = await response.json();
            const suggestedActivities: FastPlanActivity[] = responseData.activities;

            if (!suggestedActivities || suggestedActivities.length === 0) {
                throw new Error('No new activity suggestions received from AI.');
            }

            let aiIntroText = "Okay, how about this idea";
            if (previousActivityContext?.description || nextActivityContext?.description) {
                aiIntroText += " based on the current plan";
            }
            aiIntroText += ":";

            const aiMessage: ChatMessage = {
                id: `ai-add-${Date.now()}`,
                text: aiIntroText,
                sender: 'ai',
                timestamp: new Date(),
                suggestedActivities: suggestedActivities.map(act => ({ ...act, id: `temp-ai-${Date.now()}-${Math.random()}` }))
            };
            setConversationHistory(prev => [...prev, aiMessage]);

        } catch (e: any) {
            console.error("Error in side chat submit for add:", e);
            const errorMessage: ChatMessage = {
                id: `error-add-${Date.now()}`,
                text: e.message || "Could not get suggestion for adding activity.",
                sender: 'system',
                timestamp: new Date(),
            };
            setConversationHistory(prev => [...prev, errorMessage]);
            toast.error(e.message || "Could not get suggestion.");
        } finally {
            setSideChatLoading(false);
        }
    };

    const handleAcceptNewActivitySuggestion = (newActivity: FastPlanActivity) => {
        if (!sideChatContext || !livePlan || !livePlan.days[sideChatContext.dayIndex]) {
            toast.error("Cannot add activity: missing context or plan.");
            return;
        }
        const { dayIndex, insertAfterActivityId } = sideChatContext;

        setLivePlan(prevLivePlan => {
            if (!prevLivePlan) return null;

            const updatedDays = [...prevLivePlan.days];
            const targetDay = { ...updatedDays[dayIndex] };
            const newLiveActivity: LiveActivity = {
                ...newActivity,
                id: `live-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                is_completed: false,
                place_details: newActivity.place_details ? {
                    name: newActivity.place_details.name,
                    category: (newActivity.place_details as any).category,
                    price_level: newActivity.place_details.price_level === null ? undefined : newActivity.place_details.price_level,
                } : null,
            };

            let insertAtIndex = targetDay.activities.length;
            if (insertAfterActivityId === null) {
                insertAtIndex = 0;
            } else if (insertAfterActivityId) {
                const precedingActivityIndex = targetDay.activities.findIndex(act => act.id === insertAfterActivityId);
                if (precedingActivityIndex !== -1) {
                    insertAtIndex = precedingActivityIndex + 1;
                }
            }

            const updatedActivities = [...targetDay.activities];
            updatedActivities.splice(insertAtIndex, 0, newLiveActivity);
            targetDay.activities = updatedActivities;

            if (targetDay.day_cost_estimate && newLiveActivity.cost_estimate) {
                targetDay.day_cost_estimate = {
                    min: (targetDay.day_cost_estimate.min || 0) + (newLiveActivity.cost_estimate.min || 0),
                    max: (targetDay.day_cost_estimate.max || 0) + (newLiveActivity.cost_estimate.max || 0),
                    currency: targetDay.day_cost_estimate.currency || "USD",
                };
            } else if (newLiveActivity.cost_estimate) {
                targetDay.day_cost_estimate = { ...newLiveActivity.cost_estimate, currency: newLiveActivity.cost_estimate.currency || "USD" };
            }

            updatedDays[dayIndex] = targetDay;

            let updatedTotalCostEstimate = prevLivePlan.total_cost_estimate ? { ...prevLivePlan.total_cost_estimate } : null;
            if (updatedTotalCostEstimate && newLiveActivity.cost_estimate) {
                updatedTotalCostEstimate.min = (updatedTotalCostEstimate.min || 0) + (newLiveActivity.cost_estimate.min || 0);
                updatedTotalCostEstimate.max = (updatedTotalCostEstimate.max || 0) + (newLiveActivity.cost_estimate.max || 0);
            }

            return { ...prevLivePlan, days: updatedDays, total_cost_estimate: updatedTotalCostEstimate };
        });

        // This part needs careful handling as setCurrentDayPlan might not immediately reflect setLivePlan changes
        // Option 1: Update currentDayPlan based on the *newly updated* livePlan from the state updater function
        // This requires setLivePlan to complete and then derive currentDayPlan. 
        // For now, we rely on useEffect in the main component to update currentDayPlan when livePlan changes.
        // However, to ensure the UI for the current day updates immediately after adding:
        if (livePlan && livePlan.days[dayIndex]) { // Check if livePlan and the specific day exist
            const newUpdatedLivePlan = JSON.parse(JSON.stringify(livePlan)); // Create a deep copy to be safe
            const targetDayForUpdate = newUpdatedLivePlan.days[dayIndex];
            // Re-apply the insertion logic to this copy to get the immediate state of currentDayPlan
             const newLiveActivityForImmediateUpdate: LiveActivity = {
                ...newActivity,
                id: `live-${Date.now()}-immediate-${Math.random().toString(36).substring(2, 9)}`, // ensure different ID if needed or use one from newLiveActivity
                is_completed: false,
                place_details: newActivity.place_details ? {
                    name: newActivity.place_details.name,
                    category: (newActivity.place_details as any).category,
                    price_level: newActivity.place_details.price_level === null ? undefined : newActivity.place_details.price_level,
                } : null,
            };
            let insertAtIndexImmediate = targetDayForUpdate.activities.length;
            if (insertAfterActivityId === null) {
                insertAtIndexImmediate = 0;
            } else if (insertAfterActivityId) {
                const precedingActivityIndexImmediate = targetDayForUpdate.activities.findIndex((act:LiveActivity) => act.id === insertAfterActivityId);
                if (precedingActivityIndexImmediate !== -1) {
                    insertAtIndexImmediate = precedingActivityIndexImmediate + 1;
                }
            }
            targetDayForUpdate.activities.splice(insertAtIndexImmediate, 0, newLiveActivityForImmediateUpdate);
            if (targetDayForUpdate.day_cost_estimate && newActivity.cost_estimate) {
                 targetDayForUpdate.day_cost_estimate.min = (targetDayForUpdate.day_cost_estimate.min || 0) + (newActivity.cost_estimate.min || 0);
                 targetDayForUpdate.day_cost_estimate.max = (targetDayForUpdate.day_cost_estimate.max || 0) + (newActivity.cost_estimate.max || 0);
            } else if (newActivity.cost_estimate) {
                 targetDayForUpdate.day_cost_estimate = { ...newActivity.cost_estimate, currency: newActivity.cost_estimate.currency || "USD" };
            }
            setCurrentDayPlan(targetDayForUpdate);
        }


        toast.success(`Activity "${newActivity.description?.substring(0, 30)}..." added!`);
        handleSideChatClose();
    };

    const handleRejectSuggestionForAdd = (messageId: string) => {
        const followUpMessage: ChatMessage = {
            id: `system-add-reject-${Date.now()}`,
            text: "Okay, let's try something else. What specific changes or new ideas do you have?",
            sender: 'system',
            timestamp: new Date(),
        };
        setConversationHistory(prev => [...prev, followUpMessage]);
    };

    // Handler for when an individual suggested activity is rejected from the chat interface
    const handleRejectIndividualActivity = (activityToReject: FastPlanActivity, messageId: string) => {
        setConversationHistory(prev => prev.map(msg =>
            msg.id === messageId
                ? { ...msg, suggestedActivities: msg.suggestedActivities?.filter(act => (act as any).id !== (activityToReject as any).id) }
                : msg
        ).filter(msg => !(msg.id === messageId && msg.suggestedActivities && msg.suggestedActivities.length === 0))
        );
        toast.info(`Option "${activityToReject.description?.substring(0, 20)}..." dismissed.`);
    };


    return {
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
        setConversationHistory // Expose if direct manipulation is needed from parent, though usually not recommended
    };
}; 