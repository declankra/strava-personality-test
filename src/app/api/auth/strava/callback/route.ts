// src/app/api/auth/strava/callback/route.ts

import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { StravaAuthResponse } from '@/types/strava';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Strava auth error:', error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=auth_denied`);
  }

  if (!code) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=no_code`);
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const authData: StravaAuthResponse = await tokenResponse.json();

    // Store auth data in Supabase session
    const supabase = getSupabase();
    
    // Update session with Strava data
    await supabase.auth.updateUser({
      data: {
        strava_access_token: authData.access_token,
        strava_refresh_token: authData.refresh_token,
        strava_token_expires_at: authData.expires_at,
        strava_athlete_id: authData.athlete.id,
        strava_profile: `https://www.strava.com/athletes/${authData.athlete.id}`,
      }
    });

    // Redirect to analysis page
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/analyze`);
  } catch (error) {
    console.error('Strava auth error:', error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=auth_failed`);
  }
}