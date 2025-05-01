import React from "react";

interface CostBreakdownCardProps {
  icon: React.ReactNode;
  label: string;
  min: number;
  max: number;
  formatCurrency: (amount: number, currency?: string) => string;
  colorClass: string; // Tailwind background color class, e.g., 'bg-blue-600'
}

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
      {/* Visual bar container */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full">
        {/* Colored bar representing the average cost relative to max */}
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