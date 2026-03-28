"use client";

import { getProfile, getContact } from "@/lib/data";
import { Mail } from "lucide-react";
import { FadeIn } from "@/components/ui";

export function Contact() {
  const profile = getProfile();
  const contact = getContact();

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <FadeIn>
            <span className="text-xs uppercase tracking-wider text-accent font-sans mb-8 block">
              Contact
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h2 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
              Get in touch
            </h2>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-secondary text-lg leading-relaxed mb-8">
              {contact.availability.message}
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-3 bg-card border border-muted-border px-8 py-4 text-foreground hover:border-accent/50 hover:text-accent transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 text-accent" />
              <span className="font-serif text-lg">{profile.email}</span>
            </a>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="mt-6 text-xs text-secondary">
              Response time: {contact.availability.responseTime} ·{" "}
              {contact.workingHours.hours} ({contact.workingHours.timezone})
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
