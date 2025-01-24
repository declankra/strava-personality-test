// src/app/character/result/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function CharacterResultPage() {
  const router = useRouter();
  const [imageData, setImageData] = useState<string | null>(null);


  useEffect(() => {
    // Try to get image data from session storage
    const storedImage = sessionStorage.getItem('character_image');
    
    if (!storedImage) {
      router.push('/error?message=no_character_found');
      return;
    }

    setImageData(storedImage);

    // Celebration effect
    const end = Date.now() + 2 * 1000;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 }
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Only clear storage when user navigates away
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('character_image');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router]);

  if (!imageData) {
    return null; // Show nothing while loading
  }


  const handleDownload = () => {
    try {
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = imageData!;
      link.download = 'my-athlete-character.webp';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Athlete Character',
          text: 'Check out my personalized Athlete Character!',
        });
      } else {
        // Fallback to copying image to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  if (!imageData) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Athlete Character is Ready! 
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Here's your unique, AI-generated character based on your athlete personality
          </p>
        </motion.div>

        {/* Character Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative aspect-square max-w-xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl"
        >
          <img 
            src={imageData}
            alt="Your Athlete Character"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={handleDownload}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            Download Character
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-sm text-gray-500"
        >
          Perfect for your Strava profile picture! 🏃‍♂️
        </motion.p>
      </div>
    </div>
  );
}