'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaMapMarkedAlt } from 'react-icons/fa';
import MapChart from '@/components/MapChart';
export default function ProfilePage() {
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    visitedCountries: string[];
  }>({
    name: 'ישראל ישראלי', 
    email: 'israel@example.com',
    visitedCountries: []
  });
  const handleCountrySelect = (countryName: string) => {
    setProfileData(prevData => ({
      ...prevData,
      visitedCountries: prevData.visitedCountries.includes(countryName)
        ? prevData.visitedCountries.filter(c => c !== countryName)
        : [...prevData.visitedCountries, countryName]
    }));
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* כותרת וברכה */}
        <div className="flex items-center mb-8">
          <div className="relative w-20 h-20 mr-4">
            <Image
              src="/images/default-avatar.png" // צריך להוסיף תמונה דיפולטיבית
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">שלום, {profileData.name}</h1>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
        </div>

        {/* פרטי משתמש */}
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">פרטים אישיים</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">אימייל</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>

              <div>
                <Link 
                  href="/reset-password"
                  className="text-blue-500 hover:text-blue-600 inline-block mt-2"
                >
                  איפוס סיסמה
                </Link>
              </div>
            </div>
          </div>

          {/* מפת מדינות */}
          <div>
            <h2 className="text-xl font-semibold mb-4">המדינות שביקרתי בהן</h2>
            <div className="border rounded-lg p-4 relative" style={{ height: 'auto', width: '100%', maxWidth: '800px', margin: 'auto' }}>
              <MapChart
                visitedCountries={profileData.visitedCountries}
                onCountrySelect={handleCountrySelect}
              />
              {/* הוסף רשימת מדינות שנבחרו */}
              <div className="mt-4">
                <p className="text-gray-700 mb-2">
                  מספר מדינות שביקרת: {profileData.visitedCountries.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {profileData.visitedCountries.map((country) => (
                    <span
                      key={country}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* כפתור שמירה - עדכן את ההערה */}
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => {
              console.log('Saving changes:', {
                ...profileData,
                visitedCountries: profileData.visitedCountries
              });
            }}
          >
            שמור שינויים
          </button>
        </div>
      </div>
    </div>
  );
}
