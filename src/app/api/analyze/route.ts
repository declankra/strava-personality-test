// src/app/api/analyze/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { getSupabase } from '@/lib/supabase';
import type { 
  StravaActivity, 
  OpenAIPersonalityResult,
  PersonalityResult 
} from '@/types/strava';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const MAX_ACTIVITIES = 100;

export async function GET(request: NextRequest) {
  try {
    // Get Strava token from cookie
    const cookieStore = cookies();
    const sessionId = cookieStore.get('analysis_session')?.value;
    const stravaToken = cookieStore.get('strava_access_token')?.value;

    if (!stravaToken) {
      return new Response('No Strava token found', { status: 401 });
    }
    if (!sessionId) {
      return new Response('No session ID found', { status: 401 });
    }

    const supabase = getSupabase();

    // Check if analysis exists for this session
    const { data: existingAnalysis } = await supabase
      .from('strava_personality_test')
      .select('*')
      .eq('session_id', sessionId)
      .single();
  
    if (existingAnalysis) {
      return Response.json({
        type: existingAnalysis.personality_type,
        explanation: existingAnalysis.explanation,
        sampleTitles: existingAnalysis.sample_titles
      });
    }

    // Fetch Strava activities
    const activities = await fetchStravaActivities(stravaToken);

    // Get Strava user profile for logging
    const profile = await fetchStravaProfile(stravaToken);

    // Extract titles and analyze
    const titles = activities.map(activity => activity.name);
    const openAIResult = await analyzeWithOpenAI(titles);

    // Transform OpenAI result to database format
    const analysis: PersonalityResult = {
      personality_type: openAIResult.type,
      explanation: openAIResult.explanation,
      sample_titles: openAIResult.sampleTitles
    };

    // Log the result in Supabase
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('strava_personality_test')
        .insert({
          session_id: sessionId,
          strava_id: profile.id,
          user_name: `${profile.firstname} ${profile.lastname}`,
          user_avatar: profile.profile,
          user_strava_profile: `https://www.strava.com/athletes/${profile.id}`,
          personality_type: analysis.personality_type,
          explanation: analysis.explanation,
          sample_titles: analysis.sample_titles,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Successfully stored results in Supabase:', { id: data.id });
    } catch (error) {
      console.error('Failed to store results in Supabase:', error);
      return new Response('Failed to store results', { status: 500 });
    }

    // Return the analysis results in the format expected by the frontend
    return Response.json({
      type: analysis.personality_type,
      explanation: analysis.explanation,
      sampleTitles: analysis.sample_titles
    });
  } catch (error) {
    console.error('Unexpected error in analyze route:', error);
    return new Response('Analysis failed', { status: 500 });
  }
}

async function fetchStravaProfile(accessToken: string) {
  const response = await fetch(`${STRAVA_API_BASE}/athlete`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Strava profile');
  }

  return response.json();
}

async function fetchStravaActivities(accessToken: string): Promise<StravaActivity[]> {
  const response = await fetch(
    `${STRAVA_API_BASE}/athlete/activities?per_page=${MAX_ACTIVITIES}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Strava activities');
  }

  return response.json();
}

async function analyzeWithOpenAI(titles: string[]): Promise<OpenAIPersonalityResult> {
  const prompt = `Analyze these Strava activity titles and determine which personality type best matches the user's style. The titles are:

${titles.join('\n')}

Possible personality types are:
1. "Motivator" - Hypes others with motivational quotes and good vibes
2. "Data Enthusiast" - Every title includes precise stats, conditions, and metrics
3. "Glory Chaser" - Chases PRs, podiums, and leaderboard domination with grit
4. "Storyteller" - Turns every workout into a reflective and poetic story
5. "Essentialist" - Doesn't change the default titles, no frills, no fuss
6. "Comedian" - Crafts witty puns and jokes to entertain and lighten the mood

Respond with JSON in this format:
{
  "type": "personality type name",
  "explanation": "2-3 sentences explaining why this personality type matches, referencing specific titles",
  "sampleTitles": ["array of 3 referenced titles that best demonstrate this style"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are analyzing Strava activity titles to determine a user's personality type. Your tone is known-it-all, witty, confident and almost-mystic, leaving the users with a sense of being understood. Be specific in your analysis and reference actual titles in your explanation. Speak directly to the user."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  return JSON.parse(content) as OpenAIPersonalityResult;
}