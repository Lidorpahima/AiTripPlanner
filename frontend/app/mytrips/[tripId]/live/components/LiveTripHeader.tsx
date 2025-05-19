import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LiveTripHeaderProps {
    tripTitle: string | undefined;
    tripDestination: string | undefined;
}

const LiveTripHeader: React.FC<LiveTripHeaderProps> = ({ tripTitle, tripDestination }) => {
    const router = useRouter();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <button onClick={() => router.push('/mytrips')} className="text-blue-600 hover:text-blue-800 flex items-center">
                    <ArrowLeft size={20} className="mr-1" />
                    Back to Trips
                </button>
                <h1 className="text-xl font-bold text-gray-800 truncate">
                    {tripTitle || tripDestination}
                </h1>
                <div className="w-10 sm:w-20">{/* Spacer for Back button */}</div>
            </div>
        </header>
    );
};

export default LiveTripHeader; 