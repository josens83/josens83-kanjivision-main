import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Account",
  description: "Manage your KanjiVision account — change password or delete.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
