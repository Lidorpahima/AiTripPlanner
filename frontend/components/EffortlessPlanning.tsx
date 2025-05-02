"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import MacbookFrame from "./ui/MacbookFrame"

export function EffortlessPlanning() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-16">
      {/* Left side content */}
      <div className="w-full md:w-1/2 space-y-6">
        <h3 className="text-blue-500 font-medium text-lg">Effortless Planning, Deeper Exploration</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Generate dynamic plans 
        real-time events and integrated research tools.</h2>
        <p className="text-gray-600 leading-relaxed">
        Start with an AI-powered itinerary.
Customize it via simple prompts, dive into maps and reviews, and discover local shows or events happening during your dates
        </p>
      </div>

      {/* Right side - MacBook with budget interface */}
      <div className="w-full md:w-1/2 relative">
        <div className="relative w-full md :w-[120%] md:ml-auto">
          {/* Using MacbookFrame component */}
          <MacbookFrame className="md:transform md:translate-x-[5%]">
            <Image
              src="/svg/planner.png"
              alt="Trip Budget Estimate Interface"
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-fill"
              priority
            />
          </MacbookFrame>
        </div>
      </div>
    </div>
  )
}
