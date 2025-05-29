/**
 * ActivitiesList Component
 * 
 * A component that displays a list of activities for a given day in the trip plan.
 * Features include:
 * - Activity list rendering with completion status
 * - Add activity buttons between activities
 * - Empty state handling
 * - Activity highlighting
 * - Navigation and completion toggling
 * - Note management
 */

import React from 'react';
import { CheckCircle, MessageSquarePlus, PlusCircle } from 'lucide-react';
import { LiveDay } from '../liveTypes'; // Changed import path for LiveDay
import ActivityItem from './ActivityItem';
import { ActivityNotesMap } from '../hooks/useActivityNotes';

/**
 * Props interface for ActivitiesList component
 * @property currentDayPlan - The current day's plan containing activities
 * @property highlightedActivityId - ID of the currently highlighted activity
 * @property onToggleComplete - Callback for toggling activity completion
 * @property onNavigate - Callback for navigation to activity location
 * @property onOpenAddActivityChat - Callback for opening activity addition chat
 * @property currentDayIndex - Index of the current day
 * @property tripId - ID of the current trip
 * @property token - Authentication token
 * @property notes - Map of activity notes
 * @property setNotes - Function to update activity notes
 */
interface ActivitiesListProps {
    currentDayPlan: LiveDay;
    highlightedActivityId: string | null;
    onToggleComplete: (activityId: string) => void;
    onNavigate: (placeName: string | null | undefined) => void;
    onOpenAddActivityChat: (dayIndex: number, afterActivityId: string | null) => void;
    currentDayIndex: number;
    tripId: string;
    token: string;
    notes: ActivityNotesMap;
    setNotes: React.Dispatch<React.SetStateAction<ActivityNotesMap>>;
}

/**
 * ActivitiesList Component
 * 
 * Renders a list of activities for the current day, with options to:
 * - Add new activities between existing ones
 * - Toggle activity completion
 * - Navigate to activity locations
 * - Manage activity notes
 */
const ActivitiesList: React.FC<ActivitiesListProps> = ({
    currentDayPlan,
    highlightedActivityId,
    onToggleComplete,
    onNavigate,
    onOpenAddActivityChat,
    currentDayIndex,
    tripId,
    token,
    notes,
    setNotes,
}) => {
    // Empty state handling
    if (currentDayPlan.activities.length === 0) {
        return (
            <div className="text-center py-10 bg-white/50 rounded-lg shadow">
                <CheckCircle size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 text-lg">No activities planned for this day, or all completed!</p>
                <p className="text-sm text-gray-500 mt-1">Feel free to add something new.</p>
                <button
                    onClick={() => onOpenAddActivityChat(currentDayIndex, null)}
                    className="mt-4 flex items-center justify-center mx-auto px-3 py-1.5 border border-dashed border-blue-400 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                >
                    <MessageSquarePlus size={16} className="mr-1.5" /> Add First Activity
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Add activity button at the top */}
            <div className="flex items-center my-2">
                <div className="flex-grow border-t border-gray-200" />
                <button
                    onClick={() => onOpenAddActivityChat(currentDayIndex, null)}
                    className="mx-3 flex items-center justify-center w-8 h-8 bg-white border border-blue-300 hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Add Activity"
                    title="Add Activity"
                >
                    <PlusCircle size={22} />
                </button>
                <div className="flex-grow border-t border-gray-200" />
            </div>

            {/* Activity list */}
            {currentDayPlan.activities.map((activity, activityIndex) => {
                const isFirst = activityIndex === 0;
                const isLast = activityIndex === currentDayPlan.activities.length - 1;
                const isCurrent = false;
                return (
                    <React.Fragment key={activity.id}>
                        {/* Activity item */}
                        <ActivityItem
                            activity={activity}
                            isHighlighted={activity.id === highlightedActivityId}
                            isCurrent={isCurrent}
                            isFirst={isFirst}
                            isLast={isLast}
                            onToggleComplete={onToggleComplete}
                            onNavigate={onNavigate}
                            onOpenAddActivityChat={(afterActivityId) => onOpenAddActivityChat(currentDayIndex, afterActivityId)}
                            dayIndex={currentDayIndex}
                            activityIndex={activityIndex}
                            tripId={tripId}
                            token={token}
                            notes={notes}
                            setNotes={setNotes}
                        />
                        
                        {/* Add activity button between activities */}
                        <div className="flex items-center my-2">
                            <div className="flex-grow border-t border-blue-400" />
                            <button
                                onClick={() => onOpenAddActivityChat(currentDayIndex, activity.id)}
                                className="mx-3 flex items-center justify-center w-8 h-8 bg-white border border-blue-300 hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                                aria-label="Add Activity"
                                title="Add Activity"
                            >
                                <PlusCircle size={22} />
                            </button>
                            <div className="flex-grow border-t border-blue-400" />
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ActivitiesList; 