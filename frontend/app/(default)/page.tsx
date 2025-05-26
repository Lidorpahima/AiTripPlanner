/**
 * Home Page Component
 * 
 * The main landing page of the application that showcases:
 * - Hero section with rotating globe animation
 * - Device showcase section
 * - How it works section
 * - Popular destinations section
 * - Call to action section
 * 
 * Features:
 * - Responsive design with mobile and desktop layouts
 * - Animated sections using AOS (Animate On Scroll)
 * - Background images and gradients
 * - Blur effects and modern UI elements
 */

'use client';

import Hero from "@/components/hero-home";
import SectionBlob from "@/components/ui/SectionBlob";
import HowItWorksSection from "@/components/how-it-works";
import PopularDestinations from "@/components/popular-destinations";
import CallToAction from "@/components/call-to-action";
import { CompactDeviceShowcase } from "@/components/Preview";

/**
 * Home Component
 * 
 * Renders the main landing page with multiple sections:
 * 1. Hero section with globe animation
 * 2. Device showcase section
 * 3. How it works section
 * 4. Popular destinations section
 * 5. Call to action section
 * 
 * Each section includes:
 * - Responsive background images
 * - AOS animations
 * - Blur effects
 * - Gradient overlays
 */
export default function Home() {
  return (
    <>
      {/* Hero Section with Rotating Globe */}
      <section className="relative px-4 sm:px-6 md:px-8 py-4 sm:py-10 md:py-12 bg-transparent">
        <div className="absolute inset-0 -top-10 bg-[url('/mobile/60.webp')] md:bg-[url('/desktop/60.webp')] bg-fill bg-center bg-no-repeat opacity-100">
        </div>
      {/* Add the Globe animation component */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>
        {/* Hero Content with AOS animation */}
        <div 
          data-aos-once="true"
          data-aos="fade-up"
          data-aos-duration="1000" 
          className="mx-auto w-full max-w-7xl relative z-10 bg-white/100 backdrop-blur-lg rounded-xl p-4 sm:p-6 md:p-8 shadow-xl border border-blue-200/60 mt-15"
        >
          <Hero />
        </div>
      </section>

      {/* CompactDeviceShowcase */}
      <section className="relative py-8 md:py-12 bg-transparent overflow-hidden px-4 sm:px-6 md:px-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-full h-full bg-[url('/mobile/w.webp')] md:bg-[url('/desktop/w.webp')] bg-cover bg-center opacity-80">

      </div>
        </div>
        <div className="relative z-10 mx-auto w-auto max-w-7xl">
          <div 
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-once="true"
            className="text-center">

          </div>
          <CompactDeviceShowcase />
        </div>
      </section>

      
      {/* How It Works Section */}
      <section className="relative py-8 md:py-12 lg:py-20 bg-transparent overflow-hidden px-4 sm:px-6 md:px-8" id="how-it-works">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 -top-10 bg-[url('/mobile/61.webp')] md:bg-[url('/desktop/61.webp')] bg-cover bg-center opacity-100">

          </div>
        </div>
        <div 
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto w-full max-w-7xl relative z-10 bg-white/100 backdrop-blur-lg rounded-xl p-4 sm:p-6 md:p-8 shadow-xl border border-blue-200/60"        >
          <HowItWorksSection />
        </div>
      </section>
      
      {/* Popular Destinations Section */}
      <section className="relative py-8 md:py-12 lg:py-20 bg-transparent overflow-hidden px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 -top-10 bg-[url('/mobile/62.webp')] md:bg-[url('/desktop/62.webp')] bg-cover bg-center opacity-100">
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        </div>
        <div 
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-once="true"
          className="mx-auto w-full max-w-7xl relative z-10 bg-white/100 backdrop-blur-lg rounded-xl p-4 sm:p-6 md:p-8 shadow-xl border border-blue-200/60"        >
          <PopularDestinations />
        </div>
      </section>


      {/* Call To Action Section */}
      <section className="relative pt-8 md:pt-12 lg:pt-20 overflow-hidden px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('/mobile/cca5022c86f67861746d7cf2eb486de8.gif')] md:bg-[url('/desktop/cca5022c86f67861746d7cf2eb486de8.gif')] bg-cover bg-center opacity-90">
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-white to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </div>
        <div className="relative z-10 w-auto mx-auto max-w-7xl">
          <CallToAction />
        </div>
      </section>
    </>
  );
}