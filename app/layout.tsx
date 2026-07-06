import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
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
    <html lang="en" className={montserrat.variable}>
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
