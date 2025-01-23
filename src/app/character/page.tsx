// src/app/character/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Zap, Target, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

// Preview character images
const previewImages = [
    "/images/character/preview-1.webp",
    "/images/character/preview-2.webp",
    "/images/character/preview-3.webp",
];

export default function CharacterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const personalityType = searchParams.get("type");

    // Handle payment initiation
    const handleGetCharacter = async () => {
        setLoading(true);
        try {
            // TODO: Implement Stripe payment flow
            // const response = await fetch('/api/create-payment-intent', ...);
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-orange-500 font-bold tracking-widest text-xs md:text-sm block mb-4">
                        EXCLUSIVE FEATURE
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Your Personalized{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">
                            Athlete Character
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Get a personalized image of a character that captures your essence of an athlete,
                        powered by your Strava data
                    </p>
                </motion.div>

                {/* Preview Gallery */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-20"
                >
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        {previewImages.map((src, index) => (
                            <motion.div
                                key={index}
                                className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-xl"
                                animate={{
                                    rotate: index === 1 ? 0 : index === 0 ? -6 : 6,
                                }}
                                whileHover={{ scale: 1.05, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                            >
                                <Image
                                    src={src}
                                    alt={`Character preview ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>


                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-block bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4">
                            Get Your Character Now
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            100% Unique • Use as Profile Picture • Money-back guarantee*
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Button
                                onClick={handleGetCharacter}
                                disabled={loading}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg"
                            >
                                <Zap className="w-5 h-5 mr-2" />
                                Generate My Character · $1.69
                            </Button>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Secure payment powered by Stripe
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Disclaimer Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-6"
                >
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        *If you're dissatisfied with your character, let me know why at business@dkbuilds.co and I'll personally refund you.
                    </p>
                </motion.div>

                {/* New Back button - positioned relatively above footer */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 }}
                    onClick={() => router.back()}
                    className="relative mt-32 -mb-20 bottom-8 left-2 flex items-center gap-4 text-gray-300 hover:text-orange-600 transition-colors focus:outline-none"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-regular text-sm">Back to results</span>
                </motion.button>
            </div>
        </div>
    );
}