"use client";

import TripItinerary from "@/components/Tripltinerary";

const mockPlan = {
  summary: "Explore Bali's Family-Friendly Sports Destinations in 3 Days",
  days: [
    {
      title: "Day 1: Arrival and Beach Fun",
      activities: [
        "08:30 - Breakfast at Bali Buda Cafe",
        "09:30 - Check-in at The Seminyak Beach Resort",
        "10:30 - Relax at Seminyak Beach",
        "12:30 - Lunch at La Plancha Beach Bar",
        "14:00 - Beach volleyball or surfing lessons at Seminyak Beach",
        "18:00 - Sunset walk along Seminyak Beach",
        "19:00 - Dinner at Warung Murah Murah",
        "20:30 - Gelato at Gelato Secrets"
      ]
    },
    {
      title: "Day 2: Water Sports and Ubud",
      activities: [
        "08:00 - Breakfast at the hotel",
        "10:00 - Water sports at Tanjung Benoa",
        "13:30 - Transfer to Ubud",
        "15:00 - Visit Ubud Monkey Forest",
        "18:00 - Sunset rice terrace walk",
        "19:30 - Dinner at Warung Dewa Ruci"
      ]
    },
    {
      title: "Day 3: Cycling, Rafting, and Relaxation",
      activities: [
        "08:00 - Cycling tour with Bali Eco Cycling",
        "11:00 - Lunch at Warung Sari Organic",
        "13:30 - White water rafting at Ayung River",
        "16:00 - Relax at the hotel pool",
        "19:00 - Farewell dinner at Mozaic Restaurant",
        "21:00 - Balinese massage at the hotel spa"
      ]
    }
  ]
};

export default function TripResultPage() {
  return <TripItinerary plan={mockPlan} />;
}
