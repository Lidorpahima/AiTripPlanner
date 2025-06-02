/**
 * Header Component
 * 
 * A responsive navigation header component that includes:
 * - Logo and main navigation links
 * - Authentication-aware navigation items
 * - Mobile-responsive menu with animations
 * - Sticky header behavior with blur effect
 * - Interactive hover and click animations
 * - Accessibility features
 */

'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Logo from "./logo";
import { useAuth } from "@/app/(auth)/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LogIn, UserPlus, Plane, LayoutList, Menu, X } from "lucide-react";
import Headroom from "react-headroom";

export default function Header() {
  // Authentication and UI state management
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shake, setShake] = useState(false);



  // Animation effect for the "Plan a Trip" button
  useEffect(() => {
    const interval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 2000); 
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle window resize for mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manage body scroll when mobile menu is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  // CSS class definitions for various UI elements
  const navLinkClasses = "relative group text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors duration-150 ease-in-out flex items-center gap-1.5";
  const mobileNavLinkClasses = "font-medium text-gray-600 hover:text-blue-600 block py-2 px-3 transition duration-150 ease-in-out";
  const actionButtonClasses = "btn-sm text-gray-700 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 transition-all duration-150 ease-in-out flex items-center gap-1.5";
  const guestButtonClasses = "btn-sm text-gray-700 bg-white hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out flex items-center gap-1.5";
  const primaryButtonClasses = `btn-sm bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-md hover:shadow-xl hover:scale-[1.05] hover:from-pink-500 hover:to-violet-600 transition-all duration-300 ease-in-out flex items-center gap-1.5${shake ? ' animate-shake' : ''}`;
  const logoutButtonClasses = "btn-sm text-red-600 bg-white border border-red-200 shadow-sm hover:bg-red-600 hover:text-white hover:scale-[1.05] hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-1.5";

  // Framer Motion animation configurations
  const headerMotionProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const itemMotionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  const mobileNavMotionProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    // Sticky header container with blur effect
    <Headroom
      style={{
        transition: 'transform .5s ease-in-out',
        background: 'transparent',
        position: 'fixed',  
        width: '100%',      
        zIndex: 9999
      }}
      pinStart={0}
      disableInlineStyles={true}
      upTolerance={1}
      downTolerance={1}
      className="transition-all duration-300 ease-in-out"
    >
      <motion.header 
        className="top-3 w-full sm:top-4 md:top-5"  
        {...headerMotionProps}
      >
        {/* Main header container */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative flex h-14 items-center justify-between gap-4 rounded-full bg-white/90 px-4 shadow-lg shadow-black/[0.07] backdrop-blur-xl border border-white/50">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Home">
                <Logo skipLink={true} />
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex md:flex-grow md:justify-center">
              <ul className="flex flex-wrap items-center justify-center gap-1">
                {/* Navigation links with hover effects */}
                <motion.li {...itemMotionProps}>
                  <Link href="/" className={navLinkClasses}>
                    Home
                    <span className="absolute bottom-0.5 left-0 h-0.5 w-full bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                  </Link>
                </motion.li>
                <motion.li {...itemMotionProps}>
                  <Link href="/destinations" className={navLinkClasses}>
                    Destinations
                    <span className="absolute bottom-0.5 left-0 h-0.5 w-full bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                  </Link>
                </motion.li>
                <motion.li {...itemMotionProps}>
                  <Link href="/about" className={navLinkClasses}>
                    About
                    <span className="absolute bottom-0.5 left-0 h-0.5 w-full bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                  </Link>
                </motion.li>
                <motion.li {...itemMotionProps}>
                  <Link href="/blog" className={navLinkClasses}>
                    Blog
                    <span className="absolute bottom-0.5 left-0 h-0.5 w-full bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                  </Link>
                </motion.li>
              </ul>
            </nav>

            {/* User actions section */}
            <div className="flex flex-shrink-0 items-center justify-end">
              {/* Desktop user actions */}
              <ul className="hidden md:flex items-center justify-end gap-2 sm:gap-3">
                {
                  isLoading ? (
                    // Loading state placeholder
                    <li className="h-8 w-20 animate-pulse rounded-full bg-gray-200"></li>
                  ) : isAuthenticated ? (
                    // Authenticated user actions
                    <>
                      <motion.li {...itemMotionProps}>
                        <Link href="/profile" className={navLinkClasses}>
                          <User size={16} /> Profile
                        </Link>
                      </motion.li>
                      <motion.li {...itemMotionProps}>
                        <Link href="/mytrips" className={navLinkClasses}>
                          <LayoutList size={16} /> My Trips
                        </Link>
                      </motion.li>
                      <motion.li {...itemMotionProps}>
                        <Link href="/fastplan" className={primaryButtonClasses}>
                          <Plane size={16} /> Plan a Trip
                        </Link>
                      </motion.li>
                      <motion.li {...itemMotionProps}>
                        <button onClick={logout} className={logoutButtonClasses}>
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.li>
                    </>
                  ) : (
                    // Guest user actions
                    <>
                      <motion.li {...itemMotionProps}>
                        <Link href="/signin" className={actionButtonClasses}>
                          <LogIn size={16} /> Sign In
                        </Link>
                      </motion.li>
                      <motion.li {...itemMotionProps}>
                        <Link href="/signup" className={primaryButtonClasses}>
                          <UserPlus size={16} /> Sign Up Free
                        </Link>
                      </motion.li>
                    </>
                  )
                }
              </ul>

              {/* Mobile menu toggle button */}
              <div className="flex md:hidden ml-3">
                <button 
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-controls="mobile-menu"
                  aria-expanded={mobileNavOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileNavOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile navigation menu */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div 
              id="mobile-menu"
              className="absolute inset-x-0 top-full mt-2 mx-4 rounded-xl shadow-xl bg-white p-6 border border-gray-200 md:hidden"
              {...mobileNavMotionProps}
            >
              <nav className="flex flex-col space-y-4">
                {/* Mobile navigation links */}
                <Link href="/" className={mobileNavLinkClasses} onClick={() => setMobileNavOpen(false)}>Home</Link>
                <Link href="/destinations" className={mobileNavLinkClasses} onClick={() => setMobileNavOpen(false)}>Explore Destinations</Link>
                <Link href="/about" className={mobileNavLinkClasses} onClick={() => setMobileNavOpen(false)}>About</Link>
                <Link href="/blog" className={mobileNavLinkClasses} onClick={() => setMobileNavOpen(false)}>Blog</Link>
                
                <hr className="my-4 border-gray-200" />

                {/* Mobile user actions */}
                {
                  isLoading ? (
                    <div className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
                  ) : isAuthenticated ? (
                    <>
                      <Link href="/profile" className={mobileNavLinkClasses} onClick={() => setMobileNavOpen(false)}><User size={18} /> Profile</Link>
                      <Link href="/mytrips" className={mobileNavLinkClasses} onClick={() => setMobileNavOpen(false)}><LayoutList size={18} /> My Trips</Link>
                      <Link href="/fastplan" className={`${primaryButtonClasses} w-full justify-center mt-2`} onClick={() => setMobileNavOpen(false)}><Plane size={16} /> Plan a Trip</Link>
                      <button onClick={() => { logout(); setMobileNavOpen(false); }} className={`${logoutButtonClasses} w-full justify-center mt-2`}><LogOut size={16} /> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/signin" className={`${actionButtonClasses} w-full justify-center`} onClick={() => setMobileNavOpen(false)}><LogIn size={16} /> Sign In</Link>
                      <Link href="/signup" className={`${primaryButtonClasses} w-full justify-center mt-2`} onClick={() => setMobileNavOpen(false)}><UserPlus size={16} /> Sign Up Free</Link>
                    </>
                  )
                }
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </Headroom>
  );
}