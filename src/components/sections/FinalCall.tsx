// app/components/sections/FinalCall.tsx

"use client";

import PulsatingButton from "@/components/ui/pulsating-button";

export default function FinalCall() {
  const handleGetStarted = () => {
    // TODO: Implement Strava OAuth flow
    window.location.href = '/api/auth/strava';
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
      // TODO: Add toast notification for feedback
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        {/* Share button */}
        <button
          onClick={handleShare}
          className="mb-4 px-8 py-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Share with a friend
        </button>

        {/* Final CTA button */}
        <PulsatingButton
          onClick={handleGetStarted}
          className="block mx-auto"
          pulseColor="rgba(252, 82, 0, 0.2)"
        >
          Take the test now
        </PulsatingButton>
      </div>
    </section>
  );
}