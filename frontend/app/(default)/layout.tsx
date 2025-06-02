/**
 * Default Layout Component
 * 
 * A wrapper component that provides the common layout structure for all pages in the (default) route group.
 * Features:
 * - Header navigation
 * - Footer with border
 * - AOS (Animate On Scroll) initialization
 * - Responsive design
 * - Clean and minimal structure
 */

"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

/**
 * DefaultLayout Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 * 
 * Features:
 * - Initializes AOS with custom configuration
 * - Provides consistent header and footer across pages
 * - Maintains clean and minimal structure
 * - Handles responsive layout
 */
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize AOS with custom configuration
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });

  }, []); 

  return (
    <>
      
      <Header />

      {/* Reverted main element, removed relative positioning and decorative container */}
      <main className="grow -mt-14">

        {/* Removed Decorative background container div and its contents */}

        {children}

      </main>

      <Footer border={true} />
    </>
  );
}