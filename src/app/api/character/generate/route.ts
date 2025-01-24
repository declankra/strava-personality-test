// src/app/api/character/generate/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase';
import Stripe from 'stripe';
import OpenAI from 'openai';

// Define the extended parameters type
interface NebiusImageParams extends OpenAI.ImageGenerateParams {
    extra_body?: {
      response_extension?: string;
      width?: number;
      height?: number;
      num_inference_steps?: number;
      seed?: number;
      negative_prompt?: string;
    };
  }

// Create client with the correct type
const nebius = new OpenAI({
    baseURL: "https://api.studio.nebius.ai/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
  }) as unknown as OpenAI & { images: { generate(params: NebiusImageParams): Promise<any> } };
  

  const stripe = new Stripe(
    process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_SECRET_KEY!
      : process.env.STRIPE_SECRET_KEY_DEV!,
  );
  
// Types for our response
interface StrokeData {
    favoriteActivity: string;
    gender?: string;
    name: string;
    profilePicture?: string;
    personalityType: string;
  }

// Add this interface near the top of the file
interface UserData {
  favorite_activity: string;
  gender?: string;
  user_name: string;
  user_avatar?: string;
  personality_type: string;
}
  
export async function POST(request: NextRequest) {
    try {
      const cookieStore = cookies();
      const sessionId = cookieStore.get('analysis_session')?.value;
      const stripeSessionId = cookieStore.get('stripe_session')?.value;
  
      if (!sessionId || !stripeSessionId) {
        return Response.json({ error: 'Invalid session' }, { status: 401 });
      }
  
      // Verify payment status
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId); 
      if (session.payment_status !== 'paid') {
        return Response.json({ error: 'Payment required' }, { status: 402 });
      }
  
      // Fetch user data from Supabase
      const supabase = getSupabase();
      const { data: userData } = await supabase
        .from('strava_personality_test')
        .select('*')
        .eq('session_id', sessionId)
        .single() as { data: UserData };
  
      if (!userData) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }
  
      // Generate the image prompt based on user data
      const imagePrompt = generateImagePrompt({
        favoriteActivity: userData.favorite_activity,
        gender: userData.gender,
        name: userData.user_name,
        profilePicture: userData.user_avatar,
        personalityType: userData.personality_type,
      });
  
      // Generate image using Nebius
      const imageResponse = await nebius.images.generate({
        model: "black-forest-labs/flux-dev",
        prompt: imagePrompt,
        response_format: "b64_json",
        extra_body: {
          response_extension: "webp",
          width: 512,
          height: 512,
          num_inference_steps: 30,
          seed: -1,
          negative_prompt: "Deformed, unrealistic, cartoon, anime, sketch",
        },
      });

 // Get base64 image data
 const imageData = `data:image/webp;base64,${imageResponse.data[0].b64_json}`;

 // Update Supabase with character image information
 const { error: updateError } = await supabase
   .from('strava_personality_test')
   .update({
    character_image_url: 'data:image/webp;base64',
    character_generated_at: new Date().toISOString()
   })
   .eq('session_id', sessionId);

 if (updateError) {
   console.error('Failed to update character image info:', updateError);
   // Continue with response even if update fails - we can add retry logic later
 }

 // Return the image data to the client
 return Response.json({ imageData });

} catch (error) {
  console.error('Character generation error:', error);
  return Response.json(
    { error: 'Failed to generate character' },
    { status: 500 }
  );
}
}
  
  // Helper function to generate image prompt
  function generateImagePrompt(userData: StrokeData & { personalityType: string }) {
    const personalityTraits = {
      'Motivator': 'confident and inspiring',
      'Data Enthusiast': 'analytical and focused',
      'Glory Chaser': 'determined and competitive',
      'Storyteller': 'contemplative and expressive',
      'Essentialist': 'minimalist and straightforward',
      'Comedian': 'playful and lighthearted'
    };
  
    const basePrompt = `A realistic portrait of an athlete with ${personalityTraits[userData.personalityType as keyof typeof personalityTraits]} expression. 
      They are wearing athletic gear appropriate for ${userData.favoriteActivity}. 
      The lighting is dramatic and emphasizes their determination.`;
  
    // Add gender detail if available
    const demographicDetails = [];
    if (userData.gender) demographicDetails.push(userData.gender);
    
    const demographicPrompt = demographicDetails.length > 0 
      ? `The athlete is ${demographicDetails.join(', ')} gender (where M is male and F is female).` 
      : '';
  
    return `${basePrompt} ${demographicPrompt} High quality, photorealistic, detailed.`;
  }