import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your saved JLPT vocabulary words.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
