"use client";

import { FadeIn } from "@/components/ui";

export function ExperienceHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <FadeIn>
        <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-4">
          Building with{" "}
          <span className="italic text-accent">Purpose.</span>
        </h1>
      </FadeIn>
      <FadeIn delay={100}>
        <p className="font-serif italic text-secondary text-lg max-w-2xl">
          A timeline of roles, responsibilities, and the technologies that shaped my journey as an engineer.
        </p>
      </FadeIn>
    </section>
  );
}
