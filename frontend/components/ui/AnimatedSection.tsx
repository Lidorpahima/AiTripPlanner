/**
 * AnimatedSection Component
 * 
 * A reusable animation wrapper component that provides various animation effects
 * for content sections. Features include:
 * - Multiple animation types (fade, slide, scale)
 * - Directional animations (up, down, left, right)
 * - Intersection Observer based trigger
 * - Customizable timing and distance
 * - Smooth transitions with easing
 */

"use client";

import React, { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";

/**
 * Props interface for the AnimatedSection component
 * @property children - React nodes to be animated
 * @property className - Optional CSS classes to apply to the wrapper
 * @property delay - Animation delay in seconds
 * @property direction - Direction of the animation (up, down, left, right)
 * @property type - Type of animation (fade, slide, scale)
 * @property distance - Distance to animate in pixels
 * @property duration - Duration of the animation in seconds
 */
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  type?: "fade" | "slide" | "scale";
  distance?: number;
  duration?: number;
}

/**
 * AnimatedSection Component
 * 
 * Wraps content in an animated container that triggers animations
 * when the content comes into view. Uses Framer Motion for smooth
 * animations and Intersection Observer for viewport detection.
 */
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  type = "fade",
  distance = 50,
  duration = 0.6,
}) => {
  // Reference for the animated element and viewport detection
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Animation variants configuration
  const animations = {
    hidden: {
      opacity: type === "fade" || type === "slide" ? 0 : 1,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      x: direction === "left" ? distance : direction === "right" ? -distance : 0,
      scale: type === "scale" ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animations}
      className={clsx("w-full", className)}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;