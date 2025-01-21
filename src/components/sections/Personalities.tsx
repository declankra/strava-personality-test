"use client";

import { FocusCards } from "@/components/ui/focus-cards";

// Define personality types and their descriptions
const personalityTypes = [
  {
    title: "Motivator",
    src: "/images/personalities/motivator.webp",
    description: "Hypes others with motivational quotes and good vibes.",
    example: "Nothing worth having comes easy 💪 #noexcuses #blessed"
  },
  {
    title: "Data Enthusiast",
    src: "/images/personalities/data-enthusiast.webp",
    description: "Every title includes precise stats, conditions, and metrics.",
    example: "10K @ 6:45/mi | 68°F | Z3 HR Avg 155 bpm"
  },
  {
    title: "Glory Chaser",
    src: "/images/personalities/glory-chaser.webp",
    description: "Chases PRs, podiums, and leaderboard domination with grit.",
    example: "Half marathon PR—1:27:30! 🎉🔥"
  },
  {
    title: "Storyteller",
    src: "/images/personalities/storyteller.webp",
    description: "Turns every workout into a reflective and poetic story.",
    example: "Through misty trails, I found clarity in every step."
  },
  {
    title: "Essentialist",
    src: "/images/personalities/essentialist.webp",
    description: "Doesn't change the default titles. No frills, no fuss.",
    example: "Morning Run"
  },
  {
    title: "Comedian",
    src: "/images/personalities/comedian.webp",
    description: "Crafts witty puns and jokes to entertain and lighten the mood.",
    example: "I'm wheely tired, but I'll pedal through."
  }
];

// Bubble text style matching Hero-v1
const bubbleTextStyle = {
  textShadow: "2px 2px 0px #8B5CF6",
  WebkitTextStroke: "2px #8B5CF6",
  backgroundImage: "linear-gradient(45deg, #8B5CF6, #F59E0B)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

export default function Personalities() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          {/* Category label */}
          <span className="text-orange-500 font-bold tracking-widest text-sm block mb-4">
            PERSONALITY TYPES
          </span>
          
          {/* Main headline with bubble text style */}
          <h2 
            className="text-5xl md:text-6xl font-bold"
            style={bubbleTextStyle}
          >
            Which Type Are You?
          </h2>
        </div>
        
        <FocusCards cards={personalityTypes} />
      </div>
    </section>
  );
}