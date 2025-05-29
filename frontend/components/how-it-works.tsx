/**
 * How It Works Component
 * 
 * A section that explains the trip planning process through an interactive step-by-step guide.
 * Features:
 * - Animated step cards with icons
 * - Responsive grid layout
 * - Fade-in and stagger animations
 * - Clear call-to-action
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, ListChecks, Plane, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Animation configuration for fade-in effect
 */
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

/**
 * Animation configuration for staggered container effect
 */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

/**
 * Step interface defining the structure of each process step
 */
interface ProcessStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  subtext: string;
}

/**
 * HowItWorksSection Component
 * 
 * Displays a step-by-step guide of the trip planning process.
 * Each step is presented in an animated card with an icon, title, and description.
 */
const HowItWorksSection: React.FC = () => {
  /**
   * Process steps configuration
   * Defines the content and structure of each step in the planning process
   */
  const steps: ProcessStep[] = [
    {
      icon: <MapPin className="h-10 w-10 text-blue-600" />,
      title: "Select Your Destination",
      description: "Choose where you want to travel.",
      subtext: "Our AI handles all the planning details."
    },
    {
      icon: <ListChecks className="h-10 w-10 text-blue-600" />,
      title: "Personalize Your Experience",
      description: "Share your travel preferences.",
      subtext: "We'll craft your perfect adventure."
    },
    {
      icon: <Plane className="h-10 w-10 text-blue-600" />,
      title: "Get Instant Itinerary",
      description: "Receive a detailed daily plan.",
      subtext: "With local insights and optimal routes."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
      title: "Chat & Refine in Real-Time",
      description: "Need changes? Just ask.",
      subtext: "Get instant personalized alternatives."
    }
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold mb-4 text-gray-800 md:text-4xl"
          >
            How It Works
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Planning your trip should be as enjoyable as the journey itself. Our AI makes it simple.
          </motion.p>
        </motion.div>

        {/* Process Steps Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={fadeIn}
              className="flex flex-col items-center p-6 rounded-xl shadow-md transform transition-all duration-300 scale-105 shadow-lg bg-gray-50 h-[320px] relative"
            >
              {/* Step Icon */}
              <div className="mb-4 p-3 bg-blue-50 rounded-full">
                {step.icon}
              </div>
              {/* Step Title */}
              <h3 className="text-xl text-center font-semibold mb-4 text-gray-800">
                {step.title}
              </h3>
              {/* Step Description */}
              <div className="flex flex-col items-center text-center w-full mb-8">
                <p className="text-gray-600 font-medium mb-2">
                  {step.description}
                </p>
                <p className="text-gray-500 text-sm">
                  {step.subtext}
                </p>
              </div>
              {/* Step Number */}
              <div className="absolute bottom-6 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link 
            href="/fastplan"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
          >
            Start Planning Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;