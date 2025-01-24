// src/app/contributions/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Bubble text style matching other pages
const bubbleTextStyle = {
  textShadow: "0px 2px 0px #8B5CF6",
  WebkitTextStroke: "1.25px #8B5CF6",
  backgroundColor: "#F59E0B",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

// Contributors data
const contributors = [
  {
    name: "Erik",
    role: "SWE God",
    contribution: "Fine-tuned the LLM prompt to better articulate the personality type explanation and improved personality matching accuracy.",
    stravaProfile: "https://www.strava.com/athletes/140214409",
  },
  {
    name: "Will",
    role: "Marketing Wizard",
    contribution: "Delivered feedback that was the guiding force for the UX/UI and design of the site.",
    stravaProfile: "https://www.strava.com/athletes/117864711",
  },
  {
    name: "Jack",
    role: "Mr. Get Yo Bag Up",
    contribution: "Responsible for the paid feature - 'Athlete Characters'.",
    stravaProfile: "https://www.strava.com/athletes/120600523",
  },
  {
    name: "Dan",
    role: "$NBIS",
    contribution: "Introduced Nebius AI Studio's text-to-image model which powers the Athlete Character feature with high quality, cost-effective image generation.",
    stravaProfile: "https://www.strava.com/athletes/2862666",
  },
  {
    name: "Katie",
    role: "Bad Ass Associate",
    contribution: "The best of the best. The silver lining keeping it real!",
    stravaProfile: "", // Empty string indicates no Strava profile link
  },
];

export default function ContributionsPage() {
    const router = useRouter();
    
    const isValidStravaUrl = (url: string) => {
      return url.startsWith('https://www.strava.com/athletes/');
    };
  
    return (
      <div className="min-h-screen py-20 px-4">
        {/* Back button - positioned absolutely relative to viewport */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="fixed top-8 left-8 flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </motion.button>
  
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 
              className="text-4xl md:text-5xl font-bold mb-8"
              style={bubbleTextStyle}
            >
              Special Thanks
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Building the Athlete Personality Test was a collaborative effort that wouldn't 
              have been possible without help from these amazing friends. Thanks for your willingness to lend your time and thoughts.
              Super grateful for your help!
            </p>
          </motion.div>
  
          {/* Contributors Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {contributors.map((contributor, index) => (
              <motion.div
                key={contributor.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-orange-500 mb-2">
                  {contributor.name}
                </h2>
                <h3 className="text-md font-bold text-gray-600 dark:text-gray-300 mb-3">
                  {contributor.role}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {contributor.contribution}
                </p>
                {isValidStravaUrl(contributor.stravaProfile) && (
                  <Link
                    href={contributor.stravaProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-2"
                  >
                    View on Strava
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }