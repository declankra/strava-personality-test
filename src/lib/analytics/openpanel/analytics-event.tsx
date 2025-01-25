// src/lib/analytics/openpanel/analytics-event.tsx
"use client";

import { useEffect } from 'react';
import { useOpenPanel } from '@openpanel/nextjs';

interface AnalyticsEventProps {
  event: string;
  properties?: Record<string, any>;
  trigger?: 'mount' | 'unmount' | 'both';
  timeOnPage?: boolean;
}

export function AnalyticsEvent({ 
  event, 
  properties = {}, 
  trigger = 'mount',
  timeOnPage = false 
}: AnalyticsEventProps) {
  const op = useOpenPanel();
  
  useEffect(() => {
    const startTime = Date.now();

    // Track event on mount if specified
    if (trigger === 'mount' || trigger === 'both') {
      op.track(event, properties);
    }

    // Cleanup function for unmount tracking
    return () => {
      if (trigger === 'unmount' || trigger === 'both') {
        // Add time spent on page if requested
        const eventProps = timeOnPage 
          ? { 
              ...properties, 
              timeSpentSeconds: Math.floor((Date.now() - startTime) / 1000) 
            }
          : properties;
        
        op.track(event, eventProps);
      }
    };
  }, [event, properties, trigger, timeOnPage, op]);

  // Return null as this is a utility component
  return null;
}