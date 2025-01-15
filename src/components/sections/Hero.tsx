// app/components/sections/Hero.tsx

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import RetroGrid from "@/components/ui/retro-grid";
import PulsatingButton from "@/components/ui/pulsating-button";
import AvatarCircles from "@/components/ui/avatar-circles";
import { getSupabase } from "@/lib/supabase";

export default function Hero() {
  const [userCount, setUserCount] = useState(0);
  const [recentAvatars, setRecentAvatars] = useState<Array<{
    imageUrl: string;
    profileUrl: string;
  }>>([]);

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

    // Set up realtime subscription for updates
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
    // TODO: Implement Strava OAuth flow
    window.location.href = '/api/auth/strava';
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <RetroGrid className="absolute inset-0" />
      
      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1 
          className="text-6xl md:text-7xl -mt-48 font-bold mb-4"
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

        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA Button */}
          <PulsatingButton
            onClick={handleGetStarted}
            className="text-lg px-8 py-4 mb-8"
            pulseColor="rgba(252, 82, 0, 0.2)" // Strava orange
          >
            Get Your Strava Style
          </PulsatingButton>
          
          {/* Social proof section */}
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
      </div>
    </section>
  );
}