// src/app/result/page.tsx
'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import Confetti, { ConfettiRef } from '@/components/ui/confetti';
import type { PersonalityResult } from '@/types/strava';
import { toast } from 'sonner';
import { ChevronUp, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import EmojiFeedback from '@/components/ui/emoji-feedback';
import PaidFeaturePromotion from '@/components/ui/paid-feature-promotion';
import { useOpenPanel } from '@openpanel/nextjs';
import { AnalyticsEvent } from '@/lib/analytics/openpanel/analytics-event';

// Add the bubble text style at the top of the file after imports
const bubbleTextStyle = {
  textShadow: "0px 2px 0px #8B5CF6",
  WebkitTextStroke: "1.25px #8B5CF6",
  backgroundColor: "#F59E0B",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

// Mapping of personality types to their image paths
const personalityImages = {
  'Motivator': '/images/personalities/motivator.webp',
  'Data Enthusiast': '/images/personalities/data-enthusiast.webp',
  'Glory Chaser': '/images/personalities/glory-chaser.webp',
  'Storyteller': '/images/personalities/storyteller.webp',
  'Essentialist': '/images/personalities/essentialist.webp',
  'Comedian': '/images/personalities/comedian.webp',
} as const;

type PersonalityType = keyof typeof personalityImages;

// Emoji mappings for each personality type
const personalityEmojis = {
  'Motivator': '💪 🔥 ✨',
  'Data Enthusiast': '📊 📈 🎯',
  'Glory Chaser': '🏆 🥇 ⭐',
  'Storyteller': '📖 ✍️ 🎬',
  'Essentialist': '🥱🎯',
  'Comedian': '😂 🤪 🎭'
};


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
  const confettiRef = useRef<ConfettiRef>(null);
  const op = useOpenPanel();


  const handleShare = async () => {
    // Track share attempt
    op.track('share_button_click', {
      location: 'results_page',
      personality_type: personalityType,
      share_type: typeof navigator.share !== 'undefined' ? 'native' : 'clipboard'
    });
    const emojis = personalityEmojis[personalityType as keyof typeof personalityEmojis] || '🎉';
    const shareText = `I'm a ${personalityType}! ${emojis}\n\nWhat do your Strava posts say about you?? 🤔\n\nTake the test now to find out! 🎉\nhttps://athletepersonalitytest.com `;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Just took the Athlete Personality Test - Powered by Strava',
          text: shareText,
        });
        // Track successful share
        op.track('share_completed', {
          location: 'results_page',
          personality_type: personalityType,
          share_type: 'native'
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Results copied to clipboard! Share it with your friends! 🎉', {
          duration: 3000,
          className: 'bg-orange-500 text-white',
        });
      }
    } else {
      // Clipboard fallback
      await navigator.clipboard.writeText(shareText);
      op.track('share_completed', {
        location: 'results_page',
        personality_type: personalityType,
        share_type: 'clipboard'
      });
      toast.success('Results copied to clipboard! Share it with your friends! 🎉', {
        duration: 3000,
        className: 'bg-orange-500 text-white',
      });
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
          .select('personality_type, explanation, sample_titles, session_id')
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

  // Trigger confetti
  useEffect(() => {
    if (!personality) return;

    // Confetti configuration
    const end = Date.now() + 1.75 * 1000; // 1.75 seconds duration
    const colors = ['#F59E0B', '#8B5CF6', '#EF4444', '#10B981']; // Orange, Purple, Red, Green

    const frame = () => {
      if (Date.now() > end) return;

      // Left cannon
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
        gravity: 0.8,
        scalar: 1.2
      });

      // Right cannon
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
        gravity: 0.8,
        scalar: 1.2
      });

      requestAnimationFrame(frame);
    };

    // Initial burst for extra effect
    const burstConfetti = () => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.7 }
      });
    };

    burstConfetti();
    frame();
  }, [personality]);


  if (!personalityType || !personality || !stats) {
    return <LoadingSpinner />;
  }

  // Sample Titles section component for results page
  const SampleTitles = ({ titles }: { titles: Array<{ title: string; activity_url: string }> }) => {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold mb-2">Your personality in action:</h3>
        <ul className="space-y-3">
          {titles.map((title, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                "{title.title}"
              </span>
              <a
                href={title.activity_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                View on Strava
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Track page view duration */}
      <AnalyticsEvent
        event="results_page_view"
        properties={{ personality_type: personalityType }}
        timeOnPage={true}
        trigger="unmount"
      />
      {/* Confetti component */}
      <div className="fixed inset-0 pointer-events-none">
        <Confetti
          ref={confettiRef}
          manualstart={true}
          options={{
            gravity: 0.8,
            spread: 90,
            startVelocity: 45,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Result Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-12"
        >
          You are the <span style={bubbleTextStyle}>{personalityType}!</span>
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Result Card */}
          <motion.div
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
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
              {Math.round((stats.typeCount / stats.total) * 100)}% of Strava athletes are also {personalityType}s
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
              <SampleTitles titles={personality.sample_titles} />
            </motion.div>
          </div>
        </div>

        {/* Emoji Feedback Section */}
        {personality && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <EmojiFeedback
              personalityType={personalityType}
              sessionId={personality.session_id}
            />
          </motion.div>
        )}

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center space-y-4 relative"
        >
          <Button
            onClick={handleShare}
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-6 rounded-xl shadow-lg font-extrabold text-lg"
          >
            <Share className="w-6 h-6 mr-3" />
            Share with friends
          </Button>

          {/* Bouncing Arrow Animation - Moved below button */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-orange-500 flex flex-col items-center"
          >
            <ChevronUp className="w-8 h-8 font-extrabold" />
            <span className="text-sm font-extrabold whitespace-nowrap mb-6">See what your friends are!</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Paid Feature Promotion */}
      <PaidFeaturePromotion personalityType={personalityType} />

      {/* Back button - positioned relatively above footer */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3 }}
        onClick={() => router.push('/')}
        className="relative mt-32 -mb-20 bottom-8 left-2 flex items-center gap-4 text-gray-300 hover:text-orange-600 transition-colors focus:outline-none"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-regular text-sm">Back to Home</span>
      </motion.button>
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