
# Initial Product Description
**What**: a viral website that finds your Strava Athlete personality type based off your workout post titles

**Why**: because (1) people use Strava post titles to tell their story day-by-day and (2) people love being analyzed and (3) sharing fun results with friends

**Domain**: athletepersonalitytest.com

**Name**: Athlete Personality Test

- A Personality Test Powered by Strava
- Implies depth and structure. Suggests a deeper analysis of traits. People love personality quizzes that claim deeper insight into who they “really are” (aligns strongly with the Barnum effect). Could heighten user investment.

**Slogan**: Discover Your Unique Athlete Personality — Powered by Strava  

**Description**: Analyze your Strava activity titles to discover your Athlete Personality.

**Logo**: AP in bright cartoonish mark, with a genie overlayed on top

**Important - Mobile First**: Because most users will be on mobile devices, the design should be optimized for mobile devices.

---

**Design & Aesthetic**

The goal is to preserve the existing clean, minimal foundation while adding lively, playful touches and optimizing for mobile devices:

1. **Typography:**
    - Keep a clean body font for readability.
    - Use a balloon-like or bubble-letter style for headlines to instantly communicate a fun vibe.
    - Consider a secondary playful font for subheadings to maintain a layered look.
2. **Color Scheme:**
    - Continue to leverage orange (in a shade similar to Strava’s) as an accent or CTA color.
    - Introduce a second bright accent color (Purple) that pairs well with orange to add more vibrancy.
    - Retain white and neutral grays for backgrounds to keep the interface uncluttered and highlight the playful elements.
3. **Animations and Interactivity:**
    - Incorporate “jiggly” transitions on buttons or headings.
    - Use subtle “bounce” effects when new content loads, evoking movement and energy.
    - Illustrate “running” or “biking” silhouettes that morph or slide in to reinforce the sense of motion.
4. **Layout and Imagery:**
    - Maintain generous white space to retain a modern look.
    - Add playful vector illustrations or icons symbolizing various sports or emotional states (moods).
    - Highlight user-generated content (titles) in dynamic frames or speech bubbles that pop or expand on hover.

---

**Pages**:

[stravapersonalitytest.com](http://stravapersonalitytest.com)/ → homepage with main headline, call to action, and details on what the tool is

1. Attention grabbing hero section
    1. Headline, Sub-headline, and Slogan with imagery and animations so that user knows exactly what the product does and is excited
2. Call to action area
    1. A main button that triggers the OAuth flow (using puslating-button)
    2. “Credibility / Urge to get in before missing out” with number of people who have already taken the test (using avatar-circles)
        1. the number should be auto-populated by counting the number of rows in the strava-personality-test table in Supabase using Supabase realtime API
3. Personality Types section
    1. Images (public/images/personalities/) will be made for each personality type and displayed using focus-cards.tsx
    2. 6 personalities - descriptions
        
        {
            title: "Motivator",
            description: "Hypes others with motivational quotes and good vibes.",
            example: "Nothing worth having comes easy 💪 #noexcuses #blessed",
          },
          {
            title: "Data Enthusiast",
            description: "Every title includes precise stats, conditions, and metrics.",
            example: "10K @ 6:45/mi | 68°F | Z3 HR Avg 155 bpm",
          },
          {
            title: "Glory Chaser",
            description: "Chases PRs, podiums, and leaderboard domination with grit.",
            example: "Half marathon PR—1:27:30! 🎉🔥",
          },
          {
            title: "Storyteller",
            description: "Turns every workout into a reflective and poetic story.",
            example: "Through misty trails, I found clarity in every step.",
          },
          {
            title: "Essentialist",
            description: "Doesn’t change the default titles. No frills, no fuss.",
            example: "Morning Run",
          },
          {
            title: "Comedian",
            description: "Crafts witty puns and jokes to entertain and lighten the mood.",
            example: "I’m wheely tired, but I’ll pedal through.",
          }
        
4. iPhone mockup of Strava app to make it real
    1. sources image from public/images/iPhone (component is /ui/iphone-15-pro)
    2. with promotional text text eliciting emotion
5. Bottom hero section
    1. Share with a friend button (copy URL to clipboard on desktop or initiate share on mobile touch screens)
    2. ‘Take the test now’ button
6. Footer section
    1. link in bottom left that says ‘Made by Declan’ {Declan links to www.declankramper.com)

[athletepersonalitytest.com/analyze](http://athletepersonalitytest.com/analyze) → analysis page as the results are being loaded

- shows progress bar with fun animation

[athletepersonalitytest.com/result](http://athletepersonalitytest.com/result) → results page that returns the user’s test results

1. Top section = Result
    1. Result Title (name of personality) - Centered
    2. Result Image Card (from public/image/personalities/) - below title
    3. Result Explanation (2-3 sentences of why you matched, references real titles/dates) - below card
    4. Summary Statistic - to the right of the result card
2. Below result section = Share with a friend section
    1. Button: ‘Share your results with a friend so they can get their result too’
3. Button to create your Personalized Athlete Character (behind Stripe paywall)

**NEW SECTION - BEHIND STRIPE PAYWALL:**

[athletepersonalitytest.com/personalized-character](http://athletepersonalitytest.com/personalized-character) → results page for the Strava Athlete Character

Strava Character - Create Your Personalized Athlete Character, powered by Strava

- pay to get your character - 1.69$
- Explanation of why you gotta pay (so i can afford costs)
- generate custom image for their character
- explanation of how it personalizes/makes your character
- don’t advertise the strava character anywhere (user shouldn’t know it’s a separate feature nor that you have to pay for something at any point) → don’t want it seeming like a money grab + it’d be cool to have a unexpected feature
    - include image of my character on homepage (but don’t call it anything)

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
- Free Results:
    - 1. Strava personality match
    - 2. Explanation (2-3 sentences of why you matched, referencing real titles you posted)

**Strava Brand Guidelines to comply with:**

- product name without Strava (Athlete Personality Test *powered by Strava)*
- remove Strava logo from images: favicon, logo, apple touch icon
- webmanifest, /layout metadata
- ‘connect with strava’ button for authorization
- when referencing interoperability with Strava, must mention “Powered by Strava”
- “Powered by Strava” logo on website
- add “View on Strava” to referenced titles

