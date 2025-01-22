"use client";

import HeroV1 from "@/components/sections/Hero-v1";
import Personalities from "@/components/sections/Personalities";
import Demo from "@/components/sections/Demo";
import FinalCall from "@/components/sections/FinalCall";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <HeroV1 />
      <Demo />
      <Personalities />
      <FinalCall />
    </div>
  );
}