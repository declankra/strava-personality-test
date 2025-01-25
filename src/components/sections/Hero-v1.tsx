// src/components/sections/Hero-v1.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import RetroGrid from "@/components/ui/retro-grid";
import AvatarCircles from "@/components/ui/avatar-circles";
import { ChevronUp } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useOpenPanel } from '@openpanel/nextjs';
import { AnalyticsEvent } from '@/lib/analytics/openpanel/analytics-event';

// Static avatar data with diverse placeholder images
const staticAvatars = [
  {
    imageUrl: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/98367252/27519938/1/large.jpg",
    profileUrl: "https://www.strava.com/athletes/98367252"
  },
  {
    imageUrl: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/140214409/31855741/2/large.jpg",
    profileUrl: "https://www.strava.com/athletes/140214409"
  },
  {
    imageUrl: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/117864711/27778050/1/large.jpg",
    profileUrl: "https://www.strava.com/athletes/117864711"
  },
  {
    imageUrl: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/120600523/32075775/1/large.jpg",
    profileUrl: "https://www.strava.com/athletes/120600523"
  },
  {
    imageUrl: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/118093337/27516282/1/large.jpg",
    profileUrl: "https://www.strava.com/athletes/118093337?oq=tre"
  }
];

const bubbleLetterStyle = {
  textShadow: "0px 2px 0px #8B5CF6",
  WebkitTextStroke: "1.25px #8B5CF6",
  backgroundImage: "linear-gradient(to bottom, #F59E0B, #F59E0B)", // Using gradient instead of backgroundColor
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block", // Ensure the background only applies to the text
};

// Flow step images with their properties
const flowSteps = [
  {
    src: "/images/flow/step1-connect.png",
    alt: "Connect with Strava",
    rotation: "-12deg",
    zIndex: "z-[1]",
    marginRight: "-mr-4",
  },
  {
    src: "/images/flow/step2-analyze.png",
    alt: "Analysis in progress",
    rotation: "0deg",
    zIndex: "z-[3]",
    marginRight: "-mr-4",
  },
  {
    src: "/images/flow/step3-result.png",
    alt: "Your personality result",
    rotation: "12deg",
    zIndex: "z-[2]",
    marginRight: "mr-0",
  },
];

export default function Hero() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const supabase = getSupabase();
    
    const fetchUserCount = async () => {
      const { count } = await supabase
        .from('strava_personality_test')
        .select('*', { count: 'exact', head: true });
      
      setUserCount(count || 0);
    };

    fetchUserCount();

    // Set up real-time subscription for user count updates
    const channel = supabase
      .channel('strava-personality-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'strava_personality_test' }, 
          () => fetchUserCount())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const op = useOpenPanel();
  const handleGetStarted = () => {
     // Track OAuth button click
     op.track('oauth_button_click', {
      location: 'hero_section',
      button_type: 'main_cta'
    });
    window.location.href = '/api/auth/strava';
  };

  // Shared animation variants for zoom effect
  const zoomAnimation = {
    initial: { scale: 0.1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
     {/* Track page view duration */}
     <AnalyticsEvent 
        event="hero_page_view" 
        timeOnPage={true}
        trigger="unmount"
      />
      <RetroGrid className="absolute inset-0" opacity={0.3} />
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Flow Steps with synchronized zoom animation */}
        <motion.div 
          {...zoomAnimation}
          className="flex justify-center mb-8 md:mb-12"
        >
          <div className="flex justify-center -space-x-4 md:-space-x-8 px-4 md:px-0">
            {flowSteps.map((step, index) => (
              <div
                key={step.alt}
                className={`relative w-24 h-24 md:w-48 md:h-48 ${step.zIndex} ${step.marginRight}`}
                style={{ transform: `rotate(${step.rotation})` }}
              >
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  className="object-contain"
                  priority={index === 1}
                />
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Main Headline with matching zoom animation */}
        <div className="mb-16">
          <motion.div {...zoomAnimation}>
            <h1 
              className="text-6xl md:text-8xl font-bold mb-4 tracking-tight"
              style={bubbleLetterStyle}
            >
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="inline-block"
              >
                Athlete Personality Test
              </motion.span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
          >
            Discover Your Unique Athlete Personality — {" "}
            <span className="text-orange-500 font-medium">
              Based on your Strava Activity Titles
            </span>
          </motion.p>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-6 w-full"
        >
          <div className="relative">
            <button 
              onClick={handleGetStarted}
              className="relative transition-transform hover:scale-105 focus:outline-none"
            >
              <Image
                src="/btn_strava_connectwith_orange.svg"
                alt="Connect with Strava"
                width={320}
                height={64}
                className="h-16 w-auto"
              />
            </button>
            
            <motion.div
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-[37%] -bottom-12 -translate-x-1/2 text-orange-500"
            >
              <ChevronUp className="w-12 h-12" />
            </motion.div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-col items-center">
            <AvatarCircles
              avatarUrls={staticAvatars}
              numPeople={userCount > 5 ? userCount - 5 : 0}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Join {userCount.toLocaleString()} athletes who've discovered their hidden personality
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}