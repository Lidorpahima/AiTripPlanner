/**
 * PlaceDetailsPopup Component
 * 
 * A modal dialog that displays detailed information about a place from Google Maps.
 * Features include:
 * - Photo gallery with navigation
 * - Place information (name, address, rating)
 * - Contact details (phone, website)
 * - Opening hours
 * - User reviews
 * - Google Maps integration
 * - Loading and error states
 * - Responsive design
 * - Keyboard accessibility
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog } from '@headlessui/react';
import { X, ChevronLeft, ChevronRight, ImageIcon, MapPin, Phone, Globe, Clock, Star, MessageSquare } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * Props interface for PlaceDetailsPopup component
 * @property details - Place details data or loading/error state
 * @property onClose - Callback function to close the popup
 * @property placeNameQuery - Name of the place being displayed
 */
interface PlaceDetailsPopupProps {
    details: PlaceDetailsData | 'loading' | 'error';
    onClose: () => void;
    placeNameQuery: string;
}

/**
 * Review data structure from Google Maps API
 */
interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: string;
};

/**
 * Place details data structure from Google Maps API
 */
interface PlaceDetailsData {
  name: string;
  address: string | null; 
  rating?: number | null; 
  total_ratings?: number | null;
  phone?: string | null;
  website?: string | null; 
  price_level?: number | null; 
  location: { lat: number; lng: number } | null; 
  photos: string[]; 
  opening_hours: string[]; 
  reviews: Review[];
};

/**
 * PlaceDetailsPopup Component
 * 
 * Renders a modal dialog with detailed information about a place,
 * including photos, contact information, opening hours, and reviews.
 */
const PlaceDetailsPopup: React.FC<PlaceDetailsPopupProps> = ({ details, onClose, placeNameQuery }) => {
    // State for photo gallery navigation
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const router = useRouter();
    
    /**
     * Extracts photo reference from Google Maps URL
     * @param url - Google Maps photo URL
     * @returns Photo reference string or null
     */
    const getPhotoReference = (url: string): string | null => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('photoreference');
        } catch (e) {
            return null;
        }
    };
    
    /**
     * Creates a proxied URL for the photo to avoid CORS issues
     * @param googlePhotoUrl - Original Google Maps photo URL
     * @returns Proxied photo URL or loading image
     */
    const getProxiedPhotoUrl = (googlePhotoUrl: string): string => {
        const photoRef = getPhotoReference(googlePhotoUrl);
        if (!photoRef) return '/images/loading.gif';
        return `${API_BASE}/api/place-photo/?photo_reference=${photoRef}&maxwidth=800`;
    };
    
    /**
     * Handles photo navigation in the gallery
     * @param direction - 'next' or 'prev' to indicate navigation direction
     */
    const handlePhotoChange = (direction: 'next' | 'prev') => {
        if (typeof details !== 'object' || !details.photos || details.photos.length === 0) return;
        setCurrentPhotoIndex(prev => {
            const newIndex = direction === 'next' ? prev + 1 : prev - 1;
            if (newIndex >= details.photos.length) return 0;
            if (newIndex < 0) return details.photos.length - 1;
            return newIndex;
        });
    };

    // Reset photo index when details change
    useEffect(() => {
        setCurrentPhotoIndex(0);
    }, [details]);

    // Loading state
    if (details === 'loading') {
        return (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <p className="font-semibold">Loading details for {placeNameQuery}...</p>
                    <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                    <button onClick={onClose} className="mt-4 text-sm text-gray-600 hover:text-black">Cancel</button>
                </div>
            </div>
        );
    }

    // Error state
    if (details === 'error') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <p className="font-semibold text-red-600">Could not load details</p>
                    <p className="text-sm text-gray-700 mb-4">Failed to fetch details for "{placeNameQuery}". The place might not be found on Google Maps or there was a network issue.</p>
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded text-sm">Close</button>
                </div>
            </div>
        );
    }

    // Extract place details
    const { name, address, rating, total_ratings, phone, website, photos, opening_hours, reviews, location } = details;
    const currentPhotoUrl = photos?.[currentPhotoIndex];
    const proxiedPhotoUrl = currentPhotoUrl ? getProxiedPhotoUrl(currentPhotoUrl) : null;
    const mapLink = location
        ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || name)}`;

    return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-black p-1 rounded-full">
                <X size={20} />
                </button>
            </div>
            <div className="overflow-y-auto p-4 flex-grow">
                {/* Photo Gallery */}
                {photos && photos.length > 0 && (
                <div className="relative mb-4 rounded-lg overflow-hidden">
                    <Image
                    key={proxiedPhotoUrl}
                    src={proxiedPhotoUrl || '/images/loading.gif'}
                    alt={`${name} photo ${currentPhotoIndex + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        console.error("Image failed to load:", proxiedPhotoUrl);
                        e.currentTarget.src = '/images/loading.gif';
                    }}
                    unoptimized={process.env.NODE_ENV === 'development'}
                    />
                    {/* Photo Navigation */}
                    {photos.length > 1 && (
                    <>
                        <button
                        onClick={() => handlePhotoChange('prev')}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60"
                        aria-label="Previous photo"
                        >
                        <ChevronLeft size={20} />
                        </button>
                        <button
                        onClick={() => handlePhotoChange('next')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60"
                        aria-label="Next photo"
                        >
                        <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">
                        {currentPhotoIndex + 1} / {photos.length}
                        </div>
                    </>
                    )}
                </div>
                )}
                {/* No Photos State */}
                {!photos || photos.length === 0 && (
                <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                    <ImageIcon size={24} className="mx-auto mb-1" />
                    No photos available.
                </div>
                )}
                {/* Place Information */}
                <div className="space-y-2 text-sm mb-4">
                {/* Rating */}
                {rating && total_ratings && (
                    <div className="flex items-center text-yellow-500">
                    <Star size={16} className="mr-1 fill-current" />
                    <strong>{rating.toFixed(1)}</strong>
                    <span className="text-gray-600 ml-1">({total_ratings} reviews)</span>
                    </div>
                )}
                {/* Address */}
                {address && (
                    <div className="flex items-start">
                    <MapPin size={16} className="mr-2 mt-0.5 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-800">{address}</span>
                    <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:underline text-xs whitespace-nowrap"
                        title="View on Google Maps"
                    >
                        (View Map)
                    </a>
                    </div>
                )}
                {/* Phone */}
                {phone && (
                    <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-600" />
                    <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
                    </div>
                )}
                {/* Website */}
                {website && (
                    <div className="flex items-center">
                    <Globe size={16} className="mr-2 text-gray-600" />
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                        {website.replace(/^https?:\/\//, '')}
                    </a>
                    </div>
                )}
                </div>
                {/* Opening Hours */}
                {opening_hours && opening_hours.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-1 flex items-center">
                    <Clock size={16} className="mr-1 text-gray-600" /> Opening Hours
                    </h4>
                    <ul className="text-xs text-gray-700 list-disc list-inside pl-2 space-y-0.5">
                    {opening_hours.map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                </div>
                )}
                {/* Reviews */}
                {reviews && reviews.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <MessageSquare size={16} className="mr-1 text-gray-600" /> Reviews
                    </h4>
                    <div className="space-y-3">
                    {reviews.map((review, index) => (
                        <div key={index} className="border-t pt-2 text-xs">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-medium text-gray-800">{review.author_name}</span>
                            <div className="flex items-center text-yellow-500">
                            <Star size={12} className="mr-0.5 fill-current" /> {review.rating}/5
                            </div>
                        </div>
                        <p className="text-gray-700 mb-1">{review.text}</p>
                        <p className="text-gray-500 text-right text-[10px]">{review.time}</p>
                        </div>
                    ))}
                    </div>
                </div>
                )}
                {/* No Reviews State */}
                {!reviews || reviews.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-2">No reviews available.</div>
                )}
            </div>
            </div>
        </div>
        </div>
    </Dialog>
    );
};

export default PlaceDetailsPopup;
