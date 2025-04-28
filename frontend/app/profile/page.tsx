'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'; 
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/(auth)/context/AuthContext";

const MapChart = dynamic(() => import('@/components/MapChart'), {
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading Map...</p>
    </div>
  ),
  ssr: false 
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const CACHE_KEY = 'profile_data_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; 

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<{
        name: string;
        email: string;
        visitedCountries: string[];
    }>({ name: '', email: '', visitedCountries: [] });

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuth();

    useEffect(() => {
      const fetchProfileData = async () => {
        setIsLoading(true);
        setError(null);
        
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          try {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            
            if (now - timestamp < CACHE_EXPIRY) {
              console.log("Using cached profile data");
              setProfileData({
                name: data.name || '',
                email: data.email || '',
                visitedCountries: data.visitedCountries || [],
              });
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Error parsing cached data:", e);
          }
        }

        let token = Cookies.get('access');

        const tryFetch = async (tokenToUse: string | undefined): Promise<any> => {
          if (!tokenToUse) {
            toast.error("Authentication token missing. Please log in.");
            router.push('/signin'); 
            throw new Error("Authentication token missing."); 
          }

          const response = await fetch(`${API_BASE}/api/profile/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenToUse}`,
              'Accept': 'application/json',
            },
          });

          if (response.status === 401) {
            console.log("Access token expired or invalid. Attempting refresh...");
            const refresh = Cookies.get('refresh');

            if (!refresh) {
                toast.error("Session expired. Please log in again.");
                logout();
                router.push('/signin');
              throw new Error("Session expired. Please log in again.");
            }

            try {
                const refreshRes = await fetch(`${API_BASE}/api/token/refresh/`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ refresh }),
                });

                if (!refreshRes.ok) {
                    logout();
                    toast.error("Token refresh failed. Please log in again.");
                    router.push('/signin');
                    throw new Error("Token refresh failed. Please log in again.");
                }

                const refreshData = await refreshRes.json();
                if (!refreshData.access) {
                    logout();
                    toast.error("Invalid refresh response. Please log in again.");
                    router.push('/signin');
                    throw new Error("Invalid refresh response. Please log in again.");
                }

                console.log("Token refreshed successfully.");
                Cookies.set('access', refreshData.access);
                return await tryFetch(refreshData.access);

            } catch (refreshErr: any) {
                logout();
                toast.error("Could not refresh session. Please log in again.");
                router.push('/signin');
                throw new Error("Could not refresh session. Please log in again.");
            }
          }

          if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { detail: `Server error: ${response.status}` };
            }
            toast.error(errorData.detail || `Error fetching profile: ${response.status}`);
            throw new Error(errorData.detail || `Error ${response.status}`);
          }

          return await response.json();
        };

        try {
          const data = await tryFetch(token); 
          const profileData = {
            name: data.full_name || '',
            email: data.username_email || '',
            visitedCountries: data.visited_countries || [],
          };
          
          setProfileData(profileData);
          
          // שמירה במטמון
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: profileData,
            timestamp: new Date().getTime()
          }));
          
          console.log("Profile data fetched successfully:", data);
        } catch (err: any) {
          console.error("Failed to fetch profile data after potentially trying refresh:", err);
          setError(err.message || "Failed to load profile data.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfileData();
    }, [router, logout]); 

    const handleCountrySelect = (countryName: string) => {
        setProfileData(prevData => ({
            ...prevData,
            visitedCountries: prevData.visitedCountries.includes(countryName)
                ? prevData.visitedCountries.filter(c => c !== countryName)
                : [...prevData.visitedCountries, countryName]
        }));
    };

    const handleSaveChanges = async () => {
        let token = Cookies.get('access');

        if (!token) {
            toast.error("Authentication token not found. Please log in again.");
            logout();
            router.push('/signin'); 
            return;
        }

        setIsSaving(true);
        console.log('Attempting to save changes...');

        try {
            const response = await fetch(`${API_BASE}/api/profile/update/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: profileData.name,
                    visited_countries: profileData.visitedCountries,
                })
            });

            if (response.status === 401) {
                toast.error("Session expired during save. Please log in again.");
                router.push('/signin');
                throw new Error("Session expired during save.");
            }


            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
                toast.error(errorData.detail || `Failed to save changes (status: ${response.status})`);
                throw new Error(errorData.detail || `Failed to save changes (status: ${response.status})`);
            }
            toast.success('Changes Saved Successfully!');
        } catch (error: any) {
            console.error('Error saving profile:', error);
            if (!String(error.message).includes("Failed to save changes") && !String(error.message).includes("Session expired")) {
                 toast.error(`Error saving changes: ${error.message}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
    }

    if (error && !profileData.email) { 
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-600">
                <p>Error loading profile: {error}</p>
                <p>Please try refreshing the page. If the problem persists, try logging in again.</p>
                <button onClick={() => router.push('/signin')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 pt-25">
            <div className="bg-white rounded-lg shadow-md p-8">
                {/* HEADLINE */}
                <div className="flex items-center mb-8">
                    <div className="relative w-20 h-20 mr-4">
                        <Image
                           src="/images/default-avatar.png" 
                           alt="Profile"
                           width={80}
                           height={80}
                           className="rounded-full object-cover"
                           priority={false}
                           loading="lazy"
                           placeholder="blur"
                           blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23f3f4f6'/%3E%3C/svg%3E"
                           onError={(e) => {
                             e.currentTarget.onerror = null; 
                             e.currentTarget.src = '/images/placeholder-avatar.png'; 
                           }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Hello, {profileData.name || 'User'}</h1>
                        <p className="text-gray-600">{profileData.email}</p>
                    </div>
                </div>

                {/* PROFILE INFO */}
                <div className="space-y-6">
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-gray-700 mb-2">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={profileData.email}
                                    disabled 
                                    className="w-full p-2 border rounded-md bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div>
                                <Link href="/reset-password" className="text-blue-500 hover:text-blue-600 inline-block mt-2">
                                    Reset Password
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* COUNTRY MAP*/}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Countries I've Visited</h2>
                        <div className="border rounded-lg p-4 relative">
                            <Suspense fallback={
                              <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                                <p className="text-gray-500">Loading map ...</p>
                              </div>
                            }>
                              <MapChart
                                  visitedCountries={profileData.visitedCountries}
                                  onCountrySelect={handleCountrySelect}
                              />
                            </Suspense>
                            <div className="mt-4">
                                <p className="text-gray-700 mb-2">Number of countries visited: {profileData.visitedCountries.length}</p>
                                <div className="flex flex-wrap gap-2">
                                    {profileData.visitedCountries.map((country) => (
                                        <span key={country} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{country}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SAVEBUTTOM*/}
                    <button
                        className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}