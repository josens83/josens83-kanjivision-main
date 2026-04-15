import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { ServiceWorker } from "@/components/ServiceWorker";
import { AuthBoot } from "@/components/AuthBoot";

export const metadata: Metadata = {
  title: {
    default: "KanjiVision AI — Japanese, Visualized.",
    template: "%s · KanjiVision AI",
  },
  description:
    "Learn JLPT N5 → N1 vocabulary with AI-generated mnemonics, kanji decomposition, and spaced repetition. Web · App · Mobile.",
  manifest: "/manifest.json",
  applicationName: "KanjiVision AI",
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
    title: "KanjiVision AI — Japanese, Visualized.",
    description:
      "JLPT N5→N1 vocabulary with AI-generated visual mnemonics and kanji decomposition.",
    url: "https://kanjivision.app",
    siteName: "KanjiVision AI",
    locale: "en_US",
    type: "website",
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
        <footer className="border-t border-ink-400/10 px-4 py-8 text-center text-xs text-ink-400">
          <p>
            © {new Date().getFullYear()} Unipath · KanjiVision AI — part of the{" "}
            <span className="text-sakura-300">Vision Platform</span>
            <span className="mx-1">·</span>
            <a className="underline hover:text-sakura-200" href="/legal/terms">Terms</a>
            <span className="mx-1">·</span>
            <a className="underline hover:text-sakura-200" href="/legal/privacy">Privacy</a>
          </p>
          <p className="mt-2 text-[0.7rem]">
            Sibling services: <a className="text-sakura-300 underline" href="https://vocavision.app">VocaVision</a>
            {" · "}
            <a className="text-sakura-300 underline" href="https://hangeulvision.app">HangeulVision</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
