/**
 * Page Transition Component
 * 
 * A wrapper component that provides smooth transitions between pages.
 * Features:
 * - Multiple transition modes (slide, fade, scale, flip)
 * - Customizable transition directions
 * - Automatic path-based transitions
 * - Smooth animations using Framer Motion
 * - Wait mode for clean transitions
 */

"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Props interface for the PageTransition component
 * @property children - The content to be animated
 * @property mode - The type of transition animation to use
 * @property direction - The direction of the transition (for slide mode)
 */
interface PageTransitionProps {
  children: ReactNode;
  mode?: "slide" | "fade" | "scale" | "flip";
  direction?: "up" | "down" | "left" | "right";
}

/**
 * PageTransition Component
 * 
 * Wraps content with smooth page transition animations.
 * Uses Framer Motion for high-performance animations and
 * automatically triggers transitions based on route changes.
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  mode = "slide",
  direction = "up"
}) => {
  const pathname = usePathname();
  
  /**
   * Animation variants for different transition states
   * Defines the initial, animate, and exit states for each transition mode
   */
  const variants = {
    // Initial state - before the new page appears
    initial: {
      opacity: 0,
      x: mode === "slide" ? (direction === "left" ? 300 : direction === "right" ? -300 : 0) : 0,
      y: mode === "slide" ? (direction === "up" ? 300 : direction === "down" ? -300 : 0) : 0,
      scale: mode === "scale" ? 0.8 : 1,
      rotateY: mode === "flip" ? 90 : 0,
    },
    // Animate state - after the new page appears
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
    },
    // Exit state - when leaving the current page
    exit: {
      opacity: 0,
      x: mode === "slide" ? (direction === "left" ? -300 : direction === "right" ? 300 : 0) : 0,
      y: mode === "slide" ? (direction === "up" ? -300 : direction === "down" ? 300 : 0) : 0,
      scale: mode === "scale" ? 1.2 : 1,
      rotateY: mode === "flip" ? -90 : 0,
    },
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;