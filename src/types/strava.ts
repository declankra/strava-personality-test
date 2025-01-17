// src/types/strava.ts

export interface StravaActivity {
  id: number;
  name: string;
  start_date: string;
  type: string;
}

export interface StravaAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
  };
}

// OpenAI API response interface
export interface OpenAIPersonalityResult {
  type: string;
  explanation: string;
  sampleTitles: string[];
}

// Database result interface
export interface PersonalityResult {
  personality_type: string;
  explanation: string;
  sample_titles: string[];
}