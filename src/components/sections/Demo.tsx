// app/components/sections/Demo.tsx

"use client";

import Iphone15Pro from "@/components/ui/iphone-15-pro";

export default function Demo() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-6xl font-bold mb-24">
          Who are you??
        </h2>
        <Iphone15Pro src="/images/iphone/preview.webp" />
      </div>
    </section>
  );
}