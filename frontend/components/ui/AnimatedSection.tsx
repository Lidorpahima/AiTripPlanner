"use client";

import React, { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  type?: "fade" | "slide" | "scale";
  distance?: number;
  duration?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  type = "fade",
  distance = 50,
  duration = 0.6,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // הגדרת האנימציות השונות
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