"use client";

import { FadeIn } from "@/components/ui";
import type { Experience } from "@/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  return (
    <FadeIn delay={index * 100}>
      <div className="relative pl-8 md:pl-0">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-muted-border md:left-[200px]" />
        
        {/* Timeline dot */}
        <div className="absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full bg-accent md:left-[196px]" />

        <div className="md:grid md:grid-cols-[200px_1fr] md:gap-12">
          {/* Date column */}
          <div className="mb-4 md:mb-0 md:text-right md:pr-12">
            <span className="text-xs uppercase tracking-wider text-secondary font-sans">
              {formatDate(experience.startDate)} — {formatDate(experience.endDate)}
            </span>
            {experience.current && (
              <span className="ml-2 text-xs uppercase tracking-wider text-accent">
                Current
              </span>
            )}
          </div>

          {/* Content column */}
          <div className="pb-12">
            <div className="bg-card border border-muted-border p-6 transition-all duration-300 hover:border-accent/50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-serif text-xl text-foreground">
                    {experience.position}
                  </h3>
                  <p className="text-sm text-secondary mt-1">
                    {experience.company} · {experience.location}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wider text-secondary bg-muted px-2 py-1 self-start">
                  {experience.type}
                </span>
              </div>

              <p className="text-secondary text-sm leading-relaxed mb-4">
                {experience.description}
              </p>

              {experience.responsibilities.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs uppercase tracking-wider text-secondary mb-2">
                    Responsibilities
                  </h4>
                  <ul className="space-y-1">
                    {experience.responsibilities.map((resp, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-accent mt-1.5 flex-shrink-0">·</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs uppercase tracking-wider text-secondary mb-2">
                    Key Achievements
                  </h4>
                  <ul className="space-y-1">
                    {experience.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-accent mt-1.5 flex-shrink-0">·</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.technologies.length > 0 && (
                <div className="pt-4 border-t border-muted-border">
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs uppercase tracking-wider text-secondary bg-muted px-2 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
