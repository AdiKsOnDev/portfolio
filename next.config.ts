import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * The site ships as a static export (GitHub Pages), so there is no server in
 * production. The admin panel is therefore DEV-ONLY:
 *
 *  - In `next dev` we add `dev.tsx` / `dev.ts` to pageExtensions, so files named
 *    `page.dev.tsx` and `route.dev.ts` (the admin UI + write APIs) become live
 *    routes. `output: export` is left off so route handlers can write files.
 *  - In `next build` those extensions are absent, so every admin `*.dev.*` file
 *    is invisible to the exporter — the panel simply doesn't exist in the
 *    deployed bundle, and its POST/PUT/DELETE handlers can't break the export.
 */
const config = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...(isDev ? {} : { output: "export" }),
    pageExtensions: isDev
      ? ["dev.tsx", "dev.ts", "tsx", "ts", "jsx", "js"]
      : ["tsx", "ts", "jsx", "js"],
  };
};

export default config;
