// src/app/error/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

// Error messages mapped to error codes
const ERROR_MESSAGES = {
  auth_failed: 'Authentication failed. Please try again.',
  insufficient_permissions: 'To analyze your athlete personality, we need access to:',
  title_selection_error: 'Oops! Our analysis genie had trouble reading some of your activity titles. This sometimes happens when processing unique or special characters. Please try again - it usually works on the second attempt!',
  default: 'An unexpected error occurred. Please try again.'
};

// Required permissions for the app to function
const REQUIRED_PERMISSIONS = [
  'View data about your public profile',
  'View your complete Strava profile',
  'View data about your private activities'
];

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('message') || 'default';

  const handleRetry = () => {
    if (errorCode === 'title_selection_error') {
      router.push('/api/auth/strava');
    } else {
      router.push('/api/auth/strava');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <AlertCircle className="w-12 h-12 text-orange-500" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {errorCode === 'insufficient_permissions' ? 'Additional Permissions Required' : 'Error'}
          </h1>

          {/* Error Message */}
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              {ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES]}
            </p>

            {/* Show permission list for insufficient_permissions error */}
            {errorCode === 'insufficient_permissions' && (
              <div className="text-left space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <ul className="space-y-2">
                  {REQUIRED_PERMISSIONS.map((permission, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="mr-2">•</span>
                      {permission}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  We don't store any sensitive information and this is only temporary.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleRetry}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {errorCode === 'insufficient_permissions' 
                ? 'Grant Permissions' 
                : errorCode === 'title_selection_error'
                ? 'Analysis Needs Another Try'
                : 'Try Again'}
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Return Home
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you continue to experience issues, please contact{' '}
            <a 
              href="mailto:business@dkbuilds.co" 
              className="text-orange-500 hover:text-orange-600"
            >
              support
            </a>
          </p>
        </div>
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