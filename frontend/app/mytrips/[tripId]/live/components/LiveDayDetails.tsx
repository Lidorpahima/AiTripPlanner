import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface LiveDayDetailsProps {
    currentDayPlanTitle: string | undefined;
    currentDayIndex: number;
    totalDays: number;
    onNavigateToDay: (dayIndex: number) => void;
}

const LiveDayDetails: React.FC<LiveDayDetailsProps> = ({
    currentDayPlanTitle,
    currentDayIndex,
    totalDays,
    onNavigateToDay,
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-md p-3 sm:p-5 rounded-xl shadow-lg mb-6">
            <div className="flex flex-col sm:flex-row items-center text-gray-700 mb-1">
                <CalendarDays size={20} className="mr-2 text-blue-600 mb-2 sm:mb-0" />
                <div className="flex-grow flex flex-col sm:flex-row items-center justify-between w-full">
                    <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left mb-2 sm:mb-0">
                        {currentDayPlanTitle || `Day Details`}
                    </h2>
                    {totalDays > 1 && (
                        <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => onNavigateToDay(currentDayIndex - 1)}
                                disabled={currentDayIndex === 0}
                                className="p-2 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 transition-colors"
                                aria-label="Previous day"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-xs sm:text-sm text-gray-700 font-medium px-1 sm:px-2 py-1 min-w-[80px] text-center">
                                Day {currentDayIndex + 1} / {totalDays}
                            </span>
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
            <p className="text-xs sm:text-sm text-gray-500 sm:ml-7 text-center sm:text-left">Currently viewing plan for today. Tap items to mark as done or navigate.</p>
        </div>
    );
};

export default LiveDayDetails; 