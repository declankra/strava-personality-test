import React, { useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// Define emoji feedback options with their corresponding database values
const EMOJI_OPTIONS = [
  { emoji: "😍", value: "love", label: "Love it!" },
  { emoji: "🤷", value: "unsure", label: "Not sure" },
  { emoji: "💩", value: "hate", label: "Hate it" },
] as const;

type Rating = typeof EMOJI_OPTIONS[number]["value"];

interface EmojiFeedbackProps {
  personalityType: string;
  sessionId: string;  // This will be a UUID string
}

// UUID validation regex pattern
const UUID_PATTERN = 
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function EmojiFeedback({ personalityType, sessionId }: EmojiFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);

  const isValidUUID = (uuid: string): boolean => {
    return UUID_PATTERN.test(uuid);
  };

  const triggerEmojiConfetti = (emoji: string) => {
    const scalar = 2;
    const emojiShape = confetti.shapeFromText({ text: emoji, scalar });
    
    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [emojiShape],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });
      confetti({
        ...defaults,
        particleCount: 5,
      });
      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };

    // Shoot confetti in sequence
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  const handleFeedback = async (feedbackValue: Rating, emoji: string) => {
    if (submitted) return;

    // Validate UUID before proceeding
    if (!isValidUUID(sessionId)) {
      console.error('Invalid session ID format');
      toast.error("Something went wrong. Please try again later.", {
        duration: 3000,
      });
      return;
    }

    try {
      const supabase = getSupabase();
      
      // Insert feedback into database
      const { error } = await supabase
        .from('strava_personality_ratings')
        .insert({
          session_id: sessionId, // UUID will be properly handled by Supabase
          personality_type: personalityType,
          rating: feedbackValue,
          created_at: new Date().toISOString()
        });

      if (error) {
        // Handle specific Supabase errors
        if (error.code === '23505') { // Unique violation
          toast.error("You've already provided feedback!", {
            duration: 3000,
          });
          setSubmitted(true);
          return;
        }
        throw error;
      }

      // Show success message
      toast.success("Thank you for your feedback!", {
        duration: 3000,
        className: "bg-orange-500 text-white",
      });

      // Trigger confetti with selected emoji
      triggerEmojiConfetti(emoji);
      
      // Disable further submissions
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Couldn't submit feedback. Please try again.", {
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full text-center space-y-6 pb-20">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        What do you think of your results?
      </h3>
      
      <div className="flex justify-center gap-4">
        {EMOJI_OPTIONS.map(({ emoji, value, label }) => (
          <Button
            key={value}
            onClick={() => handleFeedback(value, emoji)}
            disabled={submitted}
            variant="ghost"
            className={`flex flex-col items-center p-4 hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors
              ${submitted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
          >
            <span className="text-4xl mb-2">{emoji}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}