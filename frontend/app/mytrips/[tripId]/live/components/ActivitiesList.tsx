import React from 'react';
import { CheckCircle, MessageSquarePlus } from 'lucide-react';
import { LiveDay } from '../liveTypes'; // Changed import path for LiveDay
import ActivityItem from './ActivityItem';
// LiveActivity will be inferred from ActivityItem's props or implicitly via currentDayPlan.activities

interface ActivitiesListProps {
    currentDayPlan: LiveDay;
    highlightedActivityId: string | null;
    onToggleComplete: (activityId: string) => void;
    onNavigate: (placeName: string | null | undefined) => void;
    onOpenAddActivityChat: (dayIndex: number, afterActivityId: string | null) => void;
    currentDayIndex: number;
}

const ActivitiesList: React.FC<ActivitiesListProps> = ({
    currentDayPlan,
    highlightedActivityId,
    onToggleComplete,
    onNavigate,
    onOpenAddActivityChat,
    currentDayIndex,
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
            {currentDayPlan.activities.map((activity) => (
                <ActivityItem
                    key={activity.id}
                    activity={activity}
                    isHighlighted={activity.id === highlightedActivityId}
                    onToggleComplete={onToggleComplete}
                    onNavigate={onNavigate}
                    onOpenAddActivityChat={(afterActivityId) => onOpenAddActivityChat(currentDayIndex, afterActivityId)}
                    currentDayIndex={currentDayIndex} // Though onOpenAddActivityChat in ActivityItem now directly uses activity.id
                />
            ))}
        </div>
    );
};

export default ActivitiesList; 