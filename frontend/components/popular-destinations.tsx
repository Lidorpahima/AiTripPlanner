/**
 * Popular Destinations Component
 * 
 * Displays a grid of popular travel destinations with images, descriptions, and ratings.
 * Features:
 * - Animated entrance effects using Framer Motion
 * - Interactive hover effects
 * - Responsive grid layout
 * - Star ratings and review counts
 * - Click navigation to trip planning
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Info } from 'lucide-react';

// Animation configuration
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Destination data structure
interface Destination {
  name: string;
  image: string;
  description: string;
  query: string;
  rating: number;
  reviews: number;
}

// Popular destinations data
const destinations: Destination[] = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=500&h=300&auto=format",
    description: "The city of lights and romance",
    query: "Paris, France",
    rating: 4.8,
    reviews: 2459
  },
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=500&h=300&auto=format",
    description: "Modern meets traditional in this vibrant metropolis",
    query: "Tokyo, Japan",
    rating: 4.7,
    reviews: 1897
  },
  {
    name: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=500&h=300&auto=format",
    description: "Ancient history and delicious cuisine",
    query: "Rome, Italy",
    rating: 4.6,
    reviews: 2128
  },
  {
    name: "Santorini, Greece",
    image: "https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Iconic whitewashed villages and stunning sunsets",
    query: "Santorini, Greece",
    rating: 4.9,
    reviews: 1738
  },
  {
    name: "New York, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=500&h=300&auto=format",
    description: "The city that never sleeps",
    query: "New York, USA",
    rating: 4.5,
    reviews: 3206
  },
  {
    name: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=500&h=300&auto=format", 
    description: "Unique architecture and Mediterranean vibes",
    query: "Barcelona, Spain",
    rating: 4.7,
    reviews: 1982
  }
];

/**
 * PopularDestinations Component
 * Renders a grid of popular travel destinations with animations and interactive features
 */
const PopularDestinations: React.FC = () => {
  const router = useRouter();

  /**
   * Handles destination card click
   * Navigates to the trip planning page with the selected destination
   */
  const handleDestinationClick = (query: string) => {
    router.push(`/fastplan?destination=${encodeURIComponent(query)}`);
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-gray-800 md:text-4xl mb-4"
          >
            Popular Destinations
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Get inspired by these trending destinations and start planning your next adventure.
          </motion.p>
        </motion.div>

        {/* Destinations Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {destinations.map((destination, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              onClick={() => handleDestinationClick(destination.query)}
              className="group cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  width={500}
                  height={300}
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-100"></div>
                <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                  <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{destination.description}</p>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(destination.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                        />
                      ))}
                      <span className="ml-1.5 text-xs text-gray-200">({destination.reviews} trips)</span>
                    </div>
                    <div className="flex items-center text-xs text-blue-300 group-hover:text-blue-200">
                      <Info size={14} className="mr-1" />
                      <span>Details</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => router.push('/destinations')}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
          >
            <span>View more destinations</span>
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularDestinations;