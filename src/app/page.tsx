// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RetroGrid from "@/components/ui/retro-grid";
import PulsatingButton from "@/components/ui/pulsating-button";
import AvatarCircles from "@/components/ui/avatar-circles";
import { FocusCards } from "@/components/ui/focus-cards";
import Iphone15Pro from "@/components/ui/iphone-15-pro";
import { getSupabase } from "@/lib/supabase";

// Define personality types and their descriptions
const personalityTypes = [
  {
    title: "The Motivator",
    src: "/images/personalities/motivator.webp",
    description: "Always includes inspirational quotes or messaging.",
    example: "Nothing worth having comes easy 💪 #grateful"
  },
  {
    title: "The Data Nerd",
    src: "/images/personalities/data-nerd.webp",
    description: "Every title includes precise stats, conditions, and metrics.",
    example: "6.2mi @ 7:45/mi, 72°F, 65% humidity, Z2 training"
  },
  {
    title: "The Storyteller",
    src: "/images/personalities/storyteller.webp",
    description: "Creates a narrative with each run.",
    example: "That time I chased a squirrel and found a secret trail"
  },
  {
    title: "The Minimalist",
    src: "/images/personalities/minimalist.webp",
    description: "Uses single words or keeps it purely functional.",
    example: "Morning Run"
  },
  {
    title: "The Humorist",
    src: "/images/personalities/humorist.webp",
    description: "Consistently crafts witty, punny titles.",
    example: "Running late (literally)"
  },
  {
    title: "The Poet",
    src: "/images/personalities/poet.webp",
    description: "Writes deeply philosophical titles reflecting on life's journey through running.",
    example: "Dancing with dawn's first light, finding myself mile by mile"
  }
];

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  interface AvatarData {
    imageUrl: string;
    profileUrl: string;
  }

  const [recentAvatars, setRecentAvatars] = useState<AvatarData[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    
    // Initial fetch
    const fetchData = async () => {
      // Get count
      const { count } = await supabase
        .from('strava_personality_test')
        .select('*', { count: 'exact', head: true });
      
      setUserCount(count || 0);
      
      // Get recent avatars
      const { data: avatarData } = await supabase
        .from('strava_personality_test')
        .select('user_avatar, user_strava_profile')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (avatarData) {
        setRecentAvatars(avatarData.map(user => ({
          imageUrl: user.user_avatar as string ?? '',
          profileUrl: user.user_strava_profile as string ?? ''
        })));
      }
    };

    fetchData();

    // Set up realtime subscription
    const channel = supabase
      .channel('strava-personality-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'strava_personality_test'
        },
        () => {
          // Refetch data when changes occur
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleGetStarted = () => {
    // TODO: Implement Strava OAuth flow
    console.log("Starting Strava OAuth flow");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Strava Personality Test',
          text: 'Discover your unique Strava personality! Take the test now.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <RetroGrid className="absolute inset-0" />
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Strava Personality Test
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover your unique Strava personality (based on your activity titles)
          </motion.p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <PulsatingButton
            onClick={handleGetStarted}
            className="text-lg px-8 py-4 mb-8"
            pulseColor="rgba(252, 82, 0, 0.2)" // Strava orange
          >
            Get Your Strava Style
          </PulsatingButton>
          
          <div className="flex flex-col items-center gap-4">
            <AvatarCircles
              avatarUrls={recentAvatars}
              numPeople={userCount > 5 ? userCount - 5 : 0}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join {userCount.toLocaleString()} runners who discovered their style
            </p>
          </div>
        </div>
      </section>

      {/* Personality Types Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Personality Types</h2>
          <FocusCards cards={personalityTypes} />
        </div>
      </section>

      {/* iPhone Mockup Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Iphone15Pro src="/images/iphone/preview.jpg" />
          <h2 className="text-3xl font-bold mt-8">Who are you??</h2>
        </div>
      </section>

      {/* Bottom Hero Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={handleShare}
            className="mb-4 px-8 py-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Share with a friend
          </button>
          <PulsatingButton
            onClick={handleGetStarted}
            className="block mx-auto"
            pulseColor="rgba(252, 82, 0, 0.2)"
          >
            Take the test now
          </PulsatingButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <a 
            href="https://www.declankramper.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Made by Declan
          </a>
        </div>
      </footer>
    </div>
  );
}