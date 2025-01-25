// src/app/api/analyze/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { getSupabase } from '@/lib/supabase';
import type { 
  StravaActivity, 
  OpenAIPersonalityResult,
  PersonalityResult,
  StravaAthlete
} from '@/types/strava';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const MAX_ACTIVITIES = 100;

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

async function analyzeWithOpenAI(activities: StravaActivity[]): Promise<OpenAIPersonalityResult> {
  // Create a mapping of titles to their activity IDs
  const titleToIdMap = new Map(
    activities.map(activity => [activity.name, activity.id])
  );

  // Create the activity list for OpenAI
  const titlesList = activities.map(activity => activity.name);

  const prompt = `Analyze these Strava activity titles and determine which personality type best matches the user's style. The titles are:

${titlesList.join('\n')}

Possible personality types are:
1. "Motivator" - Hypes others with motivational quotes and good vibes
2. "Data Enthusiast" - Every title includes precise stats, conditions, and metrics
3. "Glory Chaser" - Chases PRs, podiums, and leaderboard domination with grit
4. "Storyteller" - Turns every workout into a reflective and poetic story
5. "Essentialist" - Doesn't change the default titles, no frills, no fuss
6. "Comedian" - Crafts witty puns and jokes to entertain and lighten the mood

IMPORTANT: You must select THREE titles from the EXACT list above. DO NOT MODIFY OR PARAPHRASE THE TITLES. 
For each selected title, I will look up its corresponding activity ID, so the TITLES MUST MATCH EXACTLY.
!!!! WRITE THE SAMPLE TITLES VERBATIM (INCLUDE QUOTES AND ANY SPECIAL CHARACTERS) !!!!! 
IF YOU ALTER THE TITLES IN ANY WAY, YOU WILL BE FIRED.

Respond with JSON in this format:
{
  "type": "personality type name",
  "explanation": "2-3 sentences explaining why this personality type matches, referencing specific titles",
  "sampleTitles": ["title1", "title2", "title3"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are analyzing Strava activity titles to determine a user's personality type. Your tone is known-it-all, witty, confident and almost-mystic, leaving the users with a sense of being understood. Be specific in your analysis and reference actual titles in your explanation. Speak directly to the user. When selecting sample titles, you must use exact matches from the provided list."
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

  let result;
  try {
    result = JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    throw new Error('Invalid response format from OpenAI');
  }

  if (!Array.isArray(result.sampleTitles) || result.sampleTitles.length !== 3) {
    throw new Error('Invalid sample titles format from OpenAI');
  }

  // Validate and map the selected titles to their activity IDs
  const sampleTitlesWithIds = result.sampleTitles.map((title: string) => {
    const activityId = titleToIdMap.get(title);
    if (!activityId) {
      console.error(`No matching activity ID found for title: ${title}`);
      throw new Error('Invalid title selection from OpenAI');
    }
    return {
      title,
      activityId
    };
  });

  return {
    type: result.type,
    explanation: result.explanation,
    sampleTitles: sampleTitlesWithIds
  };
}

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

    // Fetch Strava activities and athlete profile in parallel
    const [activities, profile] = await Promise.all([
      fetchStravaActivities(stravaToken),
      fetchStravaProfile(stravaToken)
    ]);

    // Analyze titles
    const openAIResult = await analyzeWithOpenAI(activities);

    // Determine favorite activity type
    const activityCounts = activities.reduce((acc: { [key: string]: number }, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});
    
    const favoriteActivity = Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Transform OpenAI result to database format
    const analysis: PersonalityResult = {
      personality_type: openAIResult.type,
      explanation: openAIResult.explanation,
      sample_titles: openAIResult.sampleTitles.map(({ title, activityId }) => ({
        title,
        activity_url: `https://www.strava.com/activities/${activityId}`
      })),
      session_id: sessionId
    };

    // Store in database
    try {
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
          favorite_activity: favoriteActivity,
          gender: profile.sex || null,
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