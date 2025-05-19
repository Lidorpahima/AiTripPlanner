import React, { useState } from 'react';
import { MapPin, CheckCircle, Navigation, Plus, StickyNote } from 'lucide-react';
import { LiveActivity } from '../liveTypes'; 
import NoteModal from './NoteModal';
import { saveNote } from '../hooks/saveNote';

interface ActivityNotesMap {
  [key: string]: string;
}

interface ActivityItemProps {
    activity: LiveActivity;
    isHighlighted: boolean;
    isCurrent: boolean;
    isFirst: boolean;
    isLast: boolean;
    onToggleComplete: (activityId: string) => void;
    onNavigate: (placeName: string | null | undefined) => void;
    onOpenAddActivityChat: (afterActivityId: string | null) => void;
    dayIndex: number;
    activityIndex: number;
    tripId: string;
    token: string;
    notes: ActivityNotesMap;
    setNotes: React.Dispatch<React.SetStateAction<ActivityNotesMap>>;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
    activity,
    isHighlighted,
    isCurrent,
    isFirst,
    isLast,
    onToggleComplete,
    onNavigate,
    onOpenAddActivityChat,
    dayIndex,
    activityIndex,
    tripId,
    token,
    notes,
    setNotes,
}) => {
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    const noteKey = `${dayIndex}-${activityIndex}`;
    const note = notes[noteKey] || '';

    const handleSaveNote = async (newNote: string) => {
        await saveNote({ tripId, dayIndex, activityIndex, note: newNote, token });
        setNotes(prev => ({ ...prev, [noteKey]: newNote }));
    };

    return (
        <div className="flex items-start relative group">
            {/* Timeline bar and dot */}
            <div className="flex flex-col items-center mr-4">
                {!isFirst && (
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-300 to-blue-200 opacity-70"></div>
                )}
                <div className={`relative z-10 flex items-center justify-center ${isCurrent ? 'animate-pulse' : ''}`}
                    style={{ minHeight: 24 }}>
                    <div className={`rounded-full border-2 ${isCurrent ? 'border-green-500 bg-green-500' : isHighlighted ? 'border-indigo-500 bg-indigo-500' : 'border-blue-300 bg-white'} ${isCurrent ? 'w-5 h-5' : 'w-3 h-3'} transition-all`}></div>
                    {isCurrent && (
                        <span className="absolute left-full ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full shadow animate-fade-in">Now</span>
                    )}
                </div>
                {!isLast && (
                    <div className="w-1 h-4 bg-gradient-to-t from-blue-300 to-blue-200 opacity-70"></div>
                )}
            </div>
            {/* Activity Card */}
            <div
                className={`flex-1 rounded-lg shadow-md border transition-all duration-300 ease-in-out transform hover:shadow-lg 
                            ${activity.is_completed ? 'bg-green-50 border-green-200 opacity-70' : 'bg-white border-gray-200'}
                            ${isHighlighted && !activity.is_completed ? 'ring-2 ring-indigo-500 scale-102 shadow-xl' : ''}
                `}
            >
                <div className="p-4 flex items-start">
                    <button
                        onClick={() => onToggleComplete(activity.id)}
                        className={`mr-4 mt-1 p-1 rounded-full focus:outline-none focus:ring-2 
                                    ${activity.is_completed ? 'bg-green-500 text-white focus:ring-green-400' : 'border border-gray-400 text-gray-400 hover:border-blue-500 hover:text-blue-500 focus:ring-blue-300'}
                        `}
                        aria-label={activity.is_completed ? "Mark as not done" : "Mark as done"}
                    >
                        <CheckCircle size={22} />
                    </button>

                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <h3 className={`text-lg font-semibold ${activity.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {activity.description || "Unnamed Activity"}
                            </h3>
                            <div className="flex items-center space-x-2">
                                {activity.time && (
                                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full 
                                                    ${activity.is_completed ? 'text-gray-400 bg-gray-100' : 'text-blue-700 bg-blue-100'}
                                                    ${isHighlighted && !activity.is_completed ? 'ring-1 ring-indigo-500' : ''}
                                    `}>
                                        {activity.time}
                                    </span>
                                )}
                                {/* Note icon */}
                                <button
                                    className="ml-2 text-yellow-500 hover:text-yellow-600 focus:outline-none"
                                    title={note ? "Edit note" : "Add note"}
                                    onClick={() => setIsNoteModalOpen(true)}
                                >
                                    <StickyNote size={18} />
                                </button>
                            </div>
                        </div>
                        {activity.place_name_for_lookup && (
                            <p className={`text-xs mt-0.5 ${activity.is_completed ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                                <MapPin size={12} className="mr-1 shrink-0" /> {activity.place_name_for_lookup}
                            </p>
                        )}
                        {(activity.cost_estimate && (activity.cost_estimate.min > 0 || activity.cost_estimate.max > 0)) && (
                            <p className={`text-xs mt-0.5 ${activity.is_completed ? 'text-gray-400' : 'text-gray-500'}`}>
                                Est. Cost: {activity.cost_estimate.min}${'-'}{activity.cost_estimate.max}$ (USD)
                            </p>
                        )}
                        {/* Note preview */}
                        {note && (
                            <div className="mt-2 text-xs text-gray-700 bg-yellow-50 border-l-4 border-yellow-300 pl-2 py-1 rounded">
                                <span className="font-semibold text-yellow-700">Note:</span> {note}
                            </div>
                        )}
                    </div>
                </div>

                {!activity.is_completed && (
                    <div className="border-t border-gray-200 px-4 py-2 flex justify-end space-x-2 bg-gray-50 rounded-b-lg">
                        <button
                            onClick={() => onNavigate(activity.place_name_for_lookup)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center py-1 px-2 rounded hover:bg-blue-50"
                            disabled={!activity.place_name_for_lookup}
                        >
                            <Navigation size={14} className="mr-1" /> Navigate
                        </button>
                    </div>
                )}
            </div>
            {/* Note Modal */}
            <NoteModal
                isOpen={isNoteModalOpen}
                initialNote={note}
                onSave={handleSaveNote}
                onClose={() => setIsNoteModalOpen(false)}
            />
        </div>
    );
};

export default ActivityItem; 