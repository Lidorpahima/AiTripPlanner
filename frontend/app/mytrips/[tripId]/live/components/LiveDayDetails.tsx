/**
 * LiveDayDetails Component
 * 
 * A component that displays the current day's details and navigation controls in the live trip mode.
 * Features include:
 * - Day title display
 * - Day navigation controls
 * - Progress indicator
 * - Responsive design
 * - Accessibility support
 * - Visual feedback for navigation
 */

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Props interface for LiveDayDetails component
 * @property currentDayPlanTitle - Title of the current day's plan
 * @property currentDayIndex - Index of the current day (0-based)
 * @property totalDays - Total number of days in the trip
 * @property onNavigateToDay - Callback function for day navigation
 */
interface LiveDayDetailsProps {
    currentDayPlanTitle: string | undefined;
    currentDayIndex: number;
    totalDays: number;
    onNavigateToDay: (dayIndex: number) => void;
}

/**
 * LiveDayDetails Component
 * 
 * Renders a header section showing the current day's details with navigation controls
 * for moving between different days of the trip.
 */
const LiveDayDetails: React.FC<LiveDayDetailsProps> = ({
    currentDayPlanTitle,
    currentDayIndex,
    totalDays,
    onNavigateToDay,
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-md p-3 sm:p-5 rounded-xl shadow-lg mb-6">
            {/* Header section with calendar icon and title */}
            <div className="flex flex-col sm:flex-row items-center text-gray-700 mb-1">
                <CalendarDays size={20} className="mr-2 text-blue-600 mb-2 sm:mb-0" />
                <div className="flex-grow flex flex-col sm:flex-row items-center justify-between w-full">
                    {/* Day title */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left mb-2 sm:mb-0">
                        {currentDayPlanTitle || `Day Details`}
                    </h2>
                    
                    {/* Day navigation controls */}
                    {totalDays > 1 && (
                        <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-lg">
                            {/* Previous day button */}
                            <button
                                onClick={() => onNavigateToDay(currentDayIndex - 1)}
                                disabled={currentDayIndex === 0}
                                className="p-2 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 transition-colors"
                                aria-label="Previous day"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            {/* Day counter */}
                            <span className="text-xs sm:text-sm text-gray-700 font-medium px-1 sm:px-2 py-1 min-w-[80px] text-center">
                                Day {currentDayIndex + 1} / {totalDays}
                            </span>
                            
                            {/* Next day button */}
                            <button
                                onClick={() => onNavigateToDay(currentDayIndex + 1)}
                                disabled={currentDayIndex === totalDays - 1}
                                className="p-2 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 transition-colors"
                                aria-label="Next day"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Helper text */}
            <p className="text-xs sm:text-sm text-gray-500 sm:ml-7 text-center sm:text-left">
                Currently viewing plan for today. Tap items to mark as done or navigate.
            </p>
        </div>
    );
};

export default LiveDayDetails; 