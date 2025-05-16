'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, ListChecks, Plane, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <MapPin className="h-10 w-10 text-blue-600" />,
      title: "Select Your Destination",
      description: "Choose where and when you want to travel - our AI planning assistant handles the rest."
    },
    {
      icon: <ListChecks className="h-10 w-10 text-blue-600" />,
      title: "Personalize Your Experience",
      description: "Customize your preferences, interests, and travel style to create your perfect adventure."
    },
    {
      icon: <Plane className="h-10 w-10 text-blue-600" />,
      title: "Get Instant Itinerary",
      description: "Our AI instantly creates a day-by-day plan with optimized routes and local recommendations."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
      title: "Chat & Refine in Real-Time",
      description: "Don't like an activity? Chat with our AI and get instant alternatives tailored just for you."
    }
  ];

  return (
    <section className=" py-16 md:py-24 verflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
              className="flex flex-col items-center p-6 rounded-xl shadow-md transform transition-all duration-300 scale-105 shadow-lg bg-gray-50"
            >
              <div className="mb-4 p-3 bg-blue-50 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl text-center font-semibold mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-center text-gray-600 h-[85px] flex items-center">
                {step.description}
              </p>
              <div className="mt-4 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>

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