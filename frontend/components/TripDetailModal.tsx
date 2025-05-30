/**
 * Trip Detail Modal Component
 * 
 * A modal dialog that displays detailed information about a saved trip.
 * Features:
 * - Trip destination and title display
 * - Date range information
 * - Trip summary section
 * - Daily itinerary breakdown
 * - Activity details with times and locations
 * - Responsive design with scrollable content
 * - Click-outside-to-close functionality
 */

import React from 'react';
import { X, MapPin, Calendar, Info } from 'lucide-react'; // Import icons
import { SavedTripData } from '@/app/mytrips/page'; 

/**
 * Props interface for the TripDetailModal component
 * @property trip - The saved trip data to display
 * @property onClose - Function to call when the modal should close
 */
interface TripDetailModalProps {
    trip: SavedTripData;
    onClose: () => void;
}

/**
 * TripDetailModal Component
 * 
 * Renders a modal dialog showing comprehensive trip details including
 * destination, dates, summary, and daily itinerary.
 */
const TripDetailModal: React.FC<TripDetailModalProps> = ({ trip, onClose }) => {

    /**
     * Formats a date string into a localized date format
     * @param dateString - The date string to format
     * @returns Formatted date string or 'N/A' if invalid
     */
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString(undefined, { // Use locale default format
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return 'Invalid Date';
        }
    };

    /**
     * Renders a single day's plan with its activities
     * @param day - The day's plan data
     * @param index - The index of the day in the itinerary
     * @returns JSX element representing the day's plan
     */
    const renderDayPlan = (day: any, index: number) => {
        // Check if 'day' has expected properties. Adjust based on your actual plan_json structure
        if (!day || typeof day !== 'object') {
            return <li key={index} className="text-red-500">Invalid day data</li>;
        }

        const dayTitle = day.day || `Day ${index + 1}`; // Fallback title

        return (
            <div key={index} className="mb-4 p-3 border rounded bg-gray-50">
                <h4 className="text-md font-semibold mb-2 text-blue-700">{dayTitle}</h4>
                {/* Activities List */}
                {day.activities && Array.isArray(day.activities) && day.activities.length > 0 ? (
                <ul className="space-y-3">
                    {day.activities.map((activity: any, actIndex: number) => (
                        <li
                            key={actIndex}
                            className="flex flex-col p-4 border rounded-lg shadow-sm bg-white hover:bg-indigo-50 transition duration-200"
                        >
                            {/* Activity Time */}
                            <div className="flex items-center justify-between mb-2">
                                {activity.time && <span className="text-indigo-700 font-bold text-sm">{activity.time}</span>}
                            </div>
                            {/* Activity Description */}
                            <span className="text-gray-800 text-base leading-relaxed">
                                {activity.description}
                            </span>
                            {/* Activity Location */}
                            {activity.place_name_for_lookup && (
                                <span className="text-sm text-gray-500 italic mt-1">
                                    ({activity.place_name_for_lookup})
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 italic">No activities available for this day.</p>
            )}
            </div>
        );
    };

    return (
        // Modal Overlay with Backdrop Blur
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm pt-10"
            onClick={onClose} // Close modal on overlay click
        >
            {/* Modal Content Container */}
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 m-4 relative pt"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                {/* Modal Header with Destination and Dates */}
                <div className="border-b pb-3 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                        <MapPin size={24} className="mr-2 text-blue-600 shrink-0" />
                        {trip.destination || "Trip Details"}
                        {trip.title && <span className="ml-2 text-base font-normal text-gray-500">({trip.title})</span>}
                    </h2>
                    {(trip.start_date || trip.end_date) && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <Calendar size={14} className="mr-1.5 shrink-0" />
                            {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </p>
                    )}
                </div>

                {/* Modal Body - Plan Details */}
                <div className="space-y-4">
                    {/* Trip Summary Section */}
                    {trip.plan_json?.summary && (
                        <div className="p-3 border rounded bg-blue-50 border-blue-200">
                             <h3 className="text-lg font-semibold mb-2 text-blue-800 flex items-center">
                                 <Info size={18} className="mr-1.5" /> Summary
                             </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{trip.plan_json.summary}</p>
                        </div>
                    )}

                    {/* Daily Itinerary Section */}
                    {trip.plan_json?.days && Array.isArray(trip.plan_json.days) && trip.plan_json.days.length > 0 ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Daily Plan</h3>
                            <div className="space-y-3">
                                {trip.plan_json.days.map(renderDayPlan)}
                            </div>
                        </div>
                    ) : (
                        !trip.plan_json?.summary && ( // Show only if summary is also missing
                             <p className="text-gray-500 italic">No detailed plan available for this trip.</p>
                        )
                    )}

                    {/* Empty Plan Fallback */}
                    {!trip.plan_json || (Object.keys(trip.plan_json).length === 0 && trip.plan_json.constructor === Object) ? (
                        <p className="text-gray-500 italic">Plan data is missing or empty.</p>
                    ) : null}
                </div>

                {/* Modal Footer with Close Button */}
                <div className="border-t pt-3 mt-5 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripDetailModal;