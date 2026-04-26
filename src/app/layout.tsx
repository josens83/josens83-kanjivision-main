import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { ServiceWorker } from "@/components/ServiceWorker";
import { AuthBoot } from "@/components/AuthBoot";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "KanjiVision AI — Learn JLPT Vocabulary with AI",
    template: "%s · KanjiVision AI",
  },
  description:
    "Master JLPT kanji through AI decomposition, mnemonics, and spaced repetition. N5 to N1. Web, mobile PWA, native apps.",
  manifest: "/manifest.json",
  applicationName: "KanjiVision AI",
  metadataBase: new URL("https://kanjivision.app"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KanjiVision",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "KanjiVision AI — Learn JLPT Vocabulary with AI",
    description:
      "Master JLPT kanji through AI decomposition, mnemonics, and spaced repetition.",
    url: "https://kanjivision.app",
    siteName: "KanjiVision AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KanjiVision AI — Learn JLPT vocabulary one kanji at a time.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KanjiVision AI — Learn JLPT Vocabulary with AI",
    description:
      "Master JLPT kanji through AI decomposition, mnemonics, and spaced repetition.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ef4361",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-jp">
        <AuthBoot />
        <ServiceWorker />
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
