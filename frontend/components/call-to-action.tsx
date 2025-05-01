'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Bot } from 'lucide-react';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7
    }
  }
};

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row items-center justify-between"
        >
          <motion.div variants={fadeIn} className="mb-10 lg:mb-0 lg:pr-10 lg:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Next Adventure?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              Plan your perfect trip in minutes with our AI-powered travel assistant. 
              Get personalized itineraries, local insights, and budgeting tools all in one place.
            </p>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.5, delay: 0.2 }
              }
            }}
            className="w-full lg:w-1/3"
          >
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Start Planning Your Trip
              </h3>
              
              <div className="flex items-center border-2 border-gray-200 rounded-lg mb-5 focus-within:border-blue-500 transition-colors">
                <div className="pl-4 pr-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none bg-transparent"
                />
              </div>
              
              <Link 
                href="/fastplan"
                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center transition-all duration-300 ease-in-out"
              >
                Plan My Trip Now
              </Link>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Free to use. No credit card required.
              </p>
            </div>

            <motion.div
              variants={fadeIn}
              className="mt-6 text-center lg:text-left"
            >
              <p className="text-sm text-blue-100 flex items-center justify-center lg:justify-start">
                <Bot size={16} className="mr-2 opacity-80" />
                <span>Or chat with our AI planner directly!</span>
                <Link href="/fastplan" className="ml-1 font-medium text-white hover:underline">Start here</Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;