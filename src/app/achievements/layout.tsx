import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Achievements",
  description: "JLPT 학습 업적과 뱃지를 확인하세요.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
