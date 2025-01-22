"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const bubbleTextStyle = {
    textShadow: "0px 2px 0px #8B5CF6",
    WebkitTextStroke: "1.25px #8B5CF6",
    backgroundColor: "#F59E0B",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
} as const;

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen py-20 px-4">
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.push('/')}
                className="fixed top-8 left-8 flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors focus:outline-none"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </motion.button>

            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-8"
                        style={bubbleTextStyle}
                    >
                        About
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose dark:prose-invert max-w-none space-y-6"
                >
                    <p className="text-lg">Hello! Thank you for checking out the Athlete Personality Test app.</p>
                    <p className="text-lg">
                        My name is{" "}
                        <Link
                            href="https://www.declankramper.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600 no-underline"
                        >
                            Declan Kramper
                        </Link>
                        .
                    </p>

                    <h2 className="text-xl font-semibold mt-4">What sparked the idea to build this app?</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                        <li>I love running, thinking and Strava</li>
                        <li>Strava recently ran a campaign to increase usage of custom titles on posts</li>
                        <li>I use my titles to cement/memorize each run based on the main thought I had during that run</li>
                    </ul>
                    <h2 className="text-xl font-semibold mt-4">So I thought, what do all my running thoughts say about me?</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        This app is a product of my love for running, curiosity about self-discovery, and the social spirit of Strava. Hopefully you find it fun and enjoy using it, too!
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        If you did, or if you have any other thoughts and want to get in touch, I'd love to hear from you:{" "}
                        <a
                            href="mailto:hello@dkbuilds.co"
                            className="text-orange-500 hover:text-orange-600 no-underline"
                        >
                            hello@dkbuilds.co
                        </a>
                    </p>
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300">
                            Check out my{" "}
                            <Link
                                href="https://www.declankramper.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-600 no-underline"
                            >
                                portfolio
                            </Link>{" "}
                            for other work or{" "}
                            <Link
                                href="https://www.dkbuilds.co"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-600 no-underline"
                            >
                                business page
                            </Link>{" "}
                            for other products.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
