import React from 'react';

const LoadingStateDisplay: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-700">Loading Live Trip Mode...</p>
        </div>
    );
};

export default LoadingStateDisplay; 