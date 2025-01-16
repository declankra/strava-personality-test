// src/app/error/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An unknown error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{errorMessage === 'auth_failed' ? 'Authentication failed. Please try again.' : errorMessage}</p>
        <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}