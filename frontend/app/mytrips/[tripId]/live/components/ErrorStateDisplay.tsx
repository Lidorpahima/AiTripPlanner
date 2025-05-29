/**
 * ErrorStateDisplay Component
 * 
 * A user-friendly error display component for the live trip mode.
 * Features include:
 * - Clear error messaging
 * - Navigation back to trips list
 * - Visual error indicators
 * - Responsive design
 * - Customizable error messages
 */

import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Props interface for ErrorStateDisplay component
 * @property error - The error message to display
 * @property defaultMessage - Optional default error message if none is provided
 */
interface ErrorStateDisplayProps {
    error: string | null;
    defaultMessage?: string;
}

/**
 * ErrorStateDisplay Component
 * 
 * Renders a full-screen error state with navigation options and visual indicators.
 * Provides a way for users to return to the trips list when errors occur.
 */
const ErrorStateDisplay: React.FC<ErrorStateDisplayProps> = ({ error, defaultMessage = "Could not load trip data or current day's plan." }) => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
            {/* Back navigation button */}
            <ArrowLeft size={24} className="absolute top-6 left-6 text-red-600 hover:text-red-800 cursor-pointer" onClick={() => router.push('/mytrips')} />
            
            {/* Error icon */}
            <MapPin size={48} className="text-red-500 mb-4" />
            
            {/* Error message */}
            <h1 className="text-2xl font-bold text-red-700 mb-2">Error Loading Live Mode</h1>
            <p className="text-red-600 mb-6">{error || defaultMessage}</p>
            
            {/* Return to trips button */}
            <button
                onClick={() => router.push('/mytrips')}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Back to My Trips
            </button>
        </div>
    );
};

export default ErrorStateDisplay; 