'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
      staggerChildren: 0.2
    }
  }
};

const testimonials = [
  {
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Travel Enthusiast",
    content: "The AI Trip Planner made planning my Europe trip so easy! It created the perfect itinerary that included all the major attractions while still giving me time to explore on my own.",
    rating: 5
  },
  {
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    role: "Digital Nomad",
    content: "As someone who travels frequently for work and leisure, this tool has been a game-changer. It saved me hours of research and created better routes than I would have planned myself.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    role: "Family Traveler",
    content: "Planning a family trip with kids can be overwhelming, but this planner made it simple. The pace options were perfect for accommodating our needs with young children.",
    rating: 4
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-gray-800 md:text-4xl mb-4"
          >
            Travelers Love Our Planner
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Join thousands of satisfied travelers who have simplified their trip planning with our AI.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-blue-100">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="object-cover"
                    width={56}
                    height={56}
                    unoptimized={true}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600">"{testimonial.content}"</p>
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
          <p className="text-blue-600 font-medium">Based on 1,200+ reviews from satisfied travelers</p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;