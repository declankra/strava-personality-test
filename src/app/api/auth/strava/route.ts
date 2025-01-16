// src/app/api/auth/strava/route.ts

import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { StravaAuthResponse } from '@/types/strava';

// Constants
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/strava/callback`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    // Initial OAuth request - redirect to Strava
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=activity:read_all,profile:read_all`;
    return Response.redirect(stravaAuthUrl);
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const authData: StravaAuthResponse = await tokenResponse.json();

    // Store auth data in session (you might want to use a more secure method)
    const supabase = getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: 'strava' as any,
      options: {
        redirectTo: '/analyze',
      },
    });

    // Store token in secure session/cookie
    // Redirect to analysis page
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/analyze`);
  } catch (error) {
    console.error('Strava auth error:', error);
    // Encode the error message for better security
    const encodedError = encodeURIComponent(error instanceof Error ? error.message : 'auth_failed');
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=${encodedError}`);
  }
}