import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Quiz",
  description: "JLPT 단어 퀴즈 — 4지선다로 일본어 어휘력을 테스트하세요.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
