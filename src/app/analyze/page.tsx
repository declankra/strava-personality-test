'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AnalyzePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Connecting to Strava...');

  useEffect(() => {
    const analyzeActivities = async () => {
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

        // Actually perform the analysis
        const response = await fetch('/api/analyze');
        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        clearInterval(progressInterval);
        setProgress(100);
        setStatus('Analysis complete!');

        // Redirect to results page
        const result = await response.json();
        router.push(`/result?type=${encodeURIComponent(result.type)}`);
      } catch (error) {
        console.error('Analysis error:', error);
        router.push('/error?message=analysis_failed');
      }
    };

    analyzeActivities();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Analyzing Your Strava Style</h1>
          
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