/**
 * AuthLayout Component
 * 
 * A layout component for authentication pages that provides:
 * - Two-column responsive layout
 * - Left column for authentication forms
 * - Right column for feature highlights
 * - Logo display with fallback
 * - Consistent styling across auth pages
 * - Responsive design
 * - Type safety with TypeScript
 * - Accessibility features
 */

import React from 'react';
import Image from 'next/image';

/**
 * Props interface for AuthLayout component
 * @property children - Child components to render in the form section
 * @property headerText - Main heading text for the auth page
 * @property subText - Subheading text for the auth page
 */
interface AuthLayoutProps {
  children: React.ReactNode;
  headerText: string;
  subText: string;
}

/**
 * AuthLayout Component
 * 
 * Renders a two-column layout for authentication pages with a form section
 * and a feature highlights section. Provides consistent styling and structure
 * across all authentication pages.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  headerText,
  subText
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 shadow-xl rounded-xl overflow-hidden w-full max-w-6xl">
        {/* Left Column - Form Section */}
        <div className="bg-white p-8 md:p-12">
          {/* Logo and Header Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 mb-4 relative">
              <Image 
                src="/images/logo.png" 
                alt="Travel Planner Logo"
                width={128}
                height={128}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/svg/compass.svg'; 
                }}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">{headerText}</h2>
            <p className="text-gray-500 mt-1 mb-6">{subText}</p>
          </div>
          
          {/* Form Content */}
          {children}
        </div>
        
        {/* Right Column - Features Section */}
        <div className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 p-12 text-white flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            {/* Main Heading */}
            <div className="flex items-center mb-4">
              <h3 className="text-3xl font-bold">Discover the World Smarter</h3>
            </div>
            
            {/* Subheading */}
            <p className="text-lg opacity-90 mb-8">
              Our smart travel planner handles all the details, so you can focus on what matters most - enjoying the experience.
            </p>
            
            {/* Features List */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">Everything included at no cost:</h4>
              
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 gap-4">
                {/* Smart Itinerary Planning Feature */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h5 className="font-medium text-lg mb-2 flex items-center">
                    Smart Itinerary Planning
                    <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                  </h5>
                  <p className="opacity-90">AI-powered personalized routes based on your preferences and travel style</p>
                </div>
                
                {/* Budget Optimization Feature */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h5 className="font-medium text-lg mb-2 flex items-center">
                    Budget Optimization
                    <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                  </h5>
                  <p className="opacity-90">Recommendations tailored to your budget with cost-saving options</p>
                </div>
                
                {/* Unlimited Trip Storage Feature */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h5 className="font-medium text-lg mb-2 flex items-center">
                    Unlimited Trip Storage
                    <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                  </h5>
                  <p className="opacity-90">Save as many trip plans as you want with no storage limitations</p>
                </div>
                
                {/* Hidden Gems Access Feature */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h5 className="font-medium text-lg mb-2 flex items-center">
                    Hidden Gems Access
                    <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-2 rounded">FREE</span>
                  </h5>
                  <p className="opacity-90">Discover local secrets and off-the-beaten-path attractions</p>
                </div>
              </div>
              
              {/* Free Forever Note */}
              <p className="text-sm italic">
                No credit card required. No hidden fees. No premium tier. All features are completely free forever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;