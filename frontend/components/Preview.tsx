"use client"
import React, { useEffect, useRef, useState, PropsWithChildren, CSSProperties, ButtonHTMLAttributes, ForwardedRef } from "react";
import Image from "next/image";
import { Lobster } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DeviceFrameset } from 'react-device-frameset';

import 'react-device-frameset/styles/marvel-devices.min.css'; 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center  justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

// 4. Lobster font instance
const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

function PhoneWithScrollingScreens() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isAtLastScreen, setIsAtLastScreen] = useState(false);
  const [isActive, setIsActive] = useState(false); 
  const [bgPosition, setBgPosition] = useState('center top'); 
  const [isMobile, setIsMobile] = useState(false); 

  const scrollTriggerRef = useRef<HTMLDivElement>(null); 
  const screens = [
    {
      title: "תכנן את הטיול שלך",
      description: "בחר תאריכים ויעדים, ואנחנו נתכנן את השאר",
      image: "/images/ShowcaseMobile1.png", 
      bgColorForButton: "bg-purple-600", 
    },
    {
      title: "תקציב חכם",
      description: "קבל הערכת תקציב מפורטת לטיול שלך",
      image: "/images/ShowcaseMobile2.png", 
      bgColorForButton: "bg-blue-500",
    },
    {
      title: "מסלול יומי",
      description: "תכנון יומי מפורט עם אטרקציות ופעילויות",
      image: "/images/ShowcaseMobile3.png",
      bgColorForButton: "bg-green-500",
    },
    {
      title: "מלונות מומלצים",
      description: "מצא את המלונות הטובים ביותר ביעד שלך",
      image: "/images/ShowcaseMobile4.png",
      bgColorForButton: "bg-amber-500",
    },
    {
      title: "פעילויות מקומיות",
      description: "גלה פעילויות ואטרקציות מקומיות",
      image: "/images/ShowcaseMobile5.png",
      bgColorForButton: "bg-rose-500",
    },
  ];

  const minSectionHeight = `${screens.length * 100}vh`;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    // נחשב אם המשתמש באמת בסוף הגלילה
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

  useEffect(() => {
    if (isAtLastScreen) {
      const nextSection = document.getElementById('how-it-works');
      if (nextSection) {
        const top = nextSection.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [isAtLastScreen]);

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

  const bgImage = isMobile
    ? '/images/long-bg-mobile.png'
    : '/images/long-bg-desktop.png';

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
          {/* Phone Frame using react-device-frameset */}
          <div
            className={
              (activeScreen < 3
                ? "w-[500px] h-[510px] sm:w-[260px] sm:h-[530px] md:w-[500px] md:h-[570px]"
                : "w-[800px] h-[500px] sm:w-[350px] sm:h-[220px] md:w-[900px] md:h-[600px]")
              + " flex items-center justify-center pt-10 transition-all duration-500"
            }
          >
            {activeScreen < 3 ? (
              <DeviceFrameset device="iPhone X" color="black" zoom={0.50}>
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
                        layout="fill"
                        objectFit="cover"
                        priority={index === 0}
                        className="select-none"
                      />
                    </div>
                  ))}
                </div>
              </DeviceFrameset>
            ) : (
              <DeviceFrameset device="MacBook Pro" color="black" zoom={0.50}>
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
                        layout="fill"
                        objectFit="contain"
                        priority={index === 0}
                        className="select-none"
                      />
                    </div>
                  ))}
                </div>
              </DeviceFrameset>
            )}
          </div>

          {/* Feature Description */}
          <div className="max-w-md text-center md:text-right  md:mt-0 md:mr-8">
            <div className="flex gap-2 justify-center md:justify-start mb-4">
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
                  <p className="text-gray-600 text-sm sm:text-base">{screen.description}</p>
                </div>
              ))}
            </div>
            
            <div className="">
              <Button className={cn("text-white", screens[activeScreen]?.bgColorForButton || 'bg-primary')}>
                גלה עוד <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// 6. Main Component to use the PhoneWithScrollingScreens
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
          Interactive AI Planning
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