"use client";

import { getProfile } from "@/lib/data";
import { FadeIn } from "@/components/ui";

export function Hero() {
  const profile = getProfile();

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <FadeIn delay={0}>
        <div>
          <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-4">
            {profile.title.split("@")[0].trim()}
          </h1>
          <p className="font-serif italic text-secondary text-lg max-w-2xl">
            {profile.bio}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="hidden lg:flex justify-center">
          <img
            src="/logo.png"
            alt="Adil Alizada Logo"
            className="w-full max-w-[420px] h-auto"
          />
        </div>
      </FadeIn>
    </section>
  );
}
