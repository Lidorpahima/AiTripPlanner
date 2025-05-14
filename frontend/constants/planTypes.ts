export interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: string;
}

export interface PlaceDetailsData {
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
}

export interface Activity {
  time: string;
  description: string;
  place_name_for_lookup: string | null;
  place_details?: PlaceDetailsData;
  category?: ActivityCategory;
  cost_estimate?: {
    min: number;
    max: number;
    currency: string;
  };
  ticket_url?: string | null;
}
export type ActivityCategory =
  | 'food'
  | 'museum'
  | 'shopping'
  | 'transport'
  | 'hotel'
  | 'attraction'
  | 'cafe'
  | 'other'
  | string; 

export interface DayPlan {
  title: string;
  activities: Activity[];
  day_cost_estimate?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface TripPlan {
  summary: string;
  days: DayPlan[];
  destination_info?: {
    country: string;
    city: string;
    language: string;
    currency: string;
    exchange_rate?: number;
    budget_tips?: string[];
    transportation_options?: {
      name: string;
      description: string;
      cost_range?: string;
      app_link?: string;
      app_name?: string;
    }[];
    discount_options?: {
      name: string;
      description: string;
      price?: string;
      link?: string;
    }[];
    emergency_info?: {
      police: string;
      ambulance: string;
      tourist_police?: string;
    };
  };
  total_cost_estimate?: {
    min: number;
    max: number;
    currency: string;
    accommodations?: {
      min: number;
      max: number;
    };
    food?: {
      min: number;
      max: number;
    };
    attractions?: {
      min: number;
      max: number;
    };
    transportation?: {
      min: number;
      max: number;
    };
    other?: {
      min: number;
      max: number;
    };
  };
}

export interface OriginalRequestData {
  destination: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  tripStyle?: string[];
  budget?: string;
}
