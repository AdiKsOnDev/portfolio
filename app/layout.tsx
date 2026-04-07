import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header, Footer } from "@/components/layouts";
import { ThemeProvider, NotificationProvider } from "@/components/ui";
import "./globals.css";

const styreneSans = localFont({
  src: [
    {
      path: "../public/fonts/sans/StyreneA-Regular-Trial-BF63f6cbd970ee9.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/sans/StyreneA-Medium-Trial-BF63f6cbdb24b6d.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/sans/StyreneA-Bold-Trial-BF63f6cbda1877f.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/sans/StyreneA-Light-Trial-BF63f6cbd99dc3e.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/sans/StyreneA-RegularItalic-Trial-BF63f6cbd94325f.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/sans/StyreneA-BoldItalic-Trial-BF63f6cbd9bec08.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-styrene",
  display: "swap",
});

const tiemposSerif = localFont({
  src: [
    {
      path: "../public/fonts/serif/TestTiemposText-Regular-BF66457a50cd521.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/serif/TestTiemposText-Medium-BF66457a508489a.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/serif/TestTiemposText-Bold-BF66457a4f03c40.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/serif/TestTiemposText-RegularItalic-BF66457a50421c2.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/serif/TestTiemposText-BoldItalic-BF66457a50155b4.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/serif/TestTiemposHeadline-Regular-BF66457a508e31a.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/serif/TestTiemposHeadline-Bold-BF66457a5113d17.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-testiempos",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adil | Full-Stack Engineer",
  description:
    "Full-Stack Engineer @ Sentiment.AI - Building systems with precision and intent.",
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
    <html lang="en" className={`${styreneSans.variable} ${tiemposSerif.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <NotificationProvider>
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
