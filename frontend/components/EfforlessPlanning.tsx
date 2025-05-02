"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function EfforlessPlanning() {
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
          {/* MacBook SVG container */}
          <div className="relative w-full aspect-[380/213] md:transform md:translate-x-[5%]">
            <svg
                width="380"
                height="213"
                viewBox="0 0 380 213"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
            >
              <path 
                d="M44.5596 2.13037H334.132C338.653 2.13047 342.319 5.79621 342.319 10.3179V206.901H36.3721V10.3179C36.3721 5.79615 40.0378 2.13037 44.5596 2.13037Z" 
                fill="black" 
                stroke="#9FA2A5" 
                strokeWidth="3.27492"
              />
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M0.525391 200.142H379.475V207.969H0.525391V200.142Z" 
                fill="#D8D8D8"
              />
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M0.525391 207.969H379.475V207.969C379.475 210.405 377.5 212.38 375.064 212.38H4.93673C2.50041 212.38 0.525391 210.405 0.525391 207.969V207.969Z" 
                fill="#9FA2A5"
              />
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M163.176 200.142H213.835V200.142C212.443 203.014 209.531 204.838 206.34 204.838H170.671C167.48 204.838 164.568 203.014 163.176 200.142V200.142Z" 
                fill="#9FA2A5"
              />
            </svg>
            {/* Actual screen */}
            <div className="absolute inset-0">
              <div className="absolute top-[4%] left-[10.8%] right-[11%] bottom-[8%] bg-white rounded-md overflow-hidden shadow-inner">
                <Image
                  src="/svg/planner.png"
                  alt="Trip Budget Estimate Interface"
                  fill
                  sizes="(max-width: 768px) 90vw, 50vw"
                  className="object-fill"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
