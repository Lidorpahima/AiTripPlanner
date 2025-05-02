"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import MacbookFrame from "./ui/MacbookFrame"

export const BudgetPlanner: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
      {/* Left side - MacBook with budget interface */}
      <div className="w-full md:w-1/2 relative order-2 md:order-1 z-10">
        <div className="relative w-full md:w-[140%]">
          {/* Using MacbookFrame component */}
          <MacbookFrame>
            <Image
              src="/svg/budget.jpg"
              alt="Trip Budget Estimate Interface"
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-fill"
              priority
            />
          </MacbookFrame>
        </div>
      </div>

      {/* Right side content */}
      <div className="w-full md:w-1/1 space-y-6 order-1 md:order-2 md:ml-16">
        <h3 className="text-blue-500 font-medium text-lg">Know Your Budget</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Unlock detailed budget for your destinations.</h2>
        <p className="text-gray-600 leading-relaxed">
          Our planner breaks down costs by category – accommodation, food, and activities – suggests money-saving passes
          and discounts to make your travel funds go further.
        </p>
      </div>
    </div>
  )
}
