import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to KanjiVision AI and sync your JLPT study progress.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
