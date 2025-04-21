'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TripItinerary from "@/components/Tripltinerary"; 
import { toast } from "react-toastify";

interface OriginalRequestData {
    destination: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
}
interface TripPlan {
  summary: string;
  days: any[]; 
}

export default function TripResultPage() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [originalRequest, setOriginalRequest] = useState<OriginalRequestData | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("fastplan_result");
    const storedRequest = sessionStorage.getItem("fastplan_request");

    let parsedPlan: TripPlan | null = null;
    let parsedRequest: OriginalRequestData | null = null;
    let errorOccurred = false; 

    if (storedPlan) {
      try {
        parsedPlan = JSON.parse(storedPlan);
      } catch (err) {
        console.error("❌ Failed to parse stored plan:", err);
        setLoadingError("Failed to load trip plan data.");
        errorOccurred = true;
      }
    } else {
        setLoadingError("Trip plan data not found in storage.");
        errorOccurred = true;
    }

    if (storedRequest) {
      try {
        parsedRequest = JSON.parse(storedRequest);
      } catch (err) {
        console.error("❌ Failed to parse stored request data:", err);
        setLoadingError(prev => prev ? `${prev} & Failed to load request details.` : "Failed to load request details.");
        errorOccurred = true;
      }
    } else {
         setLoadingError(prev => prev ? `${prev} & Original request data not found.` : "Original request data not found.");
         errorOccurred = true;
    }

    if (errorOccurred) {
        toast.error(loadingError || "Could not load trip data. Redirecting...");
        sessionStorage.removeItem("fastplan_result");
        sessionStorage.removeItem("fastplan_request");
        router.push("/fastplan"); 
    } else if (parsedPlan && parsedRequest) {
        setPlan(parsedPlan);
        setOriginalRequest(parsedRequest); 
        setIsLoading(false); 
    } else {
        setLoadingError("Unexpected issue loading trip data.");
        toast.error("Unexpected issue loading trip data. Redirecting...");
         sessionStorage.removeItem("fastplan_result");
         sessionStorage.removeItem("fastplan_request");
        router.push("/fastplan");
    }

  }, []); 

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading your trip...</div>;
  }

  if (loadingError || !plan || !originalRequest) {
    return (
        <div className="flex flex-col justify-center items-center h-screen text-center text-red-600">
            <p className="text-xl font-semibold mb-4">Error Loading Trip Data</p>
            <p className="mb-6">{loadingError || "Could not find complete trip information."}</p>
            <button
                onClick={() => router.push("/fastplan")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Plan a New Trip
            </button>
        </div>
    );
  }

  return (
    <TripItinerary 
        plan={plan} 
        originalRequestData={originalRequest} 
        onPlanNewTrip={() => {
            sessionStorage.removeItem("fastplan_result");
            sessionStorage.removeItem("fastplan_request");
            router.push("/fastplan"); 
        }} 
    />
  );
}