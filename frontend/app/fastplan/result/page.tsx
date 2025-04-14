'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TripItinerary from "@/components/Tripltinerary";
import { toast } from "react-toastify";

export default function TripResultPage() {
  const [plan, setPlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("fastplan_result");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPlan(parsed);
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Failed to parse stored plan:", err);
        toast.error("Failed to load trip plan.");
        router.push("/fastplan");
      }
    } else {
      toast.warn("Please generate a plan first.");
      router.push("/fastplan");
    }
  }, []);

  if (isLoading) {
    return <div className="text-center py-10 text-xl">Loading your trip...</div>;
  }

  if (!plan) {
    return <div className="text-center text-red-600">No plan found</div>;
  }

  return <TripItinerary plan={plan} />;
}

