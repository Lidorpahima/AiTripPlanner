import React from 'react';

interface DailyProgressBarProps {
  completed: number;
  total: number;
}

const DailyProgressBar: React.FC<DailyProgressBarProps> = ({ completed, total }) => {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-blue-700">
          {completed} out of {total} activities completed
        </span>
        <span className="text-xs text-blue-500 font-bold">{percent}%</span>
      </div>
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