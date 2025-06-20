/**
 * Preview Component Module
 * 
 * This module provides interactive device previews showcasing the application's features.
 * It includes:
 * - Device frame components for mobile and desktop previews
 * - Scroll-based screen transitions
 * - Responsive design adaptations
 * - Animation and interaction handlers
 */

"use client"
import React, { useEffect, useRef, useState, PropsWithChildren, CSSProperties, ButtonHTMLAttributes, ForwardedRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lobster } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DeviceFrameset } from 'react-device-frameset';

import 'react-device-frameset/styles/marvel-devices.min.css'; 

/**
 * Utility function to merge Tailwind CSS classes
 * @param inputs - Class values to be merged
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Button variant configuration using class-variance-authority
 * Defines different button styles and sizes
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component props interface
 * Extends HTML button attributes and adds variant props
 */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Reusable Button component with variant support
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

/**
 * Lobster font configuration for decorative text
 */
const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Screen configuration interface for device preview
 */
interface ScreenConfig {
  title: string;
  description: string;
  image: string;
  bgColorForButton: string;
}

/**
 * PhoneWithScrollingScreens Component
 * 
 * Interactive device preview component that showcases app features through
 * scroll-based screen transitions. Features include:
 * - Scroll-triggered screen changes
 * - Responsive device frames
 * - Smooth animations
 * - Background position adjustments
 */
function PhoneWithScrollingScreens() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isAtLastScreen, setIsAtLastScreen] = useState(false);
  const [isActive, setIsActive] = useState(false); 
  const [bgPosition, setBgPosition] = useState('center top'); 
  const [isMobile, setIsMobile] = useState(false); 
  const [macbookZoom, setMacbookZoom] = useState(0.41);
  const [mobileZoom, setMobileZoom] = useState(0.5);
  const scrollTriggerRef = useRef<HTMLDivElement>(null); 

  /**
   * Screen configurations for the preview
   */
  const screens: ScreenConfig[] = [
    {
      title: "Live Trip Tracking",
      description: "See and update your trip status in real time.",
      image: "/images/ShowcaseMobile1.webp", 
      bgColorForButton: "bg-purple-600", 
    },
    {
      title: "Attraction Details & Reviews",
      description: "Browse info, reviews, photos, and book tickets easily.",
      image: "/images/ShowcaseMobile2.webp", 
      bgColorForButton: "bg-blue-500",
    },
    {
      title: "Smart Budget Estimator",
      description: "Get price estimates for all your planned activities.",
      image: "/images/ShowcaseMobile3.webp",
      bgColorForButton: "bg-green-500",
    },
    {
      title: "Smart Trip Dashboard",
      description: "View and manage your full trip schedule at a glance.",
      image: "/images/ShowcaseMobile4.webp",
      bgColorForButton: "bg-amber-500",
    },
    {
      title: "Personalized AI Trip Planning",
      description: "Choose Quick, Normal, or Expert AI for your trip plan.",
      image: "/images/ShowcaseMobile5.webp",
      bgColorForButton: "bg-rose-500",
    },
  ];

  const minSectionHeight = `${screens.length * 100}vh`;

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle background position based on scroll
  useEffect(() => {
    if (!scrollTriggerRef.current) return;
    const container = scrollTriggerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerTopRelativeToDocument = containerRect.top + window.scrollY;
    const scrollPosition = window.scrollY - containerTopRelativeToDocument;
    const containerHeight = container.clientHeight;
    const scrollableDistance = containerHeight - window.innerHeight;
    const scrollPercentage = Math.max(0, Math.min(1, scrollPosition / scrollableDistance));
    setBgPosition(`center ${scrollPercentage * 100}%`);
  }, [activeScreen, isActive]);

  // Handle last screen detection
  useEffect(() => {
    if (!scrollTriggerRef.current) {
      setIsAtLastScreen(false);
      return;
    }
    const container = scrollTriggerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerTopRelativeToDocument = containerRect.top + window.scrollY;
    const scrollPosition = window.scrollY - containerTopRelativeToDocument;
    const containerHeight = container.clientHeight;
    const scrollableDistance = containerHeight - window.innerHeight;
    const scrollPercentage = Math.max(0, Math.min(1, scrollPosition / scrollableDistance));
    setIsAtLastScreen(scrollPercentage === 1);
  }, [activeScreen, screens.length]);

  // Handle scroll-based screen activation
  useEffect(() => {
    const HEADER_OFFSET = 100; 
    const handleScroll = () => {
      if (!scrollTriggerRef.current) return;
      const sectionTop = scrollTriggerRef.current.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      const sectionBottom = sectionTop + scrollTriggerRef.current.offsetHeight - window.innerHeight + HEADER_OFFSET;
      const scrollY = window.scrollY;
      setIsActive(scrollY >= sectionTop && scrollY < sectionBottom);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Handle navigation to next section when reaching last screen
  useEffect(() => {
    if (isAtLastScreen) {
      const nextSection = document.getElementById('how-it-works');
      if (nextSection) {
        const top = nextSection.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [isAtLastScreen]);

  // Handle active screen updates based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTriggerRef.current) return;
      const container = scrollTriggerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerTopRelativeToDocument = containerRect.top + window.scrollY;
      const scrollPosition = window.scrollY - containerTopRelativeToDocument;
      const containerHeight = container.clientHeight;
      const scrollableDistance = containerHeight - window.innerHeight;
      
      if (scrollableDistance <= 0) {
        setActiveScreen(0); 
        return;
      }

      const scrollPercentage = Math.max(0, Math.min(1, scrollPosition / scrollableDistance));
      const newActiveScreen = Math.min(screens.length - 1, Math.floor(scrollPercentage * screens.length));
      
      setActiveScreen(newActiveScreen);
    };

    handleScroll(); 
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [screens.length]);

  // Handle responsive zoom levels
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 850) {
        setMacbookZoom(0.7);
        setMobileZoom(0.7);
      } else {
        setMacbookZoom(0.41);
        setMobileZoom(0.5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bgImage = isMobile
    ? '/images/long-bg-mobile.webp'
    : '/images/long-bg-desktop.webp';

  return (
    <section
      ref={scrollTriggerRef}
      className="relative w-full"
      style={{
        minHeight: isAtLastScreen ? '0' : minSectionHeight,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: bgPosition,
        transition: 'background-position 0.2s'
      }}
    >
      <div
        className={cn(
          isAtLastScreen || !isActive
            ? 'relative flex items-center justify-center w-full'
            : 'fixed top-0 left-0 w-full h-screen flex items-center justify-center z-10'
        )}
        style={isAtLastScreen || !isActive ? { position: 'relative' } : { position: 'fixed' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto ">
          {/* Device Frame */}
          <div
            className={
              (activeScreen < 3
                ? "w-[500px] h-[510px] sm:w-[260px] sm:h-[530px] md:w-[500px] md:h-[570px]"
                : "w-[800px] h-[500px] sm:w-[350px] sm:h-[220px] md:w-[900px] md:h-[600px]")
              + " flex items-center justify-center pt-10 transition-all duration-500"
            }
          >
            {activeScreen < 3 ? (
              <DeviceFrameset device="iPhone X" color="black" zoom={mobileZoom}>
                <div className="w-full h-full bg-white overflow-hidden relative">
                  {screens.map((screen, index) => (
                    <div
                      key={index}
                      className={cn(
                        "absolute inset-0 transition-all duration-700 ease-in-out",
                        index === activeScreen
                          ? "opacity-100 translate-y-0"
                          : index < activeScreen
                            ? "opacity-0 -translate-y-full"
                            : "opacity-0 translate-y-full"
                      )}
                    >
                      <Image
                        src={screen.image}
                        alt={screen.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority={index === 0}
                        style={{ objectFit: 'cover' }}
                        className="select-none"
                      />
                    </div>
                  ))}
                </div>
              </DeviceFrameset>
            ) : (
              <DeviceFrameset device="MacBook Pro" color="black" zoom={macbookZoom}>
                <div className="w-full h-full bg-white overflow-hidden relative">
                  {screens.map((screen, index) => (
                    <div
                      key={index}
                      className={cn(
                        "absolute inset-0 transition-all duration-700 ease-in-out",
                        index === activeScreen
                          ? "opacity-100 translate-y-0"
                          : index < activeScreen
                            ? "opacity-0 -translate-y-full"
                            : "opacity-0 translate-y-full"
                      )}
                    >
                      <Image
                        src={screen.image}
                        alt={screen.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority={index === 0}
                        style={{ objectFit: 'cover' }}
                        className="select-none"
                      />
                    </div>
                  ))}
                </div>
              </DeviceFrameset>
            )}
          </div>

          {/* Feature Description */}
          <div className="max-w-md text-center sm:text-center md:text-left md:mt-0 inline-block bg-white/80 rounded-xl shadow-lg px-6 py-4 pb-[50px] backdrop-blur-md">            <div className="flex gap-2 justify-center md:justify-start mb-4">
              {screens.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === activeScreen 
                      ? screens[activeScreen]?.bgColorForButton || 'bg-primary' 
                      : 'bg-gray-300'
                  )}
                ></div>
              ))}
            </div>

            <div className="relative min-h-[70px] sm:min-h-[120px]">
              {screens.map((screen, index) => (
                <div
                  key={index}
                  className={cn(
                    "transition-opacity duration-700 ease-in-out",
                    index === activeScreen 
                      ? "opacity-100 static" 
                      : "opacity-0 absolute inset-0 pointer-events-none" 
                  )}
                >
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-blue-500 ">{screen.title}</h3>
                  <p className="text-gray-600 text-sm pb-2 sm:text-base">{screen.description}</p>
                </div>
              ))}
            </div>
            
            <div className="">
            <Link href="/fastplan">
              <Button
                className={cn(
                  "text-white",                            
                  screens[activeScreen]?.bgColorForButton || 'bg-primary',  
                  "hover:bg-primary/90",                        
                  "cursor-pointer"                             
                )}
              >
                Start Planning!
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/**
 * Main Component to use the PhoneWithScrollingScreens
 * Provides a complete showcase of the application's features
 */
export function CompactDeviceShowcaseV2() {
  return (
    <div className="relative w-full mx-auto flex flex-col"> 
      {/* Background elements (SVG and solid color) */}
      <div className="absolute inset-0 -z-30 bg-[#fffdfd]"></div>
      <div className="absolute inset-0 -z-20">
        <svg className="absolute -left-0 -top-50 w-[80rem] h-[80rem] text-slate-400/20" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M100 20C144.183 20 180 55.8172 180 100C180 144.183 144.183 180 100 180C55.8172 180 20 144.183 20 100C20 55.8172 55.8172 20 100 20Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M100 40C133.137 40 160 66.8629 160 100C160 133.137 133.137 160 100 160C66.8629 160 40 133.137 40 100C40 66.8629 66.8629 40 100 40Z" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      <div className="text-center max-w-4xl mx-auto mb-1">
        <h1 className={`${lobster.className} text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800`}>
          Plan your next adventure
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600">
          Get real-time activity suggestions from our AI assistant. Chat directly with our AI to refine your itinerary, discover alternatives, or get personalized recommendations instantly.
        </p>
      </div>

      {/* The PhoneWithScrollingScreens component */}
      <PhoneWithScrollingScreens />
      
      {/* Styled scrollbar (from your original code) */}
      <style jsx global>{`
        .styled-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .styled-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .styled-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .styled-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        
      `}</style>
    </div>
  );
}
export { CompactDeviceShowcaseV2 as CompactDeviceShowcase };