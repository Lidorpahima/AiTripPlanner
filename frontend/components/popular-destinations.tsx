'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Info } from 'lucide-react';

// Animation variants
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
      staggerChildren: 0.15
    }
  }
};

// Define destinations with external image URLs
const destinations = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=500&h=300&auto=format",
    description: "The city of lights and romance",
    query: "Paris, France"
  },
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=500&h=300&auto=format",
    description: "Modern meets traditional in this vibrant metropolis",
    query: "Tokyo, Japan"
  },
  {
    name: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=500&h=300&auto=format",
    description: "Ancient history and delicious cuisine",
    query: "Rome, Italy"
  },
  {
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500&h=300&auto=format",
    description: "Paradise beaches and spiritual experiences",
    query: "Bali, Indonesia"
  },
  {
    name: "New York, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=500&h=300&auto=format",
    description: "The city that never sleeps",
    query: "New York, USA"
  },
  {
    name: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=500&h=300&auto=format", 
    description: "Unique architecture and Mediterranean vibes",
    query: "Barcelona, Spain"
  }
];

const PopularDestinations: React.FC = () => {
  const router = useRouter();

  const handleDestinationClick = (query: string) => {
    router.push(`/fastplan?destination=${encodeURIComponent(query)}`);
  };

  return (
    <section className=" py-16 md:py-24 overflow-hidden">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
              <div className="relative h-64 w-full overflow-hidden">
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
                         <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                       ))}
                       <span className="ml-1.5 text-xs text-gray-200">(15 trips)</span>
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

        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => router.push('/fastplan')}
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