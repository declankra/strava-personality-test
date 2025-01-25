// src/components/sections/FinalCall.tsx

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { useOpenPanel } from '@openpanel/nextjs';
import { toast } from "sonner";

// Define the bubble text styles with regular and inverted variants
const bubbleTextStyle = {
  textShadow: "0px 2px 0px #8B5CF6",
  WebkitTextStroke: "1.25px #8B5CF6",
  backgroundImage: "linear-gradient(to bottom, #F59E0B, #F59E0B)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
} as const;

export default function FinalCall() {
  const op = useOpenPanel();
  const handleGetStarted = () => {
        // Track OAuth button click
        op.track('oauth_button_click', {
          location: 'final_call_section',
          button_type: 'bottom_cta'
        });
    window.location.href = '/api/auth/strava';
  };

  const handleShare = async () => {
    // Track initial share attempt
    op.track('share_button_click', {
      location: 'final_call_section',
      share_type: typeof navigator.share !== 'undefined' ? 'native' : 'clipboard'
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Athlete Personality Test - Powered by Strava',
          text: 'Discover your unique athlete personality based on your Strava activity titles! Take the test now.',
          url: window.location.href,
        });
        
        // Track successful native share
        op.track('share_completed', {
          location: 'final_call_section',
          share_type: 'native'
        });
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        
        // Track successful clipboard copy
        op.track('share_completed', {
          location: 'final_call_section',
          share_type: 'clipboard'
        });
        
        // Show success toast for clipboard copy
        toast.success('Link copied to clipboard! Share it with your friends! 🎉', {
          duration: 3000,
          className: 'bg-orange-500 text-white',
        });
      }
    } catch (error) {
      // Check if the error is a user cancellation
      if (error instanceof Error && error.name === 'AbortError') {
        // Track share cancellation
        op.track('share_cancelled', {
          location: 'final_call_section',
          share_type: 'native'
        });
        // Don't show an error toast for cancellation
        return;
      }
      
      // Handle actual errors
      console.error('Share error:', error);
      
      // Show error toast
      toast.error('Failed to share. Please try again.', {
        duration: 3000
      });
      
      // Track actual sharing error
      op.track('share_error', {
        location: 'final_call_section',
        error_type: error instanceof Error ? error.name : 'unknown',
        error_message: error instanceof Error ? error.message : 'unknown error',
        share_type: typeof navigator.share !== 'undefined' ? 'native' : 'clipboard'
      });
    }
  };

  return (
    <section className="py-20 mt-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Glowing card */}
        <div className="relative rounded-2xl p-8 md:p-12 bg-white dark:bg-gray-900 shadow-2xl">
          {/* Glow effect using pseudo-element */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 via-orange-500/30 to-orange-500/20 blur-xl -z-10" />

          {/* Content */}
          <div className="relative z-10">
            {/* Headline with mixed bubble text styles */}
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              Ready to Find Your{" "}
              <span style={bubbleTextStyle}>
                Athlete Personality
              </span>
              ?
            </h2>

            {/* Buttons container with improved spacing for mobile */}
            <div className="flex flex-col items-center gap-16 md:gap-6 md:flex-row md:justify-center">
              {/* Connect with Strava button container */}
              <div className="relative">
                <button 
                  onClick={handleGetStarted}
                  className="relative transition-transform hover:scale-105 focus:outline-none"
                >
                  <Image
                    src="/btn_strava_connectwith_orange.svg"
                    alt="Connect with Strava"
                    width={193}
                    height={48}
                    className="h-16 w-auto"
                  />
                </button>
                
                {/* Bouncing arrow and text - now positioned absolutely with improved spacing */}
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-10 left-[29%] flex flex-col items-center text-orange-500 pointer-events-none"
                >
                  <ChevronUp className="w-6 h-6" />
                  <span className="text-sm font-medium whitespace-nowrap">Take the test now</span>
                </motion.div>
              </div>

              {/* Share button - matches Strava button height */}
              <button
                onClick={handleShare}
                className="h-16 px-8 rounded-lg border-2 border-orange-500 text-orange-500 font-medium 
                  hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors whitespace-nowrap
                  hover:shadow-lg hover:shadow-orange-500/20"
              >
                Share with a friend
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}