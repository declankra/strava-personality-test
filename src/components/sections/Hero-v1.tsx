"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import RetroGrid from "@/components/ui/retro-grid";
import AvatarCircles from "@/components/ui/avatar-circles";
import { ChevronUp } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const bubbleLetterStyle = {
    textShadow: "2px 2px 0px #8B5CF6",
    WebkitTextStroke: "2px #8B5CF6",
    backgroundImage: "linear-gradient(45deg, #8B5CF6, #F59E0B)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }

interface Avatar {
    imageUrl: string;
    profileUrl: string;
  }
  
export default function Hero() {
  const [userCount, setUserCount] = useState(0);
  const [recentAvatars, setRecentAvatars] = useState<Avatar[]>([]);

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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'strava_personality_test' }, 
          () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleGetStarted = () => {
    window.location.href = '/api/auth/strava';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <RetroGrid className="absolute inset-0" opacity={0.3} />
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-8 mb-12"
        >
          <div className="relative w-64 h-48 -rotate-6 shadow-xl rounded-lg overflow-hidden">
            <Image
              src="/images/iPhone/preview_cropped.webp"
              alt="Strava post preview"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
        
        {/* Main Headline */}
        <div className="mb-16">
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
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            Discover Your Unique Athlete Personality — {" "}
            <span className="text-orange-500 font-medium ">
              Powered by Strava
            </span>
          </p>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-6 w-full"
        >
          <div className="relative">
            {/* Connect with Strava button */}
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
            
            {/* Bouncing arrow */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 -bottom-12 -translate-x-1/2 text-orange-500"
            >
              <ChevronUp className="w-12 h-12" />
            </motion.div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-col items-center">
            <AvatarCircles
              avatarUrls={recentAvatars}
              numPeople={userCount > 5 ? userCount - 5 : 0}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Join {userCount.toLocaleString()} runners who've discovered their style
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}