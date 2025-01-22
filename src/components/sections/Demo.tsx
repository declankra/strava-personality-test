// src/components/sections/Demo.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import Iphone15Pro from "@/components/ui/iphone-15-pro";
import Image from "next/image";

// Bubble text style matching Personalities.tsx
const bubbleTextStyle = {
  textShadow: "0px 2px 0px #8B5CF6",
  WebkitTextStroke: "1.25px #8B5CF6",
  backgroundColor: "#F59E0B",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

export default function Demo() {
  return (
    <section className="mt-20 md:mt-20 py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Category label */}
          <span className="text-orange-500 font-bold tracking-widest text-xs md:text-sm block mb-2 md:mb-4">
            HOW IT WORKS
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={bubbleTextStyle}
          >
            Your Strava Stories Tell All
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            We analyze your activity titles to match you with your unique athlete personality
          </p>
        </div>

        {/* Flow Demonstration */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Strava App Preview in iPhone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[300px] md:max-w-none lg:w-[28%]"
          >
            <Iphone15Pro 
              src="/images/iphone/preview.webp"
              width={300}
            />
          </motion.div>

          {/* Arrow - Changes direction based on screen size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-orange-500"
          >
            <ArrowRight className="hidden md:block w-12 h-12" />
            <ArrowDown className="block md:hidden w-12 h-12" />
          </motion.div>

          {/* Result Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-1/3 relative"
          >
            <Image
              src="/images/flow/step3-result.png"
              alt="Your personality test result"
              width={300}
              height={612}
              className="rounded-2xl shadow-xl w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}