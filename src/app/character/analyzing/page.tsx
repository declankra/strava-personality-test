// src/app/character/analyzing/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProgressGenie from '@/components/ui/progress-genie';
import { getSupabase } from '@/lib/supabase';

// Custom messages for each progress stage
const ANALYSIS_STAGES = [
    "Gathering your Strava data...",
    "Studying your training patterns...",
    "Sketching your character...",
    "Adding personality traits...",
    "Finalizing your unique athlete character...",
];

export default function CharacterAnalyzingPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateCharacter = async () => {
            // Get session ID from URL params
            const searchParams = new URLSearchParams(window.location.search);
            const stripeSessionId = searchParams.get('session_id');

            // Store in cookie before making generate request
            document.cookie = `stripe_session=${stripeSessionId}; path=/`;
            try {
                // Update Stripe session status in Supabase first
                if (!stripeSessionId) {
                    console.error('No stripe session ID found in URL parameters');
                }
                if (stripeSessionId) {
                    const supabase = getSupabase();
                    const { error: updateError } = await supabase
                        .from('strava_personality_stripe_sessions')
                        .update({
                            status: 'completed',
                            updated_at: new Date().toISOString()
                        })
                        .eq('session_id', stripeSessionId);
                
                    if (updateError) {
                        console.error('Failed to update session status:', updateError);
                        // Continue with character generation even if status update fails
                    }
                }
                
                // Start progress animation
                const progressInterval = setInterval(() => {
                    setProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90;
                        }
                        return prev + 10;
                    });

                    setCurrentStage(prev =>
                        prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev
                    );
                }, 2000);

                // Actually generate the character
                const response = await fetch('/api/character/generate', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                const result = await response.json();
                // Store in session storage with consistent key
                sessionStorage.setItem('character_image', result.imageData);

                // Redirect without needing to pass session ID
                router.push('/character/result');

            } catch (error) {
                console.error('Generation error:', error);
                setError(error instanceof Error ? error.message : 'Failed to generate character');
                router.push('/error?message=character_generation_failed');
            }
        };

        generateCharacter();
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/character')}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold mb-8">Creating Your Character</h1>

                    {/* Progress bar with genie */}
                    <div className="mb-4">
                        <ProgressGenie progress={progress} />
                    </div>

                    {/* Status message */}
                    <motion.p
                        key={ANALYSIS_STAGES[currentStage]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-600 dark:text-gray-300"
                    >
                        {ANALYSIS_STAGES[currentStage]}
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}