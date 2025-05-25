'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Info, Search, Dice6 } from 'lucide-react';

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

// Define all destinations with external image URLs
const allDestinations = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=500&h=300&auto=format",
    description: "The city of lights and romance",
    query: "Paris, France",
    rating: 4.7,
    reviews: 12500
  },
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=500&h=300&auto=format",
    description: "Modern meets traditional in this vibrant metropolis",
    query: "Tokyo, Japan",
    rating: 4.8,
    reviews: 9800
  },
  {
    name: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=500&h=300&auto=format",
    description: "Ancient history and delicious cuisine",
    query: "Rome, Italy",
    rating: 4.6,
    reviews: 11200
  },
  {
    name: "Santorini, Greece",
    image: "https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Iconic whitewashed villages and stunning sunsets",
    query: "Santorini, Greece",
    rating: 4.9,
    reviews: 8500
  },
  {
    name: "New York, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=500&h=300&auto=format",
    description: "The city that never sleeps",
    query: "New York, USA",
    rating: 4.5,
    reviews: 15800
  },
  {
    name: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=500&h=300&auto=format", 
    description: "Unique architecture and Mediterranean vibes",
    query: "Barcelona, Spain",
    rating: 4.7,
    reviews: 9200
  },
  {
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500&h=300&auto=format",
    description: "Tropical paradise with rich culture",
    query: "Bali, Indonesia",
    rating: 4.8,
    reviews: 11500
  },
  {
    name: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=500&h=300&auto=format",
    description: "Modern luxury and desert adventures",
    query: "Dubai, UAE",
    rating: 4.6,
    reviews: 7800
  },
  {
    name: "Sydney, Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=500&h=300&auto=format",
    description: "Stunning harbor and vibrant city life",
    query: "Sydney, Australia",
    rating: 4.7,
    reviews: 6800
  },
  {
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=500&h=300&auto=format",
    description: "Crystal clear waters and overwater bungalows",
    query: "Maldives",
    rating: 4.9,
    reviews: 6200
  },
  {
    name: "Petra, Jordan",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=500&h=300&auto=format",
    description: "Ancient city carved in rose-red rock",
    query: "Petra, Jordan",
    rating: 4.8,
    reviews: 3200
  },
  {
    name: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=500&h=300&auto=format",
    description: "Ancient Incan citadel in the Andes",
    query: "Machu Picchu, Peru",
    rating: 4.9,
    reviews: 4800
  },
  {
    name: "Banff, Canada",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=500&h=300&auto=format",
    description: "Stunning mountain landscapes and turquoise lakes",
    query: "Banff, Canada",
    rating: 4.8,
    reviews: 4200
  },
  {
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=500&h=300&auto=format",
    description: "Traditional temples and gardens",
    query: "Kyoto, Japan",
    rating: 4.9,
    reviews: 7800
  },
  {
    name: "Queenstown, New Zealand",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=500&h=300&auto=format",
    description: "Adventure capital with stunning landscapes",
    query: "Queenstown, New Zealand",
    rating: 4.8,
    reviews: 3500
  },
  {
    name: "Marrakech, Morocco",
    image: "https://images.unsplash.com/photo-1597212729060-13d3727d8015?q=80&w=500&h=300&auto=format",
    description: "Vibrant markets and rich traditions",
    query: "Marrakech, Morocco",
    rating: 4.6,
    reviews: 4200
  },
  {
    name: "Havana, Cuba",
    image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?q=80&w=500&h=300&auto=format",
    description: "Colorful streets and vintage cars",
    query: "Havana, Cuba",
    rating: 4.7,
    reviews: 2800
  },
  {
    name: "Jaipur, India",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=500&h=300&auto=format",
    description: "Pink city with magnificent palaces",
    query: "Jaipur, India",
    rating: 4.6,
    reviews: 3800
  },
  {
    name: "Cappadocia, Turkey",
    image: "https://images.unsplash.com/photo-1533619043865-1f0c0b7b0b8a?q=80&w=500&h=300&auto=format",
    description: "Hot air balloons over fairy chimneys",
    query: "Cappadocia, Turkey",
    rating: 4.8,
    reviews: 5200
  },
  {
    name: "Reykjavik, Iceland",
    image: "https://images.unsplash.com/photo-1529961011878-1688b7738aec?q=80&w=500&h=300&auto=format",
    description: "Northern lights and geothermal wonders",
    query: "Reykjavik, Iceland",
    rating: 4.7,
    reviews: 4200
  },
  {
    name: "Hoi An, Vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500&h=300&auto=format",
    description: "Ancient town with lantern-lit streets",
    query: "Hoi An, Vietnam",
    rating: 4.8,
    reviews: 5800
  },
  {
    name: "Siem Reap, Cambodia",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=500&h=300&auto=format",
    description: "Gateway to Angkor Wat temples",
    query: "Siem Reap, Cambodia",
    rating: 4.7,
    reviews: 4200
  },
  {
    name: "Cusco, Peru",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=500&h=300&auto=format",
    description: "Historic heart of the Inca Empire",
    query: "Cusco, Peru",
    rating: 4.8,
    reviews: 3800
  },
  {
    name: "Kruger National Park, South Africa",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Wildlife safari adventures",
    query: "Kruger National Park, South Africa",
    rating: 4.9,
    reviews: 2800
  },
  {
    name: "Galapagos Islands, Ecuador",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Unique wildlife and pristine nature",
    query: "Galapagos Islands, Ecuador",
    rating: 4.9,
    reviews: 1800
  },
  {
    name: "Bhutan",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Himalayan kingdom of happiness",
    query: "Bhutan",
    rating: 4.8,
    reviews: 950
  },
  {
    name: "Patagonia, Argentina",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Dramatic landscapes and glaciers",
    query: "Patagonia, Argentina",
    rating: 4.9,
    reviews: 2200
  },
  {
    name: "Seychelles",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Tropical paradise with granite islands",
    query: "Seychelles",
    rating: 4.8,
    reviews: 1800
  },
  {
    name: "Bora Bora, French Polynesia",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Luxury overwater bungalows and turquoise lagoon",
    query: "Bora Bora, French Polynesia",
    rating: 4.9,
    reviews: 2200
  },
  {
    name: "Antarctica",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Last frontier of wilderness",
    query: "Antarctica",
    rating: 4.9,
    reviews: 650
  },
  {
    name: "Mongolia",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Vast steppes and nomadic culture",
    query: "Mongolia",
    rating: 4.7,
    reviews: 850
  },
  {
    name: "Namibia",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Desert landscapes and wildlife",
    query: "Namibia",
    rating: 4.8,
    reviews: 1200
  },
  {
    name: "Amsterdam, Netherlands",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=500&h=300&auto=format",
    description: "Historic canals and artistic heritage",
    query: "Amsterdam, Netherlands",
    rating: 4.7,
    reviews: 8500
  },
  {
    name: "Bangkok, Thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=500&h=300&auto=format",
    description: "Vibrant street life and rich culture",
    query: "Bangkok, Thailand",
    rating: 4.6,
    reviews: 9200
  },
  {
    name: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=500&h=300&auto=format",
    description: "Ancient pyramids and rich history",
    query: "Cairo, Egypt",
    rating: 4.5,
    reviews: 4800
  },
  {
    name: "Cape Town, South Africa",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=500&h=300&auto=format",
    description: "Stunning landscapes and diverse culture",
    query: "Cape Town, South Africa",
    rating: 4.8,
    reviews: 5200
  },
  {
    name: "Hong Kong, China",
    image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=500&h=300&auto=format",
    description: "Dynamic cityscape and culinary paradise",
    query: "Hong Kong, China",
    rating: 4.7,
    reviews: 7800
  },
  {
    name: "Istanbul, Turkey",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=500&h=300&auto=format",
    description: "Where East meets West",
    query: "Istanbul, Turkey",
    rating: 4.6,
    reviews: 6800
  },
  {
    name: "London, UK",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=500&h=300&auto=format",
    description: "Historic landmarks and modern culture",
    query: "London, UK",
    rating: 4.7,
    reviews: 14200
  },
  {
    name: "Maui, Hawaii",
    image: "https://images.unsplash.com/photo-1507876466758-bc54f384809c?q=80&w=500&h=300&auto=format",
    description: "Tropical paradise and volcanic landscapes",
    query: "Maui, Hawaii",
    rating: 4.9,
    reviews: 5800
  },
  {
    name: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=500&h=300&auto=format",
    description: "Bustling metropolis and Bollywood magic",
    query: "Mumbai, India",
    rating: 4.5,
    reviews: 4200
  },
  {
    name: "Prague, Czech Republic",
    image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=500&h=300&auto=format",
    description: "Medieval architecture and rich history",
    query: "Prague, Czech Republic",
    rating: 4.8,
    reviews: 7200
  },
  {
    name: "Rio de Janeiro, Brazil",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=500&h=300&auto=format",
    description: "Beaches, carnival, and vibrant culture",
    query: "Rio de Janeiro, Brazil",
    rating: 4.7,
    reviews: 5800
  },
  {
    name: "Seoul, South Korea",
    image: "https://images.unsplash.com/photo-1538485399081-7c8ed73097b9?q=80&w=500&h=300&auto=format",
    description: "Modern technology meets traditional culture",
    query: "Seoul, South Korea",
    rating: 4.6,
    reviews: 6800
  },
  {
    name: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=500&h=300&auto=format",
    description: "Garden city with futuristic architecture",
    query: "Singapore",
    rating: 4.8,
    reviews: 8200
  },
  {
    name: "Venice, Italy",
    image: "https://images.unsplash.com/photo-1534113416831-0d0b35f3f1a9?q=80&w=500&h=300&auto=format",
    description: "Romantic canals and historic charm",
    query: "Venice, Italy",
    rating: 4.9,
    reviews: 9200
  },
  {
    name: "Vienna, Austria",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=500&h=300&auto=format",
    description: "Classical music and imperial history",
    query: "Vienna, Austria",
    rating: 4.7,
    reviews: 6800
  },
  {
    name: "Zanzibar, Tanzania",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=500&h=300&auto=format",
    description: "Pristine beaches and spice islands",
    query: "Zanzibar, Tanzania",
    rating: 4.8,
    reviews: 3200
  },
  {
    name: "Mauritius",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Tropical paradise with diverse culture",
    query: "Mauritius",
    rating: 4.8,
    reviews: 2800
  },
  {
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=500&h=300&auto=format",
    description: "Iconic whitewashed villages and stunning sunsets",
    query: "Santorini, Greece",
    rating: 4.9,
    reviews: 8500
  },
  {
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=500&h=300&auto=format",
    description: "Traditional temples and gardens",
    query: "Kyoto, Japan",
    rating: 4.9,
    reviews: 7800
  },
  {
    name: "Queenstown, New Zealand",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=500&h=300&auto=format",
    description: "Adventure capital with stunning landscapes",
    query: "Queenstown, New Zealand",
    rating: 4.8,
    reviews: 3500
  },
  {
    name: "Marrakech, Morocco",
    image: "https://images.unsplash.com/photo-1597212729060-13d3727d8015?q=80&w=500&h=300&auto=format",
    description: "Vibrant markets and rich traditions",
    query: "Marrakech, Morocco",
    rating: 4.6,
    reviews: 4200
  },
  {
    name: "Havana, Cuba",
    image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?q=80&w=500&h=300&auto=format",
    description: "Colorful streets and vintage cars",
    query: "Havana, Cuba",
    rating: 4.7,
    reviews: 2800
  },
  {
    name: "Jaipur, India",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=500&h=300&auto=format",
    description: "Pink city with magnificent palaces",
    query: "Jaipur, India",
    rating: 4.6,
    reviews: 3800
  },
  {
    name: "Cappadocia, Turkey",
    image: "https://images.unsplash.com/photo-1533619043865-1f0c0b7b0b8a?q=80&w=500&h=300&auto=format",
    description: "Hot air balloons over fairy chimneys",
    query: "Cappadocia, Turkey",
    rating: 4.8,
    reviews: 5200
  },
  {
    name: "Reykjavik, Iceland",
    image: "https://images.unsplash.com/photo-1529961011878-1688b7738aec?q=80&w=500&h=300&auto=format",
    description: "Northern lights and geothermal wonders",
    query: "Reykjavik, Iceland",
    rating: 4.7,
    reviews: 4200
  },
  {
    name: "Hoi An, Vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500&h=300&auto=format",
    description: "Ancient town with lantern-lit streets",
    query: "Hoi An, Vietnam",
    rating: 4.8,
    reviews: 5800
  },
  {
    name: "Siem Reap, Cambodia",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=500&h=300&auto=format",
    description: "Gateway to Angkor Wat temples",
    query: "Siem Reap, Cambodia",
    rating: 4.7,
    reviews: 4200
  },
  {
    name: "Cusco, Peru",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=500&h=300&auto=format",
    description: "Historic heart of the Inca Empire",
    query: "Cusco, Peru",
    rating: 4.8,
    reviews: 3800
  },
  {
    name: "Kruger National Park, South Africa",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Wildlife safari adventures",
    query: "Kruger National Park, South Africa",
    rating: 4.9,
    reviews: 2800
  },
  {
    name: "Galapagos Islands, Ecuador",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Unique wildlife and pristine nature",
    query: "Galapagos Islands, Ecuador",
    rating: 4.9,
    reviews: 1800
  },
  {
    name: "Bhutan",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Himalayan kingdom of happiness",
    query: "Bhutan",
    rating: 4.8,
    reviews: 950
  },
  {
    name: "Patagonia, Argentina",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Dramatic landscapes and glaciers",
    query: "Patagonia, Argentina",
    rating: 4.9,
    reviews: 2200
  },
  {
    name: "Seychelles",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Tropical paradise with granite islands",
    query: "Seychelles",
    rating: 4.8,
    reviews: 1800
  },
  {
    name: "Bora Bora, French Polynesia",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Luxury overwater bungalows and turquoise lagoon",
    query: "Bora Bora, French Polynesia",
    rating: 4.9,
    reviews: 2200
  },
  {
    name: "Antarctica",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Last frontier of wilderness",
    query: "Antarctica",
    rating: 4.9,
    reviews: 650
  },
  {
    name: "Mongolia",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Vast steppes and nomadic culture",
    query: "Mongolia",
    rating: 4.7,
    reviews: 850
  },
  {
    name: "Namibia",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=500&h=300&auto=format",
    description: "Desert landscapes and wildlife",
    query: "Namibia",
    rating: 4.8,
    reviews: 1200
  }
];

const AllDestinations: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState(allDestinations);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<typeof allDestinations[0] | null>(null);
  const [showSelected, setShowSelected] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredDestinations(allDestinations);
      return;
    }
    
    const filtered = allDestinations.filter(destination => {
      const matches = destination.name.toLowerCase().includes(query.toLowerCase()) ||
        destination.description.toLowerCase().includes(query.toLowerCase());
      return matches;
    });
    
    setFilteredDestinations(filtered);
  };

  const handleDestinationClick = (query: string) => {
    router.push(`/fastplan?destination=${encodeURIComponent(query)}`);
  };

  const rollDice = () => {
    setIsRolling(true);
    setShowSelected(false);

    let rollCount = 0;
    const maxRolls = 20;
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * allDestinations.length);
      setSelectedDestination(allDestinations[randomIndex]);
      rollCount++;
      
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setIsRolling(false);
        setShowSelected(true);
      }
    }, 100);
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden">
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
            Explore All Destinations
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="max-w-2xl mx-auto text-lg text-gray-600 mb-8"
          >
            Discover amazing places around the world and start planning your next adventure.
          </motion.p>

          {/* DICE Button */}
          <motion.div
            variants={fadeIn}
            className="mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={rollDice}
              disabled={isRolling}
              className={`
                relative px-8 py-4 rounded-full text-white font-bold text-lg
                ${isRolling 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }
                shadow-lg hover:shadow-xl transition-all duration-300
                flex items-center gap-3
              `}
            >
              <motion.div
                animate={isRolling ? { rotate: 360 } : {}}
                transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
              >
                <Dice6 size={24} />
              </motion.div>
              {isRolling ? 'Rolling...' : 'Roll the Dice!'}
            </motion.button>
          </motion.div>

          {/* Selected Destination Display */}
          <AnimatePresence>
            {showSelected && selectedDestination && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className="max-w-2xl mx-auto mb-12"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-blue-600 mb-2"
                >
                  Your Next Adventure Awaits!
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold text-gray-800 mb-4"
                >
                  {selectedDestination.name}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-gray-600 mb-6"
                >
                  {selectedDestination.description}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDestinationClick(selectedDestination.query)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Plan This Trip
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            variants={fadeIn}
            className="max-w-md mx-auto relative"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredDestinations.map((destination) => (
              <motion.div
                key={destination.query}
                variants={fadeIn}
                onClick={() => handleDestinationClick(destination.query)}
                className="group cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    width={500}
                    height={300}
                    unoptimized={true}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-sm opacity-90 mb-2">{destination.description}</p>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={`${destination.query}-star-${i}`} 
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
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default AllDestinations; 