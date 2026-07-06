"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { getProfile } from "@/lib/data";

const TYPED_PHRASES = [
  "stable software",
  "clean APIs",
  "honest software",
];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reads the current theme's accent/foreground as rgb triples so the canvas
 * tracks light/dark. Re-sampled whenever the `dark` class on <html> toggles.
 */
function useThemeColors() {
  const [colors, setColors] = useState({ accent: "212, 84, 58", fg: "26, 26, 24" });

  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      const toRgb = (hex: string, fallback: string) => {
        const h = hex.trim().replace("#", "");
        if (h.length !== 6) return fallback;
        const n = parseInt(h, 16);
        return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
      };
      setColors({
        accent: toRgb(styles.getPropertyValue("--accent"), "212, 84, 58"),
        fg: toRgb(styles.getPropertyValue("--foreground"), "26, 26, 24"),
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

function DotGrid({ accent, fg }: { accent: string; fg: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef({ accent, fg });

  useEffect(() => {
    colorsRef.current = { accent, fg };
  }, [accent, fg]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const SPACING = 34;
    const INFLUENCE = 150;
    const WAVE_SPEED = 340; // px/s the ring expands
    const WAVE_SIGMA = 46; // ring thickness
    const WAVE_LIFE = 1.7; // seconds until a ripple fades out
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999 };
    const ripples: { x: number; y: number; start: number }[] = [];
    let raf = 0;
    let start = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // only ripple from clicks that land over the hero canvas
      if (x < 0 || y < 0 || x > width || y > height) return;
      // performance.now() shares rAF's time origin; event.timeStamp may not
      ripples.push({ x, y, start: performance.now() });
      if (ripples.length > 6) ripples.shift(); // cap concurrent waves
    };

    const draw = (t: number) => {
      if (!start) start = t;
      const time = (t - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      const { accent: a, fg: f } = colorsRef.current;
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      // drop expired ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        if ((t - ripples[r].start) / 1000 > WAVE_LIFE) ripples.splice(r, 1);
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * SPACING;
          const baseY = j * SPACING;
          // gentle ambient drift
          const drift = Math.sin(time * 0.6 + (i + j) * 0.35) * 1.2;
          let x = baseX + drift;
          let y = baseY + Math.cos(time * 0.5 + i * 0.3) * 1.2;

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - dist / INFLUENCE);

          // expanding click waves: strongest at the ring, decaying over life
          let wave = 0;
          let waveNx = 0;
          let waveNy = 0;
          for (let r = 0; r < ripples.length; r++) {
            const rp = ripples[r];
            const elapsed = Math.max(0, (t - rp.start) / 1000);
            const ring = WAVE_SPEED * elapsed;
            const wdx = x - rp.x;
            const wdy = y - rp.y;
            const wd = Math.hypot(wdx, wdy);
            const band = wd - ring;
            const amp = Math.max(0, 1 - elapsed / WAVE_LIFE);
            const w =
              Math.exp(-(band * band) / (2 * WAVE_SIGMA * WAVE_SIGMA)) * amp;
            if (w > wave) {
              wave = w;
              if (wd > 0.001) {
                waveNx = wdx / wd;
                waveNy = wdy / wd;
              }
            }
          }

          // push the dot outward along the wavefront for a pulsating feel
          x += waveNx * wave * 7;
          y += waveNy * wave * 7;

          const energy = Math.min(1, influence + wave);
          const radius = 0.9 + energy * 2.4;
          if (energy > 0.02) {
            const alpha = 0.12 + energy * 0.78;
            ctx.fillStyle = `rgba(${a}, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(${f}, 0.09)`;
          }
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          // constellation lines to the right/below neighbour when energised
          if (energy > 0.25) {
            ctx.strokeStyle = `rgba(${a}, ${energy * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(baseX + SPACING, baseY);
            ctx.stroke();
          }
        }
      }

      // faint expanding outline for each active ripple
      for (let r = 0; r < ripples.length; r++) {
        const rp = ripples[r];
        const elapsed = Math.max(0, (t - rp.start) / 1000);
        const ring = Math.max(0, WAVE_SPEED * elapsed);
        const amp = Math.max(0, 1 - elapsed / WAVE_LIFE);
        ctx.strokeStyle = `rgba(${a}, ${amp * 0.22})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, ring, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/**
 * Types out `prefix + phrase` from empty on load, then cycles phrases by
 * deleting back down to `prefix` (so the prefix stays put) and typing the next.
 */
function useTypewriter(prefix: string, phrases: string[]) {
  const [text, setText] = useState("");

  useEffect(() => {
    let timeout: number;
    if (prefersReducedMotion()) {
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

    // brief pause so the cursor blinks once before typing begins on load
    timeout = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timeout);
  }, [prefix, phrases]);

  return text;
}

export function MotionHero() {
  const profile = getProfile();
  const { accent, fg } = useThemeColors();
  const typed = useTypewriter("building ", TYPED_PHRASES);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      <DotGrid accent={accent} fg={fg} />

      {/* fade the grid into the next section and keep text legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-accent animate-[fadeIn_0.6s_ease-out]">
            {"// "}
            {profile.title.split("@")[1]?.trim()
              ? `Backend Engineer @ ${profile.title.split("@")[1].trim()}`
              : "Backend Engineer"}
          </p>

          <h1 className="font-serif text-5xl font-bold leading-[1.05] text-foreground sm:text-7xl lg:text-8xl">
            {profile.name}
          </h1>

          <p className="mt-6 font-mono text-lg text-secondary sm:text-2xl">
            <span className="text-accent">&gt;</span>{" "}
            <span className="text-foreground">{typed}</span>
            <span aria-hidden="true" className="terminal-cursor" />
          </p>

          <p className="mt-8 max-w-xl text-secondary leading-relaxed">
            Software built with stability in mind
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm uppercase tracking-wider text-accent-foreground transition-transform duration-300 hover:scale-[1.02]"
            >
              View Work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm uppercase tracking-wider text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="hidden justify-end lg:flex">
          <img
            src="/logo.png"
            alt="Adil Alizada Logo"
            width={420}
            height={420}
            className="h-auto w-full max-w-[360px] animate-[fadeIn_0.8s_ease-out]"
          />
        </div>
      </div>

      <a
        href="#current-work"
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-secondary transition-colors hover:text-accent"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
