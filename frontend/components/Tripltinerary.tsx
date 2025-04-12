"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

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
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});

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
            if (data.image_url) {
              setImages(prev => ({ ...prev, [key]: data.image_url }));
            }
          })
          .catch(err => console.error("Image fetch failed:", err));
      });
    });
  }, [plan]);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🗓️ Trip Plan</h1>
      <p className="text-lg text-center text-gray-700 mb-10">{plan.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plan.days.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">{day.title}</h2>
            <ul className="space-y-3">
              {day.activities.map((activity, activityIndex) => {
                const time = activity.split(" - ")[0];
                const description = activity.split(" - ").slice(1).join(" - ");
                const keywords = description.split(" at ").pop()?.trim() || description;
                const encodedPlace = encodeURIComponent(keywords);
                const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodedPlace}`;
                const key = `${dayIndex}-${activityIndex}`;
                const imageUrl = images[key] || fallbackImage;

                return (
                  <li
                    key={activityIndex}
                    className="flex items-start justify-between bg-gray-100 rounded-lg px-3 py-2 relative"
                    onMouseEnter={() => setHoveredPlace(description)}
                    onMouseLeave={() => setHoveredPlace(null)}
                  >
                    <div className="flex flex-col">
                      <span className="text-blue-600 font-semibold">{time}</span>
                      <span className="text-gray-800 text-sm">{description}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-xl"
                        title="View on map"
                      >
                        🗺️
                      </a>
                      <button
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Remove this activity"
                        onClick={() => {
                          console.log("❌ Remove:", description);
                        }}
                      >
                        ❌
                      </button>
                    </div>

                    {hoveredPlace === description && (
                      <div className="absolute z-10 top-full left-0 mt-2 w-64 shadow-lg rounded overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={description}
                          width={400}
                          height={300}
                          className="w-full h-auto rounded"
                          unoptimized
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow">
          💾 Save to My Trips
        </button>
      </div>
    </div>
  );
};

export default TripItinerary;
