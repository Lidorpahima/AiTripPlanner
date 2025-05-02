"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
  mode?: "slide" | "fade" | "scale" | "flip";
  direction?: "up" | "down" | "left" | "right";
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  mode = "slide",
  direction = "up"
}) => {
  const pathname = usePathname();
  
  // הגדרת וריאנטים שונים לאנימציות
  const variants = {
    // מצב התחלתי - לפני הופעת הדף החדש
    initial: {
      opacity: 0,
      x: mode === "slide" ? (direction === "left" ? 300 : direction === "right" ? -300 : 0) : 0,
      y: mode === "slide" ? (direction === "up" ? 300 : direction === "down" ? -300 : 0) : 0,
      scale: mode === "scale" ? 0.8 : 1,
      rotateY: mode === "flip" ? 90 : 0,
    },
    // מצב לאחר הופעת הדף החדש
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
    },
    // מצב בעת יציאה - כשעוזבים את הדף הנוכחי
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