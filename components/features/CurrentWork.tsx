import { getFeaturedProject } from "@/lib/data";
import { Github, FileText } from "lucide-react";

export function CurrentWork() {
  const project = getFeaturedProject();

  if (!project) return null;

  return (
    <section className="bg-muted py-24">
      <div className="max-w-6xl mx-auto px-6">
        <span className="text-xs uppercase tracking-wider text-accent font-sans mb-8 block">
          Current Work
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl lg:text-6xl text-foreground mb-4">
              {project.title}
            </h2>
            <p className="text-secondary text-sm leading-relaxed mb-8">
              {project.longDescription}
            </p>
            <div className="flex gap-4">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  <Github className="w-4 h-4" />
                  View Repository
                </a>
              )}
              {project.links.documentation && (
                <a
                  href={project.links.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Documentation
                </a>
              )}
            </div>
          </div>

          <div className="bg-code-bg rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/20">
              <span className="w-3 h-3 rounded-full bg-[#E06C75]" />
              <span className="w-3 h-3 rounded-full bg-[#E5C07B]" />
              <span className="w-3 h-3 rounded-full bg-[#98C379]" />
              <span className="ml-4 text-xs text-secondary font-mono">
                src/compositor/mod.rs
              </span>
            </div>
            <pre className="p-6 text-sm font-mono overflow-x-auto">
              <code className="text-code-foreground">
                {`impl WaylandSurface for Compositor {
  fn commit(&mut self) -> Result<(), Error> {
    let frame = self.swap_chain
      .acquire()?;
    self.renderer
      .draw_frame(frame)
  }
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
