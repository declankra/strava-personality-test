// src/components/ui/written-feedback.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { getSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useOpenPanel } from '@openpanel/nextjs';

interface WrittenFeedbackProps {
  sessionId: string;
}

export default function WrittenFeedback({ sessionId }: WrittenFeedbackProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const op = useOpenPanel();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      op.track('feedback_popup_opened', {
        session_id: sessionId,
        location: 'character_result'
      });
    }
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter some feedback first!");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('strava_personality_test')
        .update({ paid_user_feedback: feedback })
        .eq('session_id', sessionId);

      if (error) throw error;

      // Track successful feedback submission
      op.track('feedback_submitted', {
        session_id: sessionId,
        location: 'character_result',
        feedback_length: feedback.length
      });

      toast.success("Thanks for your feedback!");
      setIsOpen(false);
      setFeedback("");
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to submit feedback. Please try again.");
      
      // Track submission error
      op.track('feedback_submission_error', {
        session_id: sessionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 flex justify-center">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950"
          >
            What'd you think?
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[280px] sm:w-[320px]"
          align="center"
          sideOffset={8}
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-center">
              Share your thoughts! ❤️
            </h3>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="I think..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="outline"
                className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white dark:hover:bg-orange-950"
              >
                {isSubmitting ? "Sending..." : "Send thoughts"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}