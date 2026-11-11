"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getContact } from "@/lib/data";
import { Mail, Copy, Check } from "lucide-react";
import { useNotification } from "@/components/ui";

// The address is kept base64-encoded in the source so scrapers don't harvest
// it; it's only decoded in the browser when a visitor asks to see it.
const ENCODED_EMAIL = "YWRpbC1ibG9nLmRpc2FycmF5OTg2QHBhc3NtYWlsLm5ldAo=";
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-";
const PLACEHOLDER = "Reveal & copy email";

function decodeEmail(): string {
  try {
    // .trim() drops the trailing newline baked into the encoded value
    return atob(ENCODED_EMAIL).trim();
  } catch {
    return "";
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Reveals `target` with a left-to-right "decrypting" scramble once `active`
 * becomes true, calling `onDone` a single time when the reveal finishes.
 * Returns "" while idle so the caller can show a placeholder instead.
 */
function useScramble(target: string, active: boolean, onDone: () => void) {
  const [text, setText] = useState("");
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || !target) {
      doneRef.current = false;
      return;
    }

    doneRef.current = false;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setText(target);
      onDone();
    };

    if (prefersReducedMotion()) {
      const timer = window.setTimeout(finish, 0);
      return () => window.clearTimeout(timer);
    }

    const duration = 700;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const out = target
        .split("")
        .map((ch, i) => {
          const local = progress * target.length - i; // wave position at char i
          if (local >= 1) return ch; // locked in
          if (local > 0)
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          return " "; // not yet reached — keep width stable
        })
        .join("");
      setText(out);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, onDone]);

  return text;
}

export function Contact() {
  const contact = getContact();
  const email = decodeEmail();
  const { notify } = useNotification();

  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      notify("Email copied to clipboard");
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify("Failed to copy email", "error");
    }
  }, [email, notify]);

  const scrambled = useScramble(email, revealed, copy);

  useEffect(
    () => () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    },
    []
  );

  const handleClick = () => {
    if (!revealed) setRevealed(true); // first click: reveal (auto-copies on finish)
    else copy(); // afterwards: copy again
  };

  const hint = !revealed
    ? "Click to reveal & copy my email"
    : copied
      ? "Copied to clipboard"
      : "Click again to copy";

  return (
    <section className="bg-foreground py-20 text-background sm:py-28" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <h2 id="contact-heading" className="text-balance font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Get in touch
          </h2>
          <div className="min-w-0">
            <p className="mb-8 max-w-md text-xl leading-relaxed">
              {contact.availability.message}
            </p>
            <button
              type="button"
              onClick={handleClick}
              aria-label={revealed ? "Copy email address" : "Reveal and copy email address"}
              className="group flex w-full items-center gap-4 bg-background px-5 py-5 text-foreground transition-colors hover:bg-background/90 focus-visible:outline-background focus-visible:outline-offset-4 sm:px-6"
            >
              <Mail aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
              <span className="min-w-0 flex-1 break-all text-left text-base sm:text-lg">
                {revealed ? scrambled : PLACEHOLDER}
              </span>
              {revealed && (
                <span className="flex-shrink-0">
                  {copied ? (
                    <Check aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Copy aria-hidden="true" className="h-4 w-4" />
                  )}
                </span>
              )}
            </button>
            <p className="mt-4 text-sm text-background/75" aria-live="polite">
              {hint}
            </p>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 text-sm leading-relaxed">
              <div>
                <dt className="text-background/75">Response time</dt>
                <dd className="mt-1">{contact.availability.responseTime}</dd>
              </div>
              <div>
                <dt className="text-background/75">Working hours</dt>
                <dd className="mt-1">{contact.workingHours.hours} ({contact.workingHours.timezone})</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
