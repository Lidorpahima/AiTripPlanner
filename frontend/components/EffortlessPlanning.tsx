/**
 * Effortless Planning Component
 * 
 * A detailed itinerary preview component that showcases a sample day's activities
 * in a mobile-friendly format. Features:
 * - Trip summary with dates and weather
 * - Daily schedule with time slots
 * - Activity details with AI recommendations
 * - Interactive buttons for details, booking, and maps
 * - Visual indicators for activity types and importance
 */

'use client';

import React from 'react';

/**
 * Interface for activity details
 */
interface Activity {
  time: string;
  title: string;
  description: string;
  type: 'Local' | 'Must See' | 'AI Suggested';
  actions: {
    primary?: string;
    secondary?: string;
  };
  aiTip?: string;
}

/**
 * Interface for trip summary information
 */
interface TripSummary {
  startDate: string;
  endDate: string;
  duration: string;
  weather: string;
}

/**
 * EffortlessPlanning Component
 * 
 * Displays a sample itinerary for a day in Tokyo, showcasing the app's
 * ability to create detailed, AI-optimized travel plans.
 */
const EffortlessPlanning: React.FC = () => {
  /**
   * Sample trip summary data
   */
  const tripSummary: TripSummary = {
    startDate: 'May 8',
    endDate: 'May 14',
    duration: '6 🗓️',
    weather: '24°C ☀️'
  };

  /**
   * Sample activities for the day
   */
  const activities: Activity[] = [
    {
      time: '09:00',
      title: 'Traditional Tea Ceremony 🍵',
      description: 'Experience authentic Japanese tea culture',
      type: 'Local',
      actions: {
        primary: 'Details',
        secondary: 'Book Now'
      }
    },
    {
      time: '11:30',
      title: 'Senso-ji Temple & Market 🛍️',
      description: 'Ancient temple & vibrant shopping street',
      type: 'Must See',
      actions: {
        primary: 'Photos',
        secondary: 'Map'
      }
    },
    {
      time: '14:00',
      title: 'River Cruise & Skyline 🚢',
      description: 'Scenic cruise on the Sumida River',
      type: 'AI Suggested',
      actions: {},
      aiTip: 'Best sunset views between 16:00-17:00'
    }
  ];

  return (
                <div className="h-full overflow-hidden">
                  <div className="p-3">
        {/* Trip Title */}
                    <h2 className="text-lg font-bold text-center mb-2">Your Tokyo Adventure 🗼</h2>

        {/* Trip Summary Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="bg-blue-50 p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-blue-600">Start</div>
            <div className="font-semibold text-xs">{tripSummary.startDate}</div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-blue-600">End</div>
            <div className="font-semibold text-xs">{tripSummary.endDate}</div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-blue-600">Days</div>
            <div className="font-semibold text-xs">{tripSummary.duration}</div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-blue-600">Weather</div>
            <div className="font-semibold text-xs">{tripSummary.weather}</div>
                      </div>
                    </div>

        {/* Day Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-2 mb-2 text-sm">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Day 3: Cultural Exploration 🏯</h3>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">AI Optimized</span>
                      </div>
                    </div>

        {/* Activities List */}
                    <div className="space-y-2">
          {activities.map((activity, index) => (
            <div key={index} className={index < activities.length - 1 ? "border-b pb-2" : ""}>
              {/* Activity Header */}
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700 text-xs flex items-center">
                  <span className="w-4 h-4 inline-flex items-center justify-center bg-purple-100 text-purple-500 rounded mr-1">
                    {index + 1}
                  </span>
                  {activity.time}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activity.type === 'Local' ? 'bg-green-100 text-green-600' :
                  activity.type === 'Must See' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'Local' ? "Local's Choice" :
                   activity.type === 'Must See' ? "Must See!" :
                   "AI Suggested"}
                          </span>
                      </div>

              {/* Activity Details */}
                        <div className="flex items-start">
                          <div>
                  <p className="text-gray-800 text-xs font-medium">{activity.title}</p>
                  <p className="text-gray-600 text-xs">{activity.description}</p>
                  
                  {/* Action Buttons */}
                  {activity.actions && (
                            <div className="flex gap-1 mt-1">
                      {activity.actions.primary && (
                              <button className="text-[10px] text-blue-600 font-medium border border-blue-200 rounded px-2 py-0.5 flex items-center gap-1">
                          <span>{activity.actions.primary}</span>
                              </button>
                      )}
                      {activity.actions.secondary && (
                        <button className={`text-[10px] font-medium border rounded px-2 py-0.5 flex items-center gap-1 ${
                          activity.actions.secondary === 'Book Now' ? 'text-green-600 border-green-200' :
                          'text-red-600 border-red-200'
                        }`}>
                          <span>{activity.actions.secondary}</span>
                              </button>
                      )}
                            </div>
                  )}

                  {/* AI Tip */}
                  {activity.aiTip && (
                            <div className="mt-1 bg-gray-50 rounded p-1">
                              <p className="text-[10px] text-purple-600">
                        <span className="font-medium">AI Tip:</span> {activity.aiTip}
                              </p>
                            </div>
                  )}
                          </div>
                        </div>
                      </div>
          ))}
                    </div>
                  </div>
                </div> 
  );
};

export default EffortlessPlanning; 