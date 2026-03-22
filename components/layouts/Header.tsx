"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ui";
import { getProfile } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
];

export function Header() {
  const pathname = usePathname();
  const profile = getProfile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-muted-border">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg text-foreground hover:text-accent transition-colors"
        >
          {profile.name}
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-sans transition-colors relative ${
                    isActive
                      ? "text-accent after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-accent"
                      : "text-secondary hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pl-4 border-l border-muted-border">
            <ThemeToggle />
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-secondary hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
