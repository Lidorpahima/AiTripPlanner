"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import MacbookFrame from "./ui/MacbookFrame"

export function TravelToolkit() {
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
        <h3 className="text-blue-500 font-medium text-lg">Your Essential Travel Toolkit</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800"> Access key info.</h2>
        <p className="text-gray-600 leading-relaxed">
        We break down transport options
        with costs, provide actionable saving tips, and list crucial local details for a smoother trip.
        </p>
      </div>

      {/* Right side - MacBook with budget interface */}
      <div className="w-full md:w-1/2 relative">
        <div className="relative w-full md :w-[120%] md:ml-auto">
          {/* Using the MacbookFrame component */}
          <MacbookFrame className="md:transform md:translate-x-[5%]">
            <Image
              src="/svg/toolkit.png"
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
