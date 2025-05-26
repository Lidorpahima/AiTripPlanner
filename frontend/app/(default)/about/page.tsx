/**
 * About Page Component
 * 
 * Displays information about the application and its creator, including:
 * - Application overview and features
 * - Technology stack details
 * - Creator information
 * - Social media links
 * 
 * Features:
 * - Clean and organized layout
 * - Responsive design
 * - Interactive social links
 * - Clear section separation
 */

import Link from 'next/link';

export const metadata = {
  title: "About - AiTripPlanner",
  description: "Learn more about AiTripPlanner and its creator.",
};

/**
 * AboutPage Component
 * 
 * Renders the about page with sections covering:
 * 1. Application Overview
 *    - Description of AiTripPlanner
 *    - Key features and capabilities
 *    - Technology integration (Gemini AI, Google Places)
 * 
 * 2. Creator Information
 *    - Developer background
 *    - Technical expertise
 *    - Social media links (LinkedIn, GitHub)
 * 
 * The page provides users with insights into the application's
 * development and the technology behind it.
 */
export default function AboutPage() {
  return (
    <section className="relative bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Page header */}
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">About AiTripPlanner</h1>
          </div>

          {/* Page content */}
          <div className="mx-auto max-w-3xl">
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                AiTripPlanner is a smart travel companion designed to simplify your trip planning. 
                Leveraging AI (powered by Gemini) and real-time data (from Google Places), 
                it generates personalized itineraries including optimized routes, points of interest, 
                and local events happening during your selected dates.
              </p>
              <p>
                Simply choose your destination and dates, select your travel style and pace, 
                and let AiTripPlanner craft a detailed plan for your next adventure. 
                Save your trips, access details, and explore the world more intelligently.
              </p>
              
              <hr className="my-8 border-t border-gray-200" />

              <h2 className="text-center text-3xl font-semibold">About the Creator</h2>
              <p>
                This project was developed by Lidor Pahima, a 3rd-year Computer Science student 
                with a strong interest in backend development, API integration, and Artificial Intelligence. 
                AiTripPlanner showcases the use of technologies like Django, Next.js, Redis, JWT, 
                and integration with powerful APIs like Google Places and Gemini.
              </p>
              <p className="text-center">
                Connect with Lidor on{ " "}   
                <Link href="https://www.linkedin.com/in/lidor-pahima/" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                LinkedIn
                </Link> or{ " "}   
                <Link href="https://github.com/Lidorpahima" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                   GitHub
                </Link>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
} 