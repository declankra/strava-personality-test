// src/app/analyze/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AnalyzePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Connecting to Strava...');
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const analyzeActivities = async () => {
      // Prevent multiple simultaneous analysis attempts
      if (isAnalyzing) return;
      setIsAnalyzing(true);

      try {
        // Simulate progress while actually analyzing
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 1000);

        // Update status messages
        setTimeout(() => setStatus('Fetching your activities...'), 1500);
        setTimeout(() => setStatus('Analyzing your running style...'), 3000);
        setTimeout(() => setStatus('Almost there...'), 4500);

        // Make request with credentials
        const response = await fetch('/api/analyze', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 401) {
            // Handle unauthorized - redirect to auth
            router.push('/api/auth/strava');
            return;
          }
          throw new Error(errorText || 'Analysis failed');
        }

        clearInterval(progressInterval);
        setProgress(100);
        setStatus('Analysis complete!');

        // Redirect to results page
        const result = await response.json();
        router.push(`/result?type=${encodeURIComponent(result.type)}`);
      } catch (error) {
        console.error('Analysis error:', error);
        setError(error instanceof Error ? error.message : 'Analysis failed');
        
        // Handle specific error cases
        if (error instanceof Error) {
          if (error.message.includes('token')) {
            router.push('/api/auth/strava'); // Re-authenticate
            return;
          }
        }
        
        router.push('/error?message=analysis_failed');
      } finally {
        // Reset analyzing state in case user navigates back
        setIsAnalyzing(false);
      }
    };

    analyzeActivities();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/api/auth/strava')}
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
          <h1 className="text-3xl font-bold mb-8">Analyzing Your Athlete Personality</h1>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
            <motion.div
              className="bg-orange-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Status message */}
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 dark:text-gray-300"
          >
            {status}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}