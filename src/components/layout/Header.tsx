// src/components/layout/Header.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Header() {
  // Track whether we're scrolling up or down
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Get scroll progress for animations
  const { scrollY } = useScroll();
  
  // Transform scroll position into opacity and translateY values
  const headerOpacity = useTransform(
    scrollY,
    [0, 50], // Scroll values
    [0, 1]   // Opacity values
  );
  
  const translateY = useTransform(
    scrollY,
    [0, 50], // Scroll values
    [-100, 0] // Translation values
  );

  // Handle scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY <= 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Smooth scroll to top handler
  const scrollToTop = () => {
    // Try native smooth scroll first
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for browsers that don't support smooth scrolling
      const duration = 500; // ms
      const start = window.scrollY;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
        
        window.scrollTo(0, start * (1 - easeOutCubic(progress)));

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <motion.header
      style={{
        opacity: headerOpacity,
        y: translateY,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        !isScrollingUp ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm dark:bg-gray-950/80" />
      {/* Header content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-2 flex justify-center">
        <button
          onClick={scrollToTop}
          className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg"
          aria-label="Scroll to top"
        >
          <motion.div
            whileHover={{ rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/logo.svg"
              alt="Athlete Personality Test"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
          </motion.div>
        </button>
      </div>
    </motion.header>
  );
}