// src/app/result/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { ConfettiButton } from '@/components/ui/confetti';
import type { PersonalityResult } from '@/types/strava';

// Mapping of personality types to their image paths
const personalityImages = {
  'The Poet': '/images/personalities/poet.webp',
  'The Data Nerd': '/images/personalities/data-nerd.webp',
  'The Storyteller': '/images/personalities/storyteller.webp',
  'The Minimalist': '/images/personalities/minimalist.webp',
  'The Motivator': '/images/personalities/motivator.webp',
  'The Humorist': '/images/personalities/humorist.webp',
} as const;

type PersonalityType = keyof typeof personalityImages;

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
    </div>
  );
}

// Main results content component
function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<{ total: number; typeCount: number } | null>(null);
  const [personality, setPersonality] = useState<PersonalityResult | null>(null);
  const personalityType = searchParams.get('type') as PersonalityType;

  // Share functionality
  const handleShare = async () => {
    const shareText = `I'm a ${personalityType} Strava poster! ${
      personality?.explanation
    } What Strava poster are you?? Take the test now to find out! ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Strava Personality Test Result',
          text: shareText,
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
      }
    } else {
      // Clipboard fallback
      await navigator.clipboard.writeText(shareText);
      // TODO: Show toast notification
    }
  };

  // Load personality data and stats from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = getSupabase();
        
        // Get total count and type-specific count
        const [{ count: total }, { count: typeCount }] = await Promise.all([
          supabase.from('strava_personality_test').select('*', { count: 'exact', head: true }),
          supabase
            .from('strava_personality_test')
            .select('*', { count: 'exact', head: true })
            .eq('personality_type', personalityType)
        ]);

        setStats({ total: total || 0, typeCount: typeCount || 0 });

        // Get the user's specific results
        const { data } = await supabase
          .from('strava_personality_test')
          .select('personality_type, explanation, sample_titles')
          .eq('personality_type', personalityType)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setPersonality(data as PersonalityResult);
        }
      } catch (error) {
        console.error('Error loading results:', error);
        router.push('/error?message=results_load_failed');
      }
    };

    if (personalityType) {
      loadData();
    }
  }, [personalityType, router]);

  if (!personalityType || !personality || !stats) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Confetti effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 pointer-events-none"
      >
        <ConfettiButton className="hidden" />
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Result Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-12"
        >
          You are {personalityType}!
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Result Card */}
          <motion.div
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="relative aspect-square rounded-xl overflow-hidden shadow-xl"
          >
            <Image
              src={personalityImages[personalityType]}
              alt={personalityType}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Stats and Explanation */}
          <div className="flex flex-col justify-center space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-orange-500 font-semibold"
            >
              {Math.round((stats.typeCount / stats.total) * 100)}% of runners are also {personalityType}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-gray-700 dark:text-gray-300"
            >
              {personality.explanation}
            </motion.p>

            {/* Sample Titles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="space-y-2"
            >
              <h3 className="font-semibold mb-2">Your style in action:</h3>
              {personality.sample_titles.map((title, index) => (
                <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  "{title}"
                </p>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center space-y-6"
        >
          <Button
            onClick={handleShare}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg shadow-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share with friends
          </Button>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Share on Strava</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Post your result on Strava! Save the image above and use this caption:
            </p>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              Just took the Strava Personality Test and found out I'm {personalityType}! 
              {personality.explanation} 
              Find out your style: {window.location.origin} 🏃‍♂️✨
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Main page component
export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResultContent />
    </Suspense>
  );
}