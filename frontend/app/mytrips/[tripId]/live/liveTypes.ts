// frontend/app/mytrips/[tripId]/live/liveTypes.ts

// Base types for plan structure to help TypeScript
export interface ActivityBase {
    time?: string;
    description?: string;
    place_name_for_lookup?: string | null;
    place_details?: {
        name?: string;
        category?: string;
        price_level?: number;
    } | null;
    cost_estimate?: {
        min: number;
        max: number;
        currency: string;
    } | null;
    ticket_url?: string | null;
}

export interface DayBase {
    title?: string;
    day_cost_estimate?: {
        min: number;
        max: number;
        currency: string;
    } | null;
    activities: ActivityBase[];
}

// Full structure of PlanJson based on observation of SavedTripData
export interface DestinationInfo {
    country?: string;
    city?: string;
    language?: string;
    currency?: string;
    exchange_rate?: number;
    budget_tips?: string[];
    transportation_options?: Array<{
        name?: string;
        description?: string;
        cost_range?: string;
        app_name?: string;
        app_link?: string;
    }>;
    discount_options?: Array<{
        name?: string;
        description?: string;
        price?: string;
        link?: string;
    }>;
    emergency_info?: {
        police?: string;
        ambulance?: string;
        tourist_police?: string;
    };
}

export interface TotalCostEstimate {
    min?: number;
    max?: number;
    currency?: string;
    accommodations?: { min?: number; max?: number };
    food?: { min?: number; max?: number };
    attractions?: { min?: number; max?: number };
    transportation?: { min?: number; max?: number };
    other?: { min?: number; max?: number };
}

export interface PlanJson {
    summary?: string;
    days: DayBase[];
    destination_info?: DestinationInfo | null;
    total_cost_estimate?: TotalCostEstimate | null;
    original_request?: any; // Added to include original request data if present in plan_json
    [key: string]: any; // Allow other properties if they exist but are not strictly typed yet
}

// Live mode specific types
export interface LiveActivity extends ActivityBase {
    id: string; 
    is_completed?: boolean;
}

export interface LiveDay extends Omit<DayBase, 'activities'> {
    activities: LiveActivity[];
}

export interface LiveTripPlan extends Omit<PlanJson, 'days'> {
    days: LiveDay[];
} 