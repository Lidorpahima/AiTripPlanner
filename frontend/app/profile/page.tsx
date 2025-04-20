'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MapChart from '@/components/MapChart';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'; // ודא שיש לך ToastContainer מוגדר ב layout.js או קובץ דומה
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<{
        name: string;
        email: string;
        visitedCountries: string[];
    }>({ name: '', email: '', visitedCountries: [] });

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null); // נשאר כדי לאפשר הצגת שגיאה קבועה בדף

    useEffect(() => {
      const fetchProfileData = async () => {
        setIsLoading(true);
        setError(null);

        let token = Cookies.get('access');

        // פונקציית עזר רקורסיבית לטיפול ב-fetch וברענון
        const tryFetch = async (tokenToUse: string | undefined): Promise<any> => {
          // אם אין טוקן כלל (אפילו אחרי נסיון רענון), אין טעם להמשיך
          if (!tokenToUse) {
            toast.error("Authentication token missing. Please log in.");
            router.push('/signin'); // *** שינוי: הפניה ללוגין אם אין טוקן כלל ***
            throw new Error("Authentication token missing."); // זרוק שגיאה כדי לעצור את המשך הביצוע ב-catch
          }

          const response = await fetch(`${API_BASE}/api/profile/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenToUse}`,
              'Accept': 'application/json',
            },
          });

          // אם קיבלנו שגיאת 401 – ננסה רענון
          if (response.status === 401) {
            console.log("Access token expired or invalid. Attempting refresh...");
            const refresh = Cookies.get('refresh');

            if (!refresh) {
              // *** שינוי: הוספת toast והפניה ללוגין ***
              toast.error("Session expired. Please log in again.");
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
                  // *** שינוי: הוספת toast והפניה ללוגין ***
                  Cookies.remove('access'); // נקה טוקנים ישנים
                  Cookies.remove('refresh');
                  toast.error("Token refresh failed. Please log in again.");
                  router.push('/signin');
                  throw new Error("Token refresh failed. Please log in again.");
                }

                const refreshData = await refreshRes.json();
                if (!refreshData.access) {
                  // *** שינוי: הוספת toast והפניה ללוגין ***
                  Cookies.remove('access');
                  Cookies.remove('refresh');
                  toast.error("Invalid refresh response. Please log in again.");
                  router.push('/signin');
                  throw new Error("Invalid refresh response. Please log in again.");
                }

                console.log("Token refreshed successfully.");
                Cookies.set('access', refreshData.access);
                // נסה שוב את הבקשה המקורית עם הטוקן החדש
                return await tryFetch(refreshData.access);

            } catch (refreshErr: any) {
                // אם גם בקשת הרענון נכשלה (למשל בעיית רשת)
                console.error("Error during token refresh request:", refreshErr);
                // *** שינוי: הוספת toast והפניה ללוגין ***
                Cookies.remove('access');
                Cookies.remove('refresh');
                toast.error("Could not refresh session. Please log in again.");
                router.push('/signin');
                // זרוק את השגיאה המקורית או חדשה כדי שה-catch החיצוני יתפוס
                throw new Error("Could not refresh session. Please log in again.");
            }
          }

          // טיפול בשגיאות אחרות (לא 401)
          if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { detail: `Server error: ${response.status}` };
            }
            // *** שינוי: השתמש ב-toast לשגיאות כלליות מה-API ***
            toast.error(errorData.detail || `Error fetching profile: ${response.status}`);
            throw new Error(errorData.detail || `Error ${response.status}`);
          }

          // אם הכל תקין
          return await response.json();
        };

        // --- התחלת התהליך ---
        try {
          // אין צורך לבדוק שוב אם token קיים כאן, tryFetch עושה זאת
          const data = await tryFetch(token); // נסה לקבל נתונים, הפונקציה תטפל ברענון או הפניה
          setProfileData({
            name: data.full_name || '',
            email: data.email || '',
            visitedCountries: data.visited_countries || [],
          });
        } catch (err: any) {
          // ה-catch הזה יתפוס שגיאות שלא טופלו עם הפניה (למשל, שגיאת 500 ראשונית)
          // או שגיאות שהובילו להפניה אבל נזרקו בכל זאת
          console.error("Failed to fetch profile data after potentially trying refresh:", err);
          // `toast.error` כבר נקרא בתוך tryFetch ברוב המקרים המובילים לכאן
          // אבל נשאיר את `setError` למקרה שנרצה להציג הודעה קבועה בדף
          setError(err.message || "Failed to load profile data.");
          // אין צורך ב-toast.error נוסף כאן, אלא אם כן רוצים הודעה כללית
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // הוספתי השתקה ל-eslint כי router לא באמת צריך להיות תלות כאן


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
            // *** שינוי: שימוש ב-toast והפניה ללוגין ***
            toast.error("Authentication token not found. Please log in again.");
            router.push('/signin'); // הפניה אם אין טוקן בזמן השמירה
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

            // *** שינוי: טיפול מפורש ב-401 גם בשמירה (אופציונלי אך מומלץ) ***
            if (response.status === 401) {
                toast.error("Session expired during save. Please log in again.");
                router.push('/signin');
                throw new Error("Session expired during save.");
            }


            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
                // *** שינוי: שימוש ב-toast ***
                toast.error(errorData.detail || `Failed to save changes (status: ${response.status})`);
                throw new Error(errorData.detail || `Failed to save changes (status: ${response.status})`);
            }
            toast.success('Changes Saved Successfully!');
        } catch (error: any) {
            console.error('Error saving profile:', error);
            // ה-toast כבר נקרא בתוך ה-try או בטיפול ב-401
            // אם השגיאה היא אחרת (למשל שגיאת רשת), אפשר להוסיף toast כאן
            if (!String(error.message).includes("Failed to save changes") && !String(error.message).includes("Session expired")) {
                 toast.error(`Error saving changes: ${error.message}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // --- רנדור ---
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
    }

    // שים לב: אם ה-fetch נכשל והוביל להפניה ללוגין, הקומפוננטה הזו לא תגיע לכאן.
    // ה-div הזה יוצג רק אם ה-fetch נכשל בשגיאה שלא גררה הפניה (למשל 500),
    // או אם ה-fetch הצליח אבל משהו אחר השתבש (פחות סביר).
    if (error && !profileData.email) { // הצג שגיאה רק אם באמת לא הצלחנו לטעון כלום
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


    // --- רנדור רגיל של הדף ---
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                {/* כותרת וברכה */}
                <div className="flex items-center mb-8">
                    <div className="relative w-20 h-20 mr-4">
                        <Image
                           src="/images/default-avatar.png" // ודא שהנתיב תקין
                           alt="Profile"
                           fill
                           className="rounded-full object-cover"
                           onError={(e) => {
                             // נסה נתיב חלופי אם ברירת המחדל נכשלה
                             e.currentTarget.onerror = null; // מנע לולאה אינסופית
                             e.currentTarget.src = '/images/placeholder-avatar.png'; // ודא שהנתיב תקין
                           }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Hello, {profileData.name || 'User'}</h1>
                        <p className="text-gray-600">{profileData.email}</p>
                    </div>
                </div>

                {/* פרטי משתמש */}
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
                                    disabled // בדרך כלל לא מאפשרים לשנות אימייל בפרופיל בקלות
                                    className="w-full p-2 border rounded-md bg-gray-100"
                                    readOnly // הוספתי למניעת אזהרות קונסול
                                />
                            </div>
                            <div>
                                <Link href="/reset-password" className="text-blue-500 hover:text-blue-600 inline-block mt-2">
                                    Reset Password
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* מפת מדינות */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Countries I've Visited</h2>
                        <div className="border rounded-lg p-4 relative">
                            <MapChart
                                visitedCountries={profileData.visitedCountries}
                                onCountrySelect={handleCountrySelect}
                            />
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

                    {/* כפתור שמירה */}
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