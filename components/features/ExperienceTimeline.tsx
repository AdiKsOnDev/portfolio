"use client";

import { Award } from "lucide-react";
import { FadeIn } from "@/components/ui";
import type { Experience } from "@/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Human-readable span, e.g. "1 yr 3 mos". Present roles count up to today. */
function formatDuration(start: string, end: string | null): string {
  const [sy, sm] = start.split("-").map(Number);
  let ey: number;
  let em: number;
  if (end) {
    [ey, em] = end.split("-").map(Number);
  } else {
    const now = new Date();
    ey = now.getFullYear();
    em = now.getMonth() + 1;
  }
  const months = Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rem) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
  return parts.join(" ");
}

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  const current = experience.current;

  return (
    <FadeIn delay={index * 100}>
      <div className="relative pl-8 md:pl-0">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-muted-border md:left-[200px]" />

        {/* Timeline marker */}
        <div className="absolute left-[-5px] top-2 md:left-[195px]">
          {current ? (
            <span className="relative flex h-[11px] w-[11px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-[11px] w-[11px] rounded-full bg-accent" />
            </span>
          ) : (
            <span className="block h-[11px] w-[11px] rounded-full border-2 border-accent bg-background" />
          )}
        </div>

        <div className="md:grid md:grid-cols-[200px_1fr] md:gap-12">
          {/* Date column */}
          <div className="mb-4 md:mb-0 md:pr-12 md:text-right">
            <div className="text-xs uppercase tracking-wider text-secondary font-sans">
              {formatDate(experience.startDate)} — {formatDate(experience.endDate)}
            </div>
            <div
              className="mt-1 text-xs text-secondary/70"
              suppressHydrationWarning
            >
              {formatDuration(experience.startDate, experience.endDate)}
            </div>
          </div>

          {/* Content column */}
          <div className="pb-12">
            <article
              className={`group relative bg-card border border-muted-border p-6 sm:p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg ${
                current ? "border-l-2 border-l-accent" : ""
              }`}
            >
              {/* Header */}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {experience.position}
                  </h3>
                  <p className="mt-1 text-sm text-secondary">
                    <span className="font-medium text-foreground">
                      {experience.company}
                    </span>
                    <span className="mx-1.5 text-muted-border">·</span>
                    {experience.location}
                  </p>
                </div>
                <span className="self-start whitespace-nowrap border border-muted-border px-2.5 py-1 text-xs uppercase tracking-wider text-secondary">
                  {experience.type}
                </span>
              </div>

              {experience.description && (
                <p className="mb-6 text-sm leading-relaxed text-secondary">
                  {experience.description}
                </p>
              )}

              {experience.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-xs uppercase tracking-wider text-secondary">
                    Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {experience.responsibilities.map((resp, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <span className="flex h-[1.625em] flex-shrink-0 items-center" aria-hidden="true">
                          <span className="h-1 w-1 rounded-full bg-secondary" />
                        </span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.achievements.length > 0 && (
                <div className="mb-6 border-l-2 border-accent/50 bg-accent/[0.05] py-3 pl-4 pr-3">
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent">
                    <Award className="h-3.5 w-3.5" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {experience.achievements.map((achievement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <span className="flex h-[1.625em] flex-shrink-0 items-center" aria-hidden="true">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-muted-border pt-5">
                  {experience.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="border border-muted-border px-2 py-1 text-xs uppercase tracking-wider text-secondary transition-colors hover:border-accent/50 hover:text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="space-y-0">
        {experiences.map((exp, i) => (
          <ExperienceCard key={exp.id} experience={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
