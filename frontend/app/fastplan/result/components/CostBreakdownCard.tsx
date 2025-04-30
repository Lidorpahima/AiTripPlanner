import React from "react";

interface CostBreakdownCardProps {
  icon: React.ReactNode;
  label: string;
  min: number;
  max: number;
  formatCurrency: (amount: number, currency?: string) => string;
  colorClass: string;
}

const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({ icon, label, min, max, formatCurrency, colorClass }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 flex items-center">
          {icon} {label}
        </span>
        <span className="font-medium">
          {formatCurrency(min)} - {formatCurrency(max)}
        </span>
      </div>
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
