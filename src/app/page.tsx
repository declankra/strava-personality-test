"use client";

import Hero from "@/components/sections/Hero";
import Personalities from "@/components/sections/Personalities";
import Demo from "@/components/sections/Demo";
import FinalCall from "@/components/sections/FinalCall";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Hero />
      <Personalities />
      <Demo />
      <FinalCall />
    </div>
  );
}