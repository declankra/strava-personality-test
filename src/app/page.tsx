"use client";

import HeroV1 from "@/components/sections/Hero-v1";
import Personalities from "@/components/sections/Personalities";
import Demo from "@/components/sections/Demo";
import FinalCall from "@/components/sections/FinalCall";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Strava Rejection Banner */}
      <div className="bg-red-600 border-2 border-red-400 shadow-lg shadow-red-500/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
        <div className="relative z-10 px-4 py-3 text-center">
          <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
            ⚠️ Unfortunately, Strava has denied this fun app{" "}
            <a
              href="https://x.com/dkbuildsco/status/1933867260981944768"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-red-200 transition-colors font-extrabold"
            >
              without clear reason
            </a>
            . You can{" "}
            <a 
              href="https://www.loom.com/share/203fc26c1d5e407bb5a43ad64fbefae0?sid=7d7b2db6-4d7c-4adc-bc83-9ff44aca0a1c"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-red-200 transition-colors font-extrabold"
            >
              view the demo here
            </a>
            {" "}to see how it works ⚠️
          </p>
        </div>
      </div>
      
      <HeroV1 />
      <Demo />
      <Personalities />
      <FinalCall />
    </div>
  );
}