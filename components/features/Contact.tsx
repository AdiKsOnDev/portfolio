"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getContact } from "@/lib/data";
import { Mail } from "lucide-react";
import { FadeIn, useNotification } from "@/components/ui";

const ENCODED_EMAIL = "YWRpbC1ibG9nLm11bWJsaW5nMDYyQHBhc3NtYWlsLmNvbQ==";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.";
const PLACEHOLDER = "I am not a Scraper";

function decodeEmail(encoded: string): string {
  return atob(encoded);
}

function useDecodeAnimation(target: string, isActive: boolean, onComplete: () => void) {
  const [displayed, setDisplayed] = useState(PLACEHOLDER);
  const frameRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayed(PLACEHOLDER);
      hasCompletedRef.current = false;
      return;
    }

    hasCompletedRef.current = false;
    const duration = 800;
    const startTime = performance.now();
    const targetChars = target.split("");
    const placeholderChars = PLACEHOLDER.split("");

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const chars = [];
      for (let i = 0; i < targetChars.length; i++) {
        const charProgress = Math.min((progress * targetChars.length - i) / 2, 1);
        if (charProgress >= 0.5) {
          chars.push(targetChars[i]);
        } else if (charProgress > 0) {
          chars.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
        } else {
          const placeholderIndex = i < placeholderChars.length ? i : placeholderChars.length - 1;
          chars.push(placeholderChars[placeholderIndex] || CHARS[Math.floor(Math.random() * CHARS.length)]);
        }
      }

      setDisplayed(chars.join(""));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isActive, target, onComplete]);

  return displayed;
}

export function Contact() {
  const contact = getContact();
  const [revealed, setRevealed] = useState(false);
  const email = decodeEmail(ENCODED_EMAIL);
  const { notify } = useNotification();

  const handleComplete = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      notify("Email copied to clipboard");
    } catch {
      notify("Failed to copy email", "error");
    }
  }, [email, notify]);

  const displayText = useDecodeAnimation(email, revealed, handleComplete);

  const handleClick = () => {
    if (!revealed) {
      setRevealed(true);
    }
  };

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
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-3 bg-card border border-muted-border px-8 py-4 text-foreground hover:border-accent/50 hover:text-accent transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 text-accent" />
              <span className="font-serif text-lg font-mono">
                {displayText}
              </span>
            </button>
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
