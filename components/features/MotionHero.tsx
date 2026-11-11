"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { getProfile } from "@/lib/data";

const TYPED_PHRASES = ["stable software", "clean APIs", "honest software"];

function useTypewriter(prefix: string, phrases: string[]) {
  const [text, setText] = useState("");

  useEffect(() => {
    let timeout: number;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeout = window.setTimeout(() => setText(prefix + phrases[0]), 0);
      return () => window.clearTimeout(timeout);
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const full = prefix + phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      setText(full.slice(0, charIndex));

      let delay = deleting ? 40 : 75;
      if (!deleting && charIndex >= full.length) {
        delay = 1600;
        deleting = true;
      } else if (deleting && charIndex <= prefix.length) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      }
      timeout = window.setTimeout(tick, delay);
    };

    timeout = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timeout);
  }, [prefix, phrases]);

  return text;
}

export function MotionHero() {
  const profile = getProfile();
  const typed = useTypewriter("building ", TYPED_PHRASES);

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-16">
        <div className="text-center md:text-left">
          <h1 className="font-serif text-5xl font-bold leading-[1.05] text-foreground sm:text-7xl lg:text-8xl">
            {profile.name}
          </h1>
          <p className="mt-6 font-mono text-base text-secondary min-[375px]:text-lg sm:text-2xl">
            <span className="sr-only">Building stable software, clean APIs, and honest software.</span>
            <span aria-hidden="true">
              <span className="text-accent">&gt;</span>{" "}
              <span className="text-foreground">{typed}</span>
              <span className="terminal-cursor" />
            </span>
          </p>
        </div>
        <div className="hidden justify-end lg:flex">
          <Image
            src="/logo.png"
            alt="Adil Alizada Logo"
            width={641}
            height={565}
            sizes="360px"
            className="h-auto w-full max-w-[360px] animate-[fadeIn_0.8s_ease-out]"
          />
        </div>
      </div>
      <a
        href="#current-work"
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center text-secondary transition-colors hover:text-accent"
      >
        <ArrowDown aria-hidden="true" className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
