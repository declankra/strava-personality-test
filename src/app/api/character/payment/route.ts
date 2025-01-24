// src/app/api/character/payment/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_SECRET_KEY!
    : process.env.STRIPE_SECRET_KEY_DEV!,
  { 
    // Use a stable API version, e.g., "2022-11-15" or the latest you prefer.
    apiVersion: '2024-12-18.acacia'
  }
);

export async function POST(request: NextRequest) {
  try {
    // 1. Get session ID from cookie
    const cookieStore = cookies();
    const analysisSession = cookieStore.get('analysis_session')?.value;

    if (!analysisSession) {
      return new Response(JSON.stringify({ error: 'No session found' }), { status: 401 });
    }

    // 2. Fetch user data from Supabase to include in metadata
    const supabase = getSupabase();
    const { data: userData } = await supabase
      .from('strava_personality_test')
      .select('*')
      .eq('session_id', analysisSession)
      .single();

    if (!userData) {
      return new Response(JSON.stringify({ error: 'User data not found' }), { status: 404 });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Personalized Athlete Character',
                description: 'An image of a unique athlete character based on your Strava personality and training activity',
              },
              unit_amount: 169, // $1.69 in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/character/analyzing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/character?canceled=1`,
        payment_method_types: ['card'],
        metadata: {
          strava_session_id: analysisSession,
          personality_type: userData.personality_type?.toString() ?? null,
        },
      };
    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // 4. Store the Stripe session ID in Supabase for verification
    await supabase
      .from('strava_personality_stripe_sessions')
      .insert({
        session_id: session.id,
        strava_session_id: analysisSession,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    // 5. Return the session ID to the client
    return new Response(
      JSON.stringify({
        sessionId: session.id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment initialization error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to initialize payment' }),
      { status: 500 }
    );
  }
}

// For completeness, your GET endpoint stays the same if you want to check status
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'No session ID provided' }),
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return new Response(
      JSON.stringify({
        status: session.status,
        payment_status: session.payment_status
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve session status' }),
      { status: 500 }
    );
  }
}
