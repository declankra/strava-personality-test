// src/app/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages = {
  auth_denied: "You didn't authorize access to your Strava account. We need this to analyze your activity titles.",
  no_code: "Something went wrong with the Strava authorization process.",
  auth_failed: "We couldn't connect to your Strava account. Please try again.",
  analysis_failed: "We couldn't analyze your activity titles. Please try again.",
  default: "Something went wrong. Please try again.",
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('message') as keyof typeof errorMessages;
  const errorMessage = errorMessages[errorType] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {errorMessage}
        </p>
        <Link 
          href="/"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}