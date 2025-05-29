/**
 * DailyProgressBar Component
 * 
 * A visual progress indicator that shows the completion status of daily activities.
 * Features include:
 * - Progress percentage calculation
 * - Animated progress bar
 * - Gradient color transition
 * - Responsive design
 * - Clear completion statistics
 */

import React from 'react';

/**
 * Props interface for DailyProgressBar component
 * @property completed - Number of completed activities
 * @property total - Total number of activities
 */
interface DailyProgressBarProps {
  completed: number;
  total: number;
}

/**
 * DailyProgressBar Component
 * 
 * Renders a progress bar showing the completion status of daily activities
 * with a percentage indicator and completion count.
 */
const DailyProgressBar: React.FC<DailyProgressBarProps> = ({ completed, total }) => {
  // Calculate completion percentage
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full mb-6">
      {/* Progress statistics */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-blue-700">
          {completed} out of {total} activities completed
        </span>
        <span className="text-xs text-blue-500 font-bold">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-blue-100 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-400 to-green-400 h-3 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DailyProgressBar; 