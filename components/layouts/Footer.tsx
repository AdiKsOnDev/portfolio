import Link from "next/link";
import { getProfile } from "@/lib/data";

export function Footer() {
  const profile = getProfile();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-muted-border">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-secondary hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-secondary hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <Link
              href="/blog"
              className="text-xs uppercase tracking-wider text-secondary hover:text-foreground transition-colors"
            >
              Archive
            </Link>
          </div>

          <span className="text-xs uppercase tracking-wider text-secondary">
            © {currentYear} {profile.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
