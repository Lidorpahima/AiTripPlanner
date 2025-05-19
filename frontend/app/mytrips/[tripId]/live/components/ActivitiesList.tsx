import React from 'react';
import { CheckCircle, MessageSquarePlus, PlusCircle } from 'lucide-react';
import { LiveDay } from '../liveTypes'; // Changed import path for LiveDay
import ActivityItem from './ActivityItem';
import { ActivityNotesMap } from '../hooks/useActivityNotes';

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
    if (currentDayPlan.activities.length === 0) {
        return (
            <div className="text-center py-10 bg-white/50 rounded-lg shadow">
                <CheckCircle size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 text-lg">No activities planned for this day, or all completed!</p>
                <p className="text-sm text-gray-500 mt-1">Feel free to add something new.</p>
                <button
                    onClick={() => onOpenAddActivityChat(currentDayIndex, null)} // Add first activity
                    className="mt-4 flex items-center justify-center mx-auto px-3 py-1.5 border border-dashed border-blue-400 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                >
                    <MessageSquarePlus size={16} className="mr-1.5" /> Add First Activity
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
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
            {currentDayPlan.activities.map((activity, activityIndex) => {
                const isFirst = activityIndex === 0;
                const isLast = activityIndex === currentDayPlan.activities.length - 1;
                const isCurrent = false;
                return (
                    <React.Fragment key={activity.id}>
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