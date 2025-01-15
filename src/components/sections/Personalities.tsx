// src/components/sections/Personalities.tsx

"use client";

import { FocusCards } from "@/components/ui/focus-cards";

// Define personality types and their descriptions
const personalityTypes = [
  {
    title: "The Motivator",
    src: "/images/personalities/motivator.webp",
    description: "Always includes inspirational quotes or messaging.",
    example: "Nothing worth having comes easy 💪 #grateful"
  },
  {
    title: "The Data Nerd",
    src: "/images/personalities/data-nerd.webp",
    description: "Every title includes precise stats, conditions, and metrics.",
    example: "6.2mi @ 7:45/mi, 72°F, 65% humidity, Z2 training"
  },
  {
    title: "The Storyteller",
    src: "/images/personalities/storyteller.webp",
    description: "Creates a narrative with each run.",
    example: "That time I chased a squirrel and found a secret trail"
  },
  {
    title: "The Minimalist",
    src: "/images/personalities/minimalist.webp",
    description: "Uses single words or keeps it purely functional.",
    example: "Morning Run"
  },
  {
    title: "The Humorist",
    src: "/images/personalities/humorist.webp",
    description: "Consistently crafts witty, punny titles.",
    example: "Running late (literally)"
  },
  {
    title: "The Poet",
    src: "/images/personalities/poet.webp",
    description: "Writes deeply philosophical titles reflecting on life's journey through running.",
    example: "Dancing with dawn's first light, finding myself mile by mile"
  }
];

export default function Personalities() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-24">
          Personality Types
        </h2>
        <FocusCards cards={personalityTypes} />
      </div>
    </section>
  );
}