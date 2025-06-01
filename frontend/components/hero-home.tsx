/**
 * Hero Home Component
 * 
 * The main hero section of the landing page featuring:
 * - Animated headline and call-to-action buttons
 * - Interactive image grid showcasing destinations
 * - Rocket animation on CTA click
 * - Responsive layout with mobile optimization
 */

"use client";
import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Lobster } from "next/font/google";
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

// Import destination images
import ImgTokyo from "@/public/images/destinations/rhome.webp";
import ImgRome from "@/public/images/destinations/lhero.webp";
import ImgParis from "@/public/images/destinations/parisHero.webp";
import ImgBali from "@/public/images/destinations/mHero.webp";

/**
 * Lobster font configuration for decorative text elements
 */
const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const YouTubeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-black p-2 shadow-xl transition-all">
                <div className="relative">
                  <button
                    onClick={onClose}
                    className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-1 text-gray-800 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="aspect-video w-full">
                    <iframe
                      className="h-full w-full rounded-lg"
                      src="https://www.youtube.com/embed/6uL0fIyznXc?autoplay=1&rel=0"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

/**
 * HeroHome Component
 * 
 * Main hero section component that displays the landing page's primary content.
 * Features a split layout with text content and an image grid.
 */
export default function HeroHome() {
  /**
   * State for controlling the rocket animation
   */
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  /**
   * Handles the click event on the "Plan Your Journey" button
   * Triggers the rocket animation
   */
  const handlePlanJourneyClick = () => {
    setIsRocketLaunching(true);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Main content container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-12 pt-5 md:pb-20 md:pt-28">
          {/* Flex container for main content layout */}
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-8">
            {/* Left Column: Text Content */}
            <div className="lg:w-1/2">
              {/* Section header with animated elements */}
              <div className="pb-8 text-left md:pb-12 pt-7">
                <h1
                  className="mb-6 border-y text-5xl font-bold text-center md:text-left [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-6xl"
                  data-aos="zoom-y-out"
                  data-aos-once="true"
                  data-aos-delay={150}
                >
                  Pick Your Dates, <br className="max-lg:hidden" />We'll<span className={`${lobster.className} text-indigo-600`}>  Plan the Rest. </span>
                </h1>
                <div className="max-w-3xl">
                  <p
                    className="mb-8 text-lg text-gray-700"
                    data-aos="zoom-y-out"
                    data-aos-once="true"
                    data-aos-delay={300}
                  >
                    Smart itineraries with routes, sights, and local events.
                  </p>
                  {/* CTA Buttons */}
                  <div
                    className="max-w-xs sm:flex sm:max-w-none sm:justify-center"
                    data-aos="zoom-y-out"
                    data-aos-delay={450}
                    data-aos-once="true"
                  >
                    {/* Plan Journey Button with Rocket Animation */}
                    <Link
                      href="/fastplan"
                      className="btn group mb-4 w-full text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out sm:mb-0 sm:w-auto"
                      onClick={handlePlanJourneyClick}
                    >
                      <span className="relative inline-flex items-center">
                        Plan Your Journey
                      </span>
                      <motion.img
                        src="https://images.emojiterra.com/google/noto-emoji/animated-emoji/1f680.gif"
                        alt="Rocket"
                        width="20"
                        height="20"
                        className="ml-1 tracking-normal"
                        animate={isRocketLaunching ? {
                          y: -60,
                          x: 70,
                          scale: 1.8,
                          opacity: 0,
                          rotate: -15
                        } : {
                          y: 0, x: 0, scale: 1, opacity: 1, rotate: 0
                        }}
                        transition={isRocketLaunching ? {
                          duration: 0.4,
                          ease: "easeOut"
                        } : {
                          duration: 0.2
                        }}
                      />
                    </Link>
                    {/* Watch Demo Button */}
                    <a
                      className="btn group w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white sm:ml-4 sm:w-auto flex items-center justify-center shadow-sm cursor-pointer"
                      onClick={() => setIsVideoModalOpen(true)}
                    >
                      <svg className="mr-2 h-4 w-4 shrink-0 fill-current text-indigo-600 group-hover:text-white" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.679 7.126a.998.998 0 0 0-.023-.113l-.002-.005a1.005 1.005 0 0 0-.144-.27L1.593.324A.999.999 0 0 0 .141.996v14.008a.999.999 0 0 0 1.452.874l13.918-6.409a1 1 0 0 0 .168-.873Z"/>
                      </svg>
                      <span>Watch <span className={`${lobster.className} text-indigo-600 group-hover:text-white`}>Magic</span></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image Grid */}
            <div className="grid w-full grid-cols-3 grid-rows-2 gap-4 lg:w-1/2">
              {/* Tokyo Image */}
              <div className="col-span-2 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgTokyo} alt="Tokyo" priority />
              </div>
              {/* Paris Image */}
              <div className="col-span-1 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgParis} alt="Paris" />
              </div>
              {/* Rome Image */}
              <div className="col-span-1 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgRome} alt="Rome" />
              </div>
              {/* Bali Image */}
              <div className="col-span-2 row-span-1 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group">
                <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={ImgBali} alt="Bali" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <YouTubeModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </section>
  );
}
