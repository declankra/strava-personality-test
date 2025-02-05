// src/app/api/auth/strava/callback/route.ts

import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import type { StravaAuthResponse } from '@/types/strava';

// Required scopes for the application to function
const REQUIRED_SCOPES = ['profile:read_all', 'activity:read_all'];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const scope = searchParams.get('scope');

  if (error) {
    console.error('Strava auth error:', error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=auth_denied`);
  }

  if (!code) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=no_code`);
  }

  // Check if all required scopes were granted
  if (scope) {
    const grantedScopes = scope.split(',');
    const hasSufficientPermissions = REQUIRED_SCOPES.every(
      requiredScope => grantedScopes.includes(requiredScope)
    );

    if (!hasSufficientPermissions) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=insufficient_permissions`
      );
    }
  }

  try {
    // Exchange code for Strava tokens
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

    const stravaAuth: StravaAuthResponse = await tokenResponse.json();

    // Store Strava tokens in secure HTTP-only cookies
    const cookieStore = cookies();
    cookieStore.set('strava_access_token', stravaAuth.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour - tokens expire in 6 hours anyway
    });

    const sessionId = crypto.randomUUID(); // Generate unique session ID
    // Store in secure cookie
    cookieStore.set('analysis_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15 // 15 minutes
    });

    // Redirect to analysis page
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/analyze`);
  } catch (error) {
    console.error('Strava auth error:', error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=auth_failed`);
  }
}