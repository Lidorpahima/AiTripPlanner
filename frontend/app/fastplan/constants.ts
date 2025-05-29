/**
 * FastPlan Constants
 * 
 * This file contains all the constant values used in the FastPlan feature:
 * - Trip style options with icons
 * - Interest categories with icons
 * - Pace options with descriptions
 * - Budget tiers with descriptions
 * - Transportation mode options with descriptions
 * - Travel companion options with icons
 * - Popular destinations with images and emojis
 * - Form data interface definition
 */

/**
 * Available trip style options for travel planning
 * Each option includes a value and an emoji icon
 */
export const TRIP_STYLE_OPTIONS = [
  { value: "Relaxing", icon: "🏖️" },
  { value: "Adventurous", icon: "🧗‍♂️" }, 
  { value: "Cultural", icon: "🏛️" },
  { value: "Romantic", icon: "💑" },
];

/**
 * Available interest categories for travel planning
 * Each option includes a value and an emoji icon
 */
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

/**
 * Available pace options for travel planning
 * Each option includes a value, emoji icon, and description
 */
export const PACE_OPTIONS = [
  { value: "Relaxed", icon: "🐢", description: "Plenty of downtime between activities" },
  { value: "Moderate", icon: "🚶", description: "Balanced pace with some free time" },
  { value: "Intense", icon: "🏃‍♂️", description: "Action-packed with lots to see" }
];

/**
 * Available budget tiers for travel planning
 * Each option includes a value, emoji icon, and description
 */
export const BUDGET_OPTIONS = [
  { value: "Budget", icon: "💰", description: "Economical options & local experiences" },
  { value: "Mid-range", icon: "💰💰", description: "Comfortable with occasional splurges" },
  { value: "Luxury", icon: "💰💰💰", description: "Premium experiences & accommodations" },
];

/**
 * Available transportation mode options for travel planning
 * Each option includes a value, emoji icon, and description
 */
export const TRANSPORTATION_MODE_OPTIONS = [
  { value: "Walking & Public Transit", icon: "🚶‍♀️🚇", description: "Exploring on foot and using local transport." },
  { value: "Rental Car / Own Vehicle", icon: "🚗💨", description: "Flexibility to drive and explore widely." },
  { value: "Mix of Both", icon: "🚶‍♂️🚗", description: "Combining driving with walking/public transit." },
  { value: "Ride-sharing & Taxis", icon: "🚕", description: "Mainly using taxis or ride-sharing services." }
];

/**
 * Available travel companion options
 * Each option includes a value and an emoji icon
 */
export const TRAVEL_WITH = [
  { value: "Solo", icon: "🧍" },
  { value: "Partner", icon: "💑" },
  { value: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "Friends", icon: "👯" },
  { value: "Group Tour", icon: "🧑‍🤝‍🧑" }
];

/**
 * Popular destinations for quick selection
 * Each destination includes a name, image path, and emoji
 */
export const POPULAR_DESTINATIONS = [
  { name: "Paris, France", image: "/images/destinations/paris.webp", emoji: "🗼" },
  { name: "Tokyo, Japan", image: "/images/destinations/tokyo.webp", emoji: "🏯" },
  { name: "Rome, Italy", image: "/images/destinations/rome.webp", emoji: "🏛️" },
  { name: "Greece, Mykonos", image: "/images/destinations/mykonos.webp", emoji: "⛱️" },
  { name: "New York, USA", image: "/images/destinations/new-york.webp", emoji: "🗽" },
  { name: "Bangkok, Thailand", image: "/images/destinations/bangkok.webp", emoji: "🛕" },
];

/**
 * FormData Interface
 * 
 * Defines the structure of the travel planning form data:
 * - destination: Selected travel destination
 * - startDate: Trip start date
 * - endDate: Trip end date
 * - tripStyle: Array of selected trip styles
 * - interests: Array of selected interests
 * - pace: Selected pace preference
 * - budget: Selected budget tier
 * - transportationMode: Selected transportation mode
 * - travelWith: Selected travel companion type
 * - mustSeeAttractions: Text input for must-see attractions
 */
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