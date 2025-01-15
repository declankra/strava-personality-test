
# Initial Product Description

**What**: a viral website that finds your Strava personality type based off your running post titles

**Why**: because (1) people use Strava post titles to tell their story day-by-day and (2) people love being analyzed and (3) sharing fun results with friends

**Domain**: stravapersonalitytest.com

---

To start, i want to keep it simple so that I can get something up quickly, without adding complexity that is a waste of time because i could have different opinions on how it should look in the future. therefore, it will have two pages.

**Pages**:

[stravapersonalitytest.com](http://stravapersonalitytest.com)/ → homepage with main headline, call to action, and details on what the tool is

1. Attention grabbing hero section
    1. Headline: Strava Personality Test
    2. Subheadline: Discover your unique Strava personality (based on your activity titles)
    3. Background: Retro grid (retro-grid.tsx)
2. Call to action area
    1. A main "Get Your Strava Style" button that triggers the OAuth flow (using puslating-button)
    2. “Credibility / Urge to get in before missing out” with number of people who have already taken the test (using avatar-circles)
        1. the number should be auto-populated by counting the number of rows in the strava-personality-test table in Supabase using Supabase realtime API
3. Personality Types section
    1. Images (public/images/personalities/) will be made for each personality type and displayed using focus-cards.tsx  (3 rows x 2 columns)
    2. 6 personalities: description
        - "The Poet" - Writes deeply philosophical titles reflecting on life's journey through running. Example: "Dancing with dawn's first light, finding myself mile by mile"
        - "The Data Nerd" - Every title includes precise stats, conditions, and metrics. Example: "6.2mi @ 7:45/mi, 72°F, 65% humidity, Z2 training"
        - "The Storyteller" - Creates a narrative with each run. Example: "That time I chased a squirrel and found a secret trail"
        - "The Minimalist" - Uses single words or keeps it purely functional. Example: "Morning Run" or "Tuesday Easy"
        - "The Motivator" - Always includes inspirational quotes or messaging. Example: "Nothing worth having comes easy 💪 #grateful"
        - "The Humorist" - Consistently crafts witty, punny titles. Example: "Running late (literally)" or "These legs are made for running"
4. iPhone mockup of Strava app to make it real
    1. sources image from public/images/iPhone (component is /ui/iphone-15-pro)
    2. with promotional text text saying, ‘who are you??’ at the top
5. Bottom hero section
    1. Share with a friend button (copy URL to clipboard on desktop or initiate share on mobile touch screens)
    2. ‘Take the test now’ button
6. Footer section
    1. link in bottom left that says ‘Made by Declan’ {Declan links to www.declankramper.com)

[stravapersonalitytest.com/result](http://stravapersonalitytest.com/result) → results page that returns the user’s test results

1. Top section = Result
    1. Result Image Card
    2. Result Explanation (2-3 sentences of why you matched, references real titles/dates)
2. Share with a friend section
    1. Share results with a friend
    2. Copies custom share text (e.g. “Sarah is a {personality} Strava poster! She ‘short explanation’. What are you?? Take the test now to find out!”)

**Tech Stack**

- **Frontend**
    - **Framework**: [Next.js](https://nextjs.org/) with Typescript
    - **Styling:** [TailwindCSS](https://tailwindcss.com/)
    - **UI component library:** [Shadcn](https://ui.shadcn.com/)
    - **Animations library:** [Framer motion](https://www.framer.com/)
- **Hosting / Deployment:** [Vercel](https://vercel.com/)
- **Backend Database (serverless):** [Supabase](https://supabase.com/) (for creating a new row in strava_personality_test tables each time someone signs up that includes their result and time they took test)
- **Analytics:** [OpenPanel](https://openpanel.dev/)

**Next.js information**

- app router
- shared main app layout using layouts.tsx

**How It Works**

- After clicking get CTA button, user grants permission for app to read user’s posts data (through OAuth 2.0, you can request the activity:read scope, which gives you access to their activities, including the titles.)
- Extract titles from last 100 posts (use GET /api/v3/athlete/activities endpoint -> endpoint returns an array of activities, including name field (which is the title))
- CAll OpenAI API to analyze titles using instructions/context on task-> return results in the results page
- Results:
    - 1. Strava personality match
    - 2. Explanation (2-3 sentences of why you matched, referencing real titles you posted)

**Design**

- **Style:** clean, sleek, minimalistic, uncluttered, and modern style with neutral colors (using shadcn zinc) and ample white space. occasionally uses sharp, crisp animations to keep visitors engaged, adding a “wow” effect.
- **Color Scheme:**
    - primary color = bright orange (like Strava color)
    - primary base = white
    - base content = shade of black-ish
    - base = white