/**
 * CostBreakdownCard Component
 * 
 * A component that displays a single cost category breakdown with a visual progress bar.
 * Features include:
 * - Category icon and label
 * - Min-max cost range display
 * - Visual progress bar
 * - Custom color theming
 * - Responsive design
 * - Currency formatting
 */

import React from "react";

/**
 * Props interface for CostBreakdownCard component
 * @property icon - React node for the category icon
 * @property label - Text label for the cost category
 * @property min - Minimum cost estimate
 * @property max - Maximum cost estimate
 * @property formatCurrency - Function to format currency values
 * @property colorClass - Tailwind CSS class for the progress bar color
 */
interface CostBreakdownCardProps {
  icon: React.ReactNode;
  label: string;
  min: number;
  max: number;
  formatCurrency: (amount: number, currency?: string) => string;
  colorClass: string;
}

/**
 * CostBreakdownCard Component
 * 
 * Renders a single cost category breakdown with a visual progress bar
 * showing the relative cost range within the total budget.
 */
const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({ icon, label, min, max, formatCurrency, colorClass }) => {
  return (
    <div className="mb-4">
      {/* Category header with icon, label and cost range */}
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 flex items-center">
          {icon} {label}
        </span>
        <span className="font-medium">
          {formatCurrency(min)} - {formatCurrency(max)}
        </span>
      </div>
      {/* Visual progress bar showing relative cost */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full`}
          style={{ width: `${((min + max) / 2 / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CostBreakdownCard;
