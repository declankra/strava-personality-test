// src/types/strava.ts

export interface StravaActivity {
  id: number;
  name: string;
  start_date: string;
  type: string;
}

export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
  sex?: string;
}

export interface StravaAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: StravaAthlete;
}

// OpenAI API response interface
export interface OpenAIPersonalityResult {
  type: string;
  explanation: string;
  sampleTitles: Array<{
    title: string;
    activityId: number;
  }>;
}

// Database result interface
export interface PersonalityResult {
  personality_type: string;
  explanation: string;
  sample_titles: Array<{
    title: string;
    activity_url: string;
  }>;
  session_id: string;
}