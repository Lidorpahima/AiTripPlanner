export const TRIP_STYLE_OPTIONS = [
  { value: "Relaxing", icon: "🏖️" },
  { value: "Adventurous", icon: "🧗‍♂️" }, 
  { value: "Cultural", icon: "🏛️" },
  { value: "Romantic", icon: "💑" },
];

export const INTEREST_OPTIONS = [
  { value: "Food & Cuisine", icon: "🍲" },
  { value: "History & Heritage", icon: "🏺" },
  { value: "Art & Culture", icon: "🎭" },
  { value: "Nature & Outdoors", icon: "🌿" },
  { value: "Shopping", icon: "🛍️" },
  { value: "Nightlife", icon: "🥂" },
  { value: "Beaches", icon: "🏝️" },
  { value: "Photography", icon: "📸" },
  { value: "Wildlife", icon: "🦁" },
  { value: "Architecture", icon: "🏙️" }
];

export const PACE_OPTIONS = [
  { value: "Relaxed", icon: "🐢", description: "Plenty of downtime between activities" },
  { value: "Moderate", icon: "🚶", description: "Balanced pace with some free time" },
  { value: "Intense", icon: "🏃‍♂️", description: "Action-packed with lots to see" }
];

export const BUDGET_OPTIONS = [
  { value: "Budget", icon: "💰", description: "Economical options & local experiences" },
  { value: "Mid-range", icon: "💰💰", description: "Comfortable with occasional splurges" },
  { value: "Luxury", icon: "💰💰💰", description: "Premium experiences & accommodations" },
];

export const TRANSPORTATION_MODE_OPTIONS = [
  { value: "Walking & Public Transit", icon: "🚶‍♀️🚇", description: "Exploring on foot and using local transport." },
  { value: "Rental Car / Own Vehicle", icon: "🚗💨", description: "Flexibility to drive and explore widely." },
  { value: "Mix of Both", icon: "🚶‍♂️🚗", description: "Combining driving with walking/public transit." },
  { value: "Ride-sharing & Taxis", icon: "🚕", description: "Mainly using taxis or ride-sharing services." }
];

export const TRAVEL_WITH = [
  { value: "Solo", icon: "🧍" },
  { value: "Partner", icon: "💑" },
  { value: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "Friends", icon: "👯" },
  { value: "Group Tour", icon: "🧑‍🤝‍🧑" }
];

export const POPULAR_DESTINATIONS = [
  { name: "Paris, France", image: "/images/destinations/paris.jpg", emoji: "🗼" },
  { name: "Tokyo, Japan", image: "/images/destinations/tokyo.jpg", emoji: "🏯" },
  { name: "Rome, Italy", image: "/images/destinations/rome.jpg", emoji: "🏛️" },
  { name: "Greece, Mykonos", image: "/images/destinations/mykonos.jpg", emoji: "⛱️" },
  { name: "New York, USA", image: "/images/destinations/new-york.jpg", emoji: "🗽" },
  { name: "Bangkok, Thailand", image: "/images/destinations/bangkok.jpg", emoji: "🛕" },
]; 

export interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  tripStyle: string[];
  interests: string[];
  pace: string;
  budget: string;
  transportationMode: string;
  travelWith: string;
  mustSeeAttractions: string;
} 