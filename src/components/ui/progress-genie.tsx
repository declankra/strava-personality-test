// components/ui/progress-genie.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProgressGenieProps {
  progress: number; // 0-100
  className?: string;
}

const ProgressGenie = ({ progress, className }: ProgressGenieProps) => {
  // Calculate the genie's position based on progress
  const genieX = `${progress}%`;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Base progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
        {/* Animated fill */}
        <motion.div 
          className="bg-orange-500 h-4 rounded-full"
          initial={{ width: "0%" }}  // Set initial state to 0%
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Animated genie container */}
      <motion.div 
        className="absolute -top-8"
        animate={{ 
          left: genieX,
        }}
        initial={{ left: "0%" }}
        transition={{ 
          duration: 0.5, // Match progress bar duration
          ease: "easeOut"
        }}
        style={{
          transform: 'translateX(-50%)', // Center the genie horizontally
        }}
      >
        {/* Genie with floating animation */}
        <motion.div
          animate={{ 
            scale: [0.8, 1, 0.8],
            rotate: [0, 5, -5, 0],
            y: [0, -4, 0] // Add slight floating motion
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/Genie.svg"
            alt="Genie"
            width={40}
            height={40}
            className="transform -scale-x-100"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProgressGenie;