# Athlete Personality Test

![Athlete Personality Test Preview](/public/preview.png)

> **Discover Your Unique Athlete Personality — Powered by Strava**

A personality analysis app that reads your Strava activity titles and matches you with one of six distinct athlete personalities, from the "Data Enthusiast" to the "Storyteller". Complete with custom avatar generation and viral sharing features.

[Try it out →](https://www.athletepersonalitytest.com)

## Why I Built This

Three simple observations sparked this project:

1. Strava users pour their personalities into their activity titles, creating a unique digital diary
2. Everyone loves discovering insights about themselves through personality analysis
3. Athletic achievements are more fun when shared with friends

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Next.js API Routes with:
  - OpenAI API for personality analysis
  - Stripe for secure payments
  - Supabase for serverless database
- **Authentication**: Strava OAuth 2.0
- **Analytics**: OpenPanel
- **Deployment**: Vercel

## How It Works

1. **Connect with Strava**: Grant read access to your activity data through OAuth
2. **Analysis**: We extract your last 100 activity titles and analyze them using GPT-4
3. **Results**: Get matched with one of six athlete personalities, complete with explanation and sample titles
4. **Optional**: Generate a custom athlete character avatar (paid feature)

## Key Features

- 🏃‍♂️ Six distinct athlete personalities based on actual Strava user behavior
- 🤖 AI-powered analysis of activity titles using GPT-4
- 🎯 Custom character generation with advanced image AI
- 📱 Fully responsive design optimized for mobile athletes
- 📊 Serverless architecture with Supabase for real-time user insights
- 📈 Comprehensive OpenPanel analytics for user engagement tracking
- 💳 Secure Stripe integration for premium features
- 🛡️ Robust error handling with graceful fallbacks

## Running Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/athlete-personality-test.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Required environment variables:
- `NEXT_PUBLIC_BASE_URL`
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEBIUS_API_KEY`

![Powered by Strava](public/api_logo_pwrdBy_strava_horiz_gray.svg)

## License

MIT © [Your Name]
