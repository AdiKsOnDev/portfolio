"use client";

import { getProfile, getContact } from "@/lib/data";
import { MapPin, Clock } from "lucide-react";
import { FadeIn } from "@/components/ui";

export function Hero() {
  const profile = getProfile();
  const contact = getContact();

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <FadeIn delay={0}>
        <div>
          <h1 className="font-serif text-6xl lg:text-7xl leading-[1.1] text-foreground mb-6">
            {profile.title.split("@")[0].trim()}
          </h1>
          <p className="font-serif italic text-lg text-secondary leading-relaxed">
            {profile.bio}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="space-y-4">
          <div className="bg-card p-6 border border-muted-border transition-all duration-300 hover:border-accent/50">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-sans mb-2">
              <MapPin className="w-4 h-4" />
              Location
            </span>
            <span className="font-serif text-lg text-foreground">
              {profile.location}
            </span>
          </div>
          <div className="bg-card p-6 border border-muted-border transition-all duration-300 hover:border-accent/50">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-sans mb-2">
              <Clock className="w-4 h-4" />
              Status
            </span>
            <span className="font-serif italic text-lg text-foreground">
              {contact.availability.message}
            </span>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
