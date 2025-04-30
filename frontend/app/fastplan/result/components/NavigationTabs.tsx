import React from "react";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mb-8 mt-10">
      <div className="bg-white rounded-full shadow-md p-1 border border-gray-200 flex">
        <button
          className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
            activeTab === 'itinerary' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('itinerary')}
        >
          Itinerary
        </button>
        <button
          className={`px-6 py-2 rounded-full transition-all font-medium text-sm ${
            activeTab === 'costs' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('costs')}
        >
          Cost Breakdown
        </button>
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
