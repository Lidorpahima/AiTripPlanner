import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorStateDisplayProps {
    error: string | null;
    defaultMessage?: string;
}

const ErrorStateDisplay: React.FC<ErrorStateDisplayProps> = ({ error, defaultMessage = "Could not load trip data or current day's plan." }) => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
            <ArrowLeft size={24} className="absolute top-6 left-6 text-red-600 hover:text-red-800 cursor-pointer" onClick={() => router.push('/mytrips')} />
            <MapPin size={48} className="text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">Error Loading Live Mode</h1>
            <p className="text-red-600 mb-6">{error || defaultMessage}</p>
            <button
                onClick={() => router.push('/mytrips')}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Back to My Trips
            </button>
        </div>
    );
};

export default ErrorStateDisplay; 