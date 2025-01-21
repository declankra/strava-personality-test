// app/components/sections/Hero.tsx

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import RetroGrid from "@/components/ui/retro-grid";
import PulsatingButton from "@/components/ui/pulsating-button";
import AvatarCircles from "@/components/ui/avatar-circles";
import { getSupabase } from "@/lib/supabase";
import { 
  Trophy, 
  LineChart, 
  BookOpen, 
  Minimize2, 
  Rocket, 
  SmilePlus 
} from "lucide-react";

// Personality types with their corresponding icons
const personalityTypes = [
  { icon: Rocket, label: "Motivator" },
  { icon: LineChart, label: "Data Enthusiast" },
  { icon: Trophy, label: "Glory Chaser" },
  { icon: BookOpen, label: "Storyteller" },
  { icon: Minimize2, label: "Essentialist" },
  { icon: SmilePlus, label: "Comedian" }
];

export default function Hero() {
  const [userCount, setUserCount] = useState(0);
  const [recentAvatars, setRecentAvatars] = useState<Array<{
    imageUrl: string;
    profileUrl: string;
  }>>([]);

  useEffect(() => {
    const supabase = getSupabase();
    
    const fetchData = async () => {
      const { count } = await supabase
        .from('strava_personality_test')
        .select('*', { count: 'exact', head: true });
      
      setUserCount(count || 0);
      
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

    const channel = supabase
      .channel('strava-personality-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'strava_personality_test'
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleGetStarted = () => {
    window.location.href = '/api/auth/strava';
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <RetroGrid className="absolute inset-0" />
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Main headline content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            Strava Personality Test
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300">
            Discover your unique Strava personality (based on your activity titles)
          </p>
          
          {/* Personality type icons */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {personalityTypes.map((type, index) => (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md">
                  <type.icon className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-sm font-medium">{type.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA section with adjusted layout for desktop/mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Main container for CTA elements */}
          <div className="relative w-full flex flex-col md:flex-row justify-center items-center gap-8">
            {/* Button - centered on both mobile and desktop */}
            <PulsatingButton
              onClick={handleGetStarted}
              className="text-lg px-8 py-4 order-1"
              pulseColor="rgba(252, 82, 0, 0.2)"
            >
              Get Your Strava Style
            </PulsatingButton>

            {/* Avatar circles - below on mobile, right side on desktop */}
            <div className="flex flex-col items-center order-2 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
              <AvatarCircles
                avatarUrls={recentAvatars}
                numPeople={userCount > 5 ? userCount - 5 : 0}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Join {userCount.toLocaleString()} runners who've already taken the test
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}