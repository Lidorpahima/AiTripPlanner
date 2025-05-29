/**
 * NavigationTabs Component
 * 
 * A component that provides tab-based navigation for different sections of the trip plan.
 * Features include:
 * - Itinerary view
 * - Cost breakdown view
 * - Local tips view
 * - Active tab highlighting
 * - Smooth transitions
 * - Responsive design
 * - Clean, pill-shaped design
 */

import React from "react";

/**
 * Props interface for NavigationTabs component
 * @property activeTab - Currently active tab identifier
 * @property setActiveTab - Callback function to change the active tab
 */
interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/**
 * NavigationTabs Component
 * 
 * Renders a set of navigation tabs for switching between different views
 * of the trip plan, with visual feedback for the active tab.
 */
const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mb-8 mt-10">
      <div className="bg-white rounded-full shadow-md p-1 border border-gray-200 flex">
        {/* Itinerary tab */}
        <button
          className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
            activeTab === 'itinerary' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('itinerary')}
        >
          Itinerary
        </button>
        {/* Cost breakdown tab */}
        <button
          className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
            activeTab === 'costs' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('costs')}
        >
          Cost Breakdown
        </button>
        {/* Local tips tab */}
        <button
          className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
            activeTab === 'tips' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('tips')}
        >
          Local Tips
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
