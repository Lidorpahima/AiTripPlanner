'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Link from 'next/link'; 
import Image from 'next/image';
import { useAuth } from '@/app/(auth)/context/AuthContext'; 
import TripDetailModal from '@/components/TripDetailModal';
import { Loader, AlertTriangle, List, MapPin, Calendar, Eye, ImageOff } from 'lucide-react'; 

// Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// --- Type Definitions ---
export interface SavedTripData {
    id: number;
    destination: string;
    start_date: string | null;
    end_date: string | null;
    plan_json: { 
        summary?: string;
        days?: any[]; 
    };
    saved_at: string; 
    destination_image_urls?: string[] | null; 
    title?: string;     
}

// --- Page Component ---
export default function MyTripsPage() {
    const [trips, setTrips] = useState<SavedTripData[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);   
    const [selectedTrip, setSelectedTrip] = useState<SavedTripData | null>(null);
    const router = useRouter();
    const { isAuthenticated: isUserAuthenticated, logout } = useAuth(); 

    // --- Fetch Trips Effect ---
    useEffect(() => {
        const fetchMyTrips = async () => {
             // Wait if auth state is still loading
             if (isUserAuthenticated === null) { 
                 setIsLoading(true); // Keep showing loading
                 return; 
             }
             if (isUserAuthenticated === false) {
                 toast.error("Please log in to view your saved trips.");
                 router.push('/signin');
                 return;
             }

            // Proceed only if authenticated
            const token = Cookies.get('access');
            if (!token) {
                toast.error("Authentication token missing. Please log in.");
                logout?.(); 
                router.push('/signin');
                return;
            }

            setIsLoading(true);
            setError(null);

            const tryFetch = async (tokenToUse: string): Promise<SavedTripData[]> => {
                console.log("Attempting to fetch trips with access token:", tokenToUse.substring(0, 10) + "...");
                const response = await fetch(`${API_BASE}/api/my-trips/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenToUse}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include' 
                });

                if (response.status === 401) {
                    console.log("Access token expired or invalid. Attempting refresh...");
                    // Check cookies and localStorage for the refresh token
                    const cookieRefresh = Cookies.get('refresh');
                    const localStorageRefresh = localStorage.getItem('refreshToken');
                    const refresh = cookieRefresh || localStorageRefresh;
                    
                    console.log("Refresh token found in cookies:", cookieRefresh ? "Yes" : "No");
                    console.log("Refresh token found in localStorage:", localStorageRefresh ? "Yes" : "No");

                    if (!refresh) {
                        toast.error("Session expired. Please log in again.");
                        logout?.();
                        router.push('/signin');
                        throw new Error("Session expired. Please log in again.");
                    }

                    try {
                        // Log all request details for debugging
                        console.log("All cookies:", document.cookie);
                        console.log("Using refresh token (first 10 chars):", refresh.substring(0, 10) + "...");
                        console.log("Preparing refresh request to:", `${API_BASE}/api/token/refresh/`);
                        
                        // This is the correct format for DRF Simple JWT TokenObtainPairView
                        const refreshRequestBody = { refresh: refresh };
                        console.log("Request body:", JSON.stringify(refreshRequestBody));
                        
                        const refreshRes = await fetch(`${API_BASE}/api/token/refresh/`, {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(refreshRequestBody)
                        });

                        console.log("Refresh response status:", refreshRes.status);
                        
                        if (!refreshRes.ok) {
                            // Try to get the error details
                            let errorData = { detail: `Error ${refreshRes.status}`};
                            try {
                                const errorText = await refreshRes.text();
                                console.error("Raw error response:", errorText);
                                try {
                                    errorData = JSON.parse(errorText);
                                } catch (e) {
                                    console.error("Failed to parse error response as JSON");
                                }
                                console.error("Token refresh error details:", errorData);
                            } catch (e) { 
                                console.error("Failed to read error response");
                            }
                            
                            logout?.();
                            toast.error("Token refresh failed. Please log in again.");
                            router.push('/signin');
                            throw new Error(`Token refresh failed: ${JSON.stringify(errorData)}`);
                        }

                        const refreshData = await refreshRes.json();
                        console.log("Token refresh response received:", refreshData ? "Yes" : "No");
                        console.log("Token refresh access token received:", refreshData.access ? "Yes" : "No");
                        
                        if (!refreshData.access) {
                            logout?.();
                            toast.error("Invalid refresh response. Please log in again.");
                            router.push('/signin');
                            throw new Error("Invalid refresh response. Please log in again.");
                        }

                        console.log("Token refreshed successfully.");
                        // Store the new access token with proper settings
                        Cookies.set('access', refreshData.access, { 
                            path: '/', 
                            expires: 7,
                            sameSite: 'lax'  // Changed from 'strict' to 'lax' for better compatibility
                        });
                        localStorage.setItem('authToken', refreshData.access);
                        
                        // Store new refresh token if provided
                        if (refreshData.refresh) {
                            Cookies.set('refresh', refreshData.refresh, { 
                                path: '/', 
                                expires: 30,
                                sameSite: 'lax'  // Changed from 'strict' to 'lax'
                            });
                            localStorage.setItem('refreshToken', refreshData.refresh);
                        }
                        
                        return await tryFetch(refreshData.access);
                    } catch (refreshErr: any) {
                        console.error("Refresh error:", refreshErr);
                        logout?.();
                        toast.error("Could not refresh session. Please log in again.");
                        router.push('/signin');
                        throw new Error("Could not refresh session. Please log in again.");
                    }
                }

                if (!response.ok) {
                    let errorData = { detail: `Error ${response.status}`};
                    try {
                        errorData = await response.json();
                    } catch { /* Ignore if parsing fails */ }
                    throw new Error(errorData.detail || `Failed to fetch trips (Status: ${response.status})`);
                }

                return await response.json();
            };

            try {
                const data = await tryFetch(token);
                setTrips(data);
            } catch (err: unknown) {
                console.error("Error fetching saved trips:", err);
                const message = err instanceof Error ? err.message : "An unknown error occurred.";
                // Avoid showing toast again if already redirected due to 401 inside try
                if (!(err instanceof Error && (err.message.includes("Session expired") || err.message.includes("Token refresh failed") || err.message.includes("Could not refresh session")))) { 
                    setError(`Failed to load trips: ${message}`);
                    toast.error(`Failed to load trips: ${message}`);
                }
            } finally {
                setIsLoading(false); 
            }
        };

        // Call fetchMyTrips only when authentication status is determined
         if (isUserAuthenticated !== null) {
              fetchMyTrips();
         }

    // Dependencies for the effect
    }, [isUserAuthenticated, router, logout]); 


    // --- Render Logic ---

    // Loading State
    if (isLoading) {
        return (
            // Centered loading indicator within the main content area
            <div className="flex justify-center items-center flex-grow pt-20"> 
                <Loader className="animate-spin h-8 w-8 text-blue-600" />
                <span className="ml-3 text-xl text-gray-700">Loading your saved trips...</span>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            // Centered error message within the main content area
            <div className="container mx-auto px-4 text-center text-red-600 pt-20"> 
                <AlertTriangle className="h-12 w-12 mb-4 mx-auto" />
                <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong</h2>
                <p className="mb-6">{error}</p>
                <button
                    onClick={() => router.push("/fastplan")} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Plan a New Trip
                </button>
            </div>
        );
    }

    // No Trips State
    if (!isLoading && trips.length === 0) {
        return (
             // Centered message for no trips within the main content area
            <div className="container mx-auto px-4 text-center text-gray-600 pt-20"> 
                 <List className="h-16 w-16 mb-6 text-gray-400 mx-auto" />
                <h2 className="text-2xl font-semibold mb-2">No Saved Trips Yet</h2>
                <p className="mb-6">You haven't saved any trip plans. Start planning your next adventure!</p>
                <button
                    onClick={() => router.push("/fastplan")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    Plan Your First Trip
                </button>
            </div>
        );
    }
    const handleViewPlanClick = (trip: SavedTripData) => {
        console.log("Opening modal for trip ID:", trip.id);
        setSelectedTrip(trip);
    };

    const handleCloseModal = () => {
        setSelectedTrip(null);
    };
    // --- Display Trips List ---
    return (
        // Container for the main content when trips exist
        <div className="container mx-auto px-4"> 
            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">My Saved Trips</h1>

            {/* Grid layout for trip cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Map over the fetched trips array */}
                {trips.map((trip) => (
                    // Individual trip card container
                    <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col transition hover:shadow-lg">
                        
                        {/* Image Section */}
                        <div className="relative h-48 w-full bg-gray-200"> {/* Fixed height container for image */}
                          {(trip.destination_image_urls && trip.destination_image_urls.length > 0) ? ( 
                            // Display the first image if available
                            <Image
                              src={trip.destination_image_urls[0]} 
                              alt={`Image for ${trip.destination}`}
                              fill // Fill the container
                              style={{ objectFit: 'cover' }} // Cover while maintaining aspect ratio
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
                              priority={false} // Only set true for above-the-fold images if needed
                              onError={(e) => { // Fallback for broken images
                                  console.warn("Failed to load trip image:", trip.destination_image_urls?.[0]);
                                  // You could potentially try the next image in the array here if needed
                                  e.currentTarget.style.display = 'none'; // Hide broken image element
                                  // Optionally show the placeholder div below instead
                              }}
                            />
                          ) : (
                            // Placeholder if no image URL exists
                            <div className="flex items-center justify-center h-full w-full text-gray-400">
                              <ImageOff size={48} /> 
                            </div>
                          )}
                        </div>
                        {/* End Image Section */}

                        {/* Content Section (Text Details) */}
                        <div className="p-5 flex-grow"> 
                            {/* Destination */}
                            <h2 className="text-xl font-semibold mb-2 text-gray-800 flex items-center">
                                <MapPin size={20} className="mr-2 text-blue-600 shrink-0" />
                                {trip.destination || "Unnamed Trip"}
                                {/* Optional Title */}
                                {trip.title && <span className="ml-2 text-sm text-gray-500">({trip.title})</span>}
                            </h2>
                            {/* Dates */}
                            {(trip.start_date || trip.end_date) && (
                                <p className="text-sm text-gray-500 mb-3 flex items-center">
                                    <Calendar size={14} className="mr-1.5 shrink-0" />
                                    {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'N/A'}
                                    {' - '}
                                    {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'N/A'}
                                </p>
                            )}
                            {/* Summary */}
                            {trip.plan_json?.summary && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3"> {/* Limit summary lines */}
                                    {trip.plan_json.summary}
                                </p>
                            )}
                        </div>
                        {/* End Content Section */}

                        {/* Card Footer Section */}
                        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                             {/* Saved Date */}
                             <span className="text-xs text-gray-400">
                                Saved: {new Date(trip.saved_at).toLocaleDateString()}
                             </span>
                             {/* View Plan Button (Functionality TBD) */}
                            <button
                                onClick={() => {
                                    handleViewPlanClick(trip)
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                            >
                                <Eye size={16} className="mr-1" /> View Plan
                            </button>
                            {/* Optional: Add Delete button here later */}
                        </div>
                        {/* End Card Footer Section */}

                    </div> // End Individual trip card container
                ))} 
                 {/* End of map loop */}

            </div> 
            {/* End Grid layout */}
            {selectedTrip && (
                <TripDetailModal
                    trip={selectedTrip}
                    onClose={handleCloseModal}
                />
            )}
        </div>
        // End Main content container
    );
}