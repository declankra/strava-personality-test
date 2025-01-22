// src/app/terms/page.tsx
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

export default function TermsPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen py-20 px-4">
      {/* Back button - positioned absolutely */}
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
            Terms & Privacy Policy
          </h1>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Terms of Use */}
          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Terms of Use</h2>
            <p>
              Athlete Personality Test ("we", "our", or "us") is an unofficial application that uses the Strava API to analyze your activity titles and determine your athlete personality type. By using our service, you agree to these terms and conditions.
            </p>
            <p>
              This application is not affiliated with, endorsed, or sponsored by Strava. All Strava-related trademarks and copyrights are property of Strava Inc.
            </p>
          </section>

          {/* Data & Privacy */}
          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Data & Privacy</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">Data Collection</h3>
            <p>When you use Athlete Personality Test, we collect:</p>
            <ul>
              <li>Your Strava activity titles (last 100 activities)</li>
              <li>Basic profile information (name, Strava profile picture)</li>
              <li>Your personality test results</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Data Usage</h3>
            <p>We use your data to:</p>
            <ul>
              <li>Analyze your activity titles to determine your personality type</li>
              <li>Display your results</li>
              <li>Show you in the "recently tested" section (profile picture only)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Data Storage & Retention</h3>
            <p>
              We store your personality test results and basic profile information in our secure database. We do not store your activity titles after analysis. You can request deletion of your data at any time by contacting us.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Your Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw your consent at any time</li>
            </ul>
          </section>

          {/* Strava API Compliance */}
          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Strava API Compliance</h2>
            <p>
              This application is powered by Strava™ and complies with the{" "}
              <Link 
                href="https://www.strava.com/legal/api" 
                className="text-orange-500 hover:text-orange-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Strava API Agreement
              </Link>
              . When you connect with Strava, you grant us permission to:
            </p>
            <ul>
              <li>Read your activity data</li>
              <li>Access your profile information</li>
            </ul>
            <p>
              We do not modify or delete any of your Strava data. You can revoke access at any time through your{" "}
              <Link 
                href="https://www.strava.com/settings/apps" 
                className="text-orange-500 hover:text-orange-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Strava settings
              </Link>
              .
            </p>
          </section>

          {/* Contact Information */}
          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Contact Information</h2>
            <p>
              For questions about these terms or to request data deletion, please contact:{" "}
              <Link 
                href="mailto:business@dkbuilds.co" 
                className="text-orange-500 hover:text-orange-600"
              >
                business@dkbuilds.co
              </Link>
            </p>
            <p>
              For more information about dkBuilds:{" "}
              <Link 
                href="https://www.dkbuilds.co" 
                className="text-orange-500 hover:text-orange-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                dkbuilds.co
              </Link>
            </p>
          </section>

          {/* Last Updated */}
          <section className="text-sm text-gray-600 dark:text-gray-400">
            <p>Last updated: January 21, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}