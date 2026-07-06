"use client";

import { getProfile } from "@/lib/data";
import { FadeIn } from "@/components/ui";

export function Hero() {
  const profile = getProfile();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <FadeIn delay={150} className="order-first lg:order-last">
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="Adil Alizada Logo"
            width={320}
            height={320}
            className="w-44 sm:w-56 lg:w-2/3 max-w-[420px] h-auto"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0}>
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-4">
            {profile.title.split("@")[0].trim()}
          </h1>
          <p className="font-serif italic text-secondary text-lg max-w-2xl mx-auto lg:mx-0">
            {profile.bio}
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
