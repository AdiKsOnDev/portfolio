import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { Header, Footer } from "@/components/layouts";
import { ThemeProvider, NotificationProvider } from "@/components/ui";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

const monocraft = localFont({
  src: [
    {
      path: "../public/fonts/sans/Monocraft/Monocraft.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/sans/Monocraft/weights/Monocraft-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/sans/Monocraft/weights/Monocraft-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-monocraft",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

const tiempos = localFont({
  src: [
    {
      path: "../public/fonts/serif/Tiempos/TestTiemposText-Regular-BF66457a50cd521.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/serif/Tiempos/TestTiemposText-RegularItalic-BF66457a50421c2.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/serif/Tiempos/TestTiemposText-Semibold-BF66457a4fed201.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/serif/Tiempos/TestTiemposText-Bold-BF66457a4f03c40.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tiempos",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const themeInitializationScript = `
  try {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch {}
`;

export const metadata: Metadata = {
  title: "Adil | Backend Engineer",
  description:
    "Backend Engineer @ Sentiment.AI - Building systems with precision and intent.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
  },
  alternates: {
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL || "https://adilalizada.com"}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${monocraft.variable} ${tiempos.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <NotificationProvider>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
