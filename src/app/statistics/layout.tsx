import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Statistics",
  description: "Your JLPT study analytics — streak, accuracy, and level progress.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
