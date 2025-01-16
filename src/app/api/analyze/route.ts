// src/app/api/analyze/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { getSupabase } from '@/lib/supabase';
import type { StravaActivity, PersonalityResult } from '@/types/strava';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const MAX_ACTIVITIES = 100;

export async function GET(request: NextRequest) {
  try {
    // Get Strava token from cookie
    const cookieStore = cookies();
    const stravaToken = cookieStore.get('strava_access_token')?.value;

    if (!stravaToken) {
      return new Response('No Strava token found', { status: 401 });
    }

    // Fetch Strava activities
    const activities = await fetchStravaActivities(stravaToken);

    // Get Strava user profile for logging
    const profile = await fetchStravaProfile(stravaToken);

    // Extract titles and analyze
    const titles = activities.map(activity => activity.name);
    const analysis = await analyzeWithOpenAI(titles);

    // Log the result in Supabase (no auth needed)
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('strava_personality_test')
        .insert({
          strava_id: profile.id,
          user_name: `${profile.firstname} ${profile.lastname}`,
          user_avatar: profile.profile,
          user_strava_profile: `https://www.strava.com/athletes/${profile.id}`,
          personality_type: analysis.type,
          explanation: analysis.explanation,
          sample_titles: analysis.sampleTitles,
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

    // Return the analysis results
    return Response.json(analysis);
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

async function analyzeWithOpenAI(titles: string[]): Promise<PersonalityResult> {
  // Prepare the prompt for analysis
  const prompt = `Analyze these Strava activity titles and determine which personality type best matches the user's style. The titles are:

${titles.join('\n')}

Possible personality types are:
1. "The Poet" - Writes deeply philosophical titles reflecting on life's journey
2. "The Data Nerd" - Includes precise stats, conditions, and metrics
3. "The Storyteller" - Creates a narrative with each run
4. "The Minimalist" - Uses single words or keeps it purely functional
5. "The Motivator" - Includes inspirational quotes or messaging
6. "The Humorist" - Crafts witty, punny titles

Respond with JSON in this format:
{
  "type": "personality type name",
  "explanation": "2-3 sentences explaining why this type matches, referencing specific titles",
  "sampleTitles": ["array of 3 example titles that best demonstrate this style"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are analyzing Strava activity titles to determine a user's personality type. Be specific in your analysis and reference actual titles in your explanation."
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

  const result = JSON.parse(content);

  return result as PersonalityResult;
}