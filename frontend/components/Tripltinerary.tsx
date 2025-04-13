"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type DayPlan = {
  title: string;
  activities: string[];
};

type TripPlan = {
  summary: string;
  days: DayPlan[];
};

interface Props {
  plan: TripPlan;
  onRemoveActivity?: (dayIndex: number, activityIndex: number) => void;
}

const enhanceQuery = (text: string) => {
  const cleaned = text
    .toLowerCase()
    .replace(/the hotel|the pool|the restaurant|transfer to|visit|breakfast at|lunch at|dinner at/gi, '')
    .trim();

  return `high quality photo of ${cleaned} place in Bali`;
};

const TripItinerary: React.FC<Props> = ({ plan }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, string[]>>({});
  const [imageIndex, setImageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    plan.days.forEach((day, dayIndex) => {
      day.activities.forEach((activity, activityIndex) => {
        const description = activity.split(" - ").slice(1).join(" - ");
        const keywords = description.split(" at ").pop()?.trim() || description;
        const key = `${dayIndex}-${activityIndex}`;
        const query = enhanceQuery(keywords);

        fetch(`${API_BASE}/api/image-search/?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            if (data.images && Array.isArray(data.images)) {
              setImages(prev => ({ ...prev, [key]: data.images }));
              setImageIndex(prev => ({ ...prev, [key]: 0 }));
            }
          })
          .catch(err => console.error("Image fetch failed:", err));
      });
    });
  }, [plan]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const popup = document.getElementById("image-popup");
      if (popup && !popup.contains(e.target as Node)) {
        setExpandedImage(null);
      }
    };

    if (expandedImage !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedImage]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 pb-20">
      <h1 className="text-4xl font-bold text-center mt-30">🗓️ Trip Plan</h1>
      <p className="text-xl text-center text-gray-700 mt-0 max-w-4xl mx-auto">
        {plan.summary}
      </p>

      <div
        className="grid gap-6 mt-10"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {plan.days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="bg-white rounded-2xl shadow-xl px-6 py-4 transition-transform hover:scale-[1.01] duration-300 border border-blue-100 animate-fade-in"
          >
            <h2 className="text-xl font-semibold mb-5 text-center border-b pb-2 text-blue-900">
              {day.title}
            </h2>
            <ul className="space-y-4">
              {day.activities.map((activity, activityIndex) => {
                const time = activity.split(" - ")[0];
                const description = activity.split(" - ").slice(1).join(" - ");
                const keywords = description.split(" at ").pop()?.trim() || description;
                const encodedPlace = encodeURIComponent(keywords);
                const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodedPlace}`;
                const key = `${dayIndex}-${activityIndex}`;
                const allImages = images[key] || [fallbackImage];
                const currentIndex = imageIndex[key] || 0;
                const imageUrl = allImages[currentIndex] || fallbackImage;

                return (
                  <li
                    key={activityIndex}
                    className="flex items-start justify-between bg-gray-50 hover:bg-blue-50 rounded-xl px-4 py-3 relative transition duration-300 ease-in-out border hover:shadow-md"
                    onClick={() => {
                      if (expandedImage !== key) {
                        setExpandedImage(key);
                      }
                    }}
                  >
                    <div className="flex flex-col max-w-[80%]">
                      <span className="text-blue-700 font-bold text-sm mb-0.5">{time}</span>
                      <span className="text-gray-800 text-[15px] leading-snug">
                        {description}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-lg">
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        title="View on map"
                      >
                        🗺️
                      </a>
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Remove this activity"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("❌ Remove:", description);
                        }}
                      >
                        ❌
                      </button>
                    </div>

                    {expandedImage === key && (
                      <div id="image-popup" className="absolute z-20 top-full left-0 mt-2 w-64 shadow-2xl rounded-xl overflow-hidden border border-gray-300 bg-white animate-fade-in">
                        <div className="relative">
                          <Image
                            src={imageUrl}
                            alt={description}
                            width={400}
                            height={300}
                            className="w-full h-auto rounded"
                            unoptimized
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedImage(null);
                            }}
                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 p-1 rounded-full"
                            title="Close"
                          >
                            ❌
                          </button>
                          {allImages.length > 1 && (
                            <div className="absolute inset-0 flex justify-between items-center px-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageIndex(prev => ({
                                    ...prev,
                                    [key]: (prev[key] ?? 0) === 0
                                      ? allImages.length - 1
                                      : (prev[key] ?? 0) - 1,
                                  }));
                                }}
                                className="text-white bg-black bg-opacity-40 hover:bg-opacity-60 p-1 rounded-full"
                              >
                                ◀
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageIndex(prev => ({
                                    ...prev,
                                    [key]: (prev[key] ?? 0) + 1 >= allImages.length
                                      ? 0
                                      : (prev[key] ?? 0) + 1,
                                  }));
                                }}
                                className="text-white bg-black bg-opacity-40 hover:bg-opacity-60 p-1 rounded-full"
                              >
                                ▶
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center mt-14">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-full shadow-lg text-lg transition-transform hover:scale-105">
          💾 Save to My Trips
        </button>
      </div>
    </div>
  );
};

export default TripItinerary;
