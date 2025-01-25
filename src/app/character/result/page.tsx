// src/app/character/result/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { getSupabase } from '@/lib/supabase';
import WrittenFeedback from '@/components/ui/written-feedback';
import { useOpenPanel } from '@openpanel/nextjs';
import { AnalyticsEvent } from '@/lib/analytics/openpanel/analytics-event';

interface UserData {
  user_name?: string;
  personality_type?: string;
  favorite_activity?: string;
  gender?: string;
  session_id?: string;
}

export default function CharacterResultPage() {
  const router = useRouter();
  const op = useOpenPanel();
  const [imageData, setImageData] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        // First check session storage
        const storedImage = sessionStorage.getItem('character_image');
        if (!storedImage) {
          setError('no_character_found');
          return;
        }

        // Set image data first
        setImageData(storedImage);

        // Then fetch user data
        const supabase = getSupabase();
        const { data, error: supabaseError } = await supabase
          .from('strava_personality_test')
          .select('user_name, personality_type, favorite_activity, gender, session_id')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          // Don't set error here as we still want to show the image
        } else {
          setUserData(data as UserData);
        }

        // Trigger confetti effect
        const end = Date.now() + 2 * 1000;
        const colors = ['#F59E0B', '#8B5CF6'];

        const frame = () => {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors
          });

          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };

        frame();
      } catch (err) {
        console.error('Initialization error:', err);
        setError('initialization_failed');
      } finally {
        setLoading(false);
      }
    };

    initializePage();

    // Cleanup function
    return () => {
      // Only remove from sessionStorage when actually leaving the page
      if (document.visibilityState === 'hidden') {
        sessionStorage.removeItem('character_image');
      }
    };
  }, []);

  // Handle error states after loading is complete
  useEffect(() => {
    if (!loading && error) {
      router.push(`/error?message=${error}`);
    }
  }, [loading, error, router]);

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = imageData!;
      link.download = 'my-athlete-character.webp';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track successful download
      op.track('character_download', {
        personality_type: userData?.personality_type,
        favorite_activity: userData?.favorite_activity,
        gender: userData?.gender
      });

      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
      // Track download failure
      op.track('character_download_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Don't render anything if we're about to redirect due to error
  if (error) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4">
            {/* Track page view duration */}
            <AnalyticsEvent 
        event="character_result_page_view" 
        properties={{
          personality_type: userData?.personality_type,
          favorite_activity: userData?.favorite_activity,
          gender: userData?.gender
        }}
        timeOnPage={true}
        trigger="unmount"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {userData?.user_name ? `${userData.user_name}'s` : 'Your'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">
              Athlete Character
            </span>!
          </h1>
          <p className="text-lg text-orange-500 italic">
            powered by Strava
          </p>
        </motion.div>

        {/* Character Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative aspect-square max-w-xl mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={imageData || ''}
            alt="Your Athlete Character"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-400 text-center mb-8 max-w-2xl mx-auto"
        >
          This is a generative image based on your personality type
          {userData?.personality_type && ` (${userData.personality_type})`}
          {userData?.favorite_activity && `, most frequent Strava activity (${userData.favorite_activity})`}
          {userData?.gender && `, and your gender (${userData.gender})`}. Because of its generative nature,
          it may not be accurate or you simply might not like it. If that's the case, email me at
          business@dkbuilds.co and I'll personally refund you.
        </motion.p>

        {/* Use Case */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8 font-semibold text-lg"
        >
          Perfect for your Strava profile picture! 🏃‍♂️
        </motion.p>

        {/* Action Buttons - Simplified to single Share button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center mb-6"
        >
          <Button
            onClick={handleDownload}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 font-extrabold text-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Character
          </Button>
        </motion.div>

        {/* Motivational Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-md font-medium text-gray-600 dark:text-gray-300 italic"
        >
          Now, keep having fun with it 🫡
        </motion.p>

        {/* Written Feedback Section */}
        {userData?.session_id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <WrittenFeedback sessionId={userData.session_id} />
          </motion.div>
        )}
      </div>
    </div>
  );
}