import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShineBorder } from "@/components/ui/shine-border";
import { SparklesIcon } from "lucide-react";

interface PaidFeaturePromotionProps {
  personalityType: string;
}

export default function PaidFeaturePromotion({ personalityType }: PaidFeaturePromotionProps) {
  const router = useRouter();

  // Animation variants for content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }} // Delay appearance to let users focus on results first
      className="mt-32 mb-20"
    >
      {/* Subtle separator */}
      <div className="max-w-md mx-auto mb-12 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        <SparklesIcon className="w-5 h-5 text-orange-500" />
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Main promotion card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="max-w-2xl mx-auto px-4"
      >
        <ShineBorder 
          color={["#F59E0B", "#8B5CF6"]} // Orange to purple gradient
          duration={8}
          className="group"
        >
          <div 
            className="p-6 space-y-4 cursor-pointer"
            onClick={() => router.push('/character')}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold">
                Unlock Your Personalized Athlete Character
              </h3>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-sm font-medium rounded-full">
                New
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300">
            Go beyond the {personalityType} archetype. Generate a unique character that combines your 
            Strava story, training style, and athletic journey. 
            </p>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                For Strava profile picture
              </span>
              <motion.div 
                className="flex items-center gap-2 text-orange-500 font-medium"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Create your character
                <svg
                  className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </ShineBorder>
      </motion.div>
    </motion.div>
  );
}