/**
 * LiveTripHeader Component
 * 
 * A header component for the live trip mode that displays trip information and navigation.
 * Features include:
 * - Trip title display
 * - Back navigation
 * - Sticky positioning
 * - Responsive design
 * - Fallback to destination name
 */

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Props interface for LiveTripHeader component
 * @property tripTitle - Title of the current trip
 * @property tripDestination - Destination of the trip (used as fallback if title is not available)
 */
interface LiveTripHeaderProps {
    tripTitle: string | undefined;
    tripDestination: string | undefined;
}

/**
 * LiveTripHeader Component
 * 
 * Renders a sticky header with trip information and a back navigation button.
 * Provides consistent navigation and context throughout the live trip mode.
 */
const LiveTripHeader: React.FC<LiveTripHeaderProps> = ({ tripTitle, tripDestination }) => {
    const router = useRouter();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Back navigation button */}
                <button onClick={() => router.push('/mytrips')} className="text-blue-600 hover:text-blue-800 flex items-center">
                    <ArrowLeft size={20} className="mr-1" />
                    Back to Trips
                </button>

                {/* Trip title with fallback to destination */}
                <h1 className="text-xl font-bold text-gray-800 truncate">
                    {tripTitle || tripDestination}
                </h1>

                {/* Spacer for layout balance */}
                <div className="w-10 sm:w-20">{/* Spacer for Back button */}</div>
            </div>
        </header>
    );
};

export default LiveTripHeader; 