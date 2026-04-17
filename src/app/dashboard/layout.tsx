import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Track your JLPT study progress, streak, and mastered words.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
