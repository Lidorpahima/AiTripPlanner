/**
 * Cost Breakdown Card Component
 * 
 * A reusable component that displays a cost breakdown item with a visual bar representation.
 * Features:
 * - Icon and label display
 * - Min-max cost range
 * - Visual progress bar
 * - Customizable colors
 * - Accessible progress bar with ARIA attributes
 * - Responsive design
 */

import React from "react";

/**
 * Props interface for the CostBreakdownCard component
 * @property icon - React node for the category icon
 * @property label - Text label for the cost category
 * @property min - Minimum cost value
 * @property max - Maximum cost value
 * @property formatCurrency - Function to format currency values
 * @property colorClass - Tailwind CSS class for the progress bar color
 */
interface CostBreakdownCardProps {
  icon: React.ReactNode;
  label: string;
  min: number;
  max: number;
  formatCurrency: (amount: number, currency?: string) => string;
  colorClass: string; // Tailwind background color class, e.g., 'bg-blue-600'
}

/**
 * CostBreakdownCard Component
 * 
 * Renders a card showing a cost category with its range and a visual representation.
 * The progress bar width is calculated based on the average of min and max values.
 */
const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({ 
  icon, 
  label, 
  min, 
  max, 
  formatCurrency, 
  colorClass 
}) => {
  // Calculate the average percentage relative to the max for a simple visual bar
  // Avoid division by zero if max is 0
  const averagePercentage = max > 0 ? (((min + max) / 2) / max) * 100 : 0;
  // Ensure percentage is within 0-100 range
  const barWidthPercentage = Math.max(0, Math.min(100, averagePercentage));

  return (
    <div className="mb-4 last:mb-0"> {/* Remove bottom margin from the last card */}
      {/* Header with Icon, Label, and Cost Range */}
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="text-gray-700 flex items-center">
          {/* Ensure icon has consistent size */}
          <span className="inline-block w-4 h-4 mr-2 shrink-0">{icon}</span> 
          {label}
        </span>
        <span className="font-medium text-gray-800">
          {/* Display the range */}
          {formatCurrency(min)} - {formatCurrency(max)}
        </span>
      </div>
      {/* Progress Bar Container */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full">
        {/* Colored Progress Bar */}
        <div
          className={`h-full ${colorClass} rounded-full transition-width duration-500 ease-in-out`}
          style={{ width: `${barWidthPercentage}%` }} 
          role="progressbar"
          aria-valuenow={barWidthPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} cost estimate`}
        ></div>
      </div>
    </div>
  );
};

export default CostBreakdownCard;