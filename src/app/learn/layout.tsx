import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Learn",
  description: "Study JLPT vocabulary with flashcards, kanji decomposition, and SM-2 spaced repetition.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
