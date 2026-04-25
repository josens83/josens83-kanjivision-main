"use client";
import { useState } from "react";
import Link from "next/link";

const FAQ = [
  { q: "What is KanjiVision AI?", a: "A JLPT vocabulary learning platform with AI-generated kanji decomposition, mnemonics, and SM-2 spaced repetition." },
  { q: "Is N5 really free?", a: "Yes. All 800 N5 words with kanji decomposition and flashcards are completely free, no credit card required." },
  { q: "How does spaced repetition work?", a: "SM-2 algorithm schedules reviews at optimal intervals. Cards you struggle with appear more often; mastered ones space out." },
  { q: "Can I use it offline?", a: "Yes — KanjiVision is a PWA. Install it from your browser and study offline. Progress syncs when you're back online." },
  { q: "How do I cancel my subscription?", a: "Go to Settings → Account. Your access continues until the current billing period ends." },
  { q: "Which JLPT levels are available?", a: "N5 (free), N4 (Basic plan), N3/N2/N1 (Premium plan). We're constantly adding more words via AI generation." },
  { q: "How are the images generated?", a: "We use Stability AI with Claude-enhanced prompts that encode the kanji decomposition visually." },
];

export default function CSPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="text-2xl font-black">Help Center</h1>
      <p className="text-sm text-ink-400">Frequently asked questions about KanjiVision AI.</p>
      <div className="mt-6 flex flex-col gap-2">
        {FAQ.map((f, i) => (
          <div key={i} className="card cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{f.q}</h3>
              <span className="text-ink-400">{open === i ? "−" : "+"}</span>
            </div>
            {open === i && <p className="mt-2 text-sm text-ink-400">{f.a}</p>}
          </div>
        ))}
      </div>
      <div className="mt-8 card text-center">
        <p className="text-sm text-ink-400">Still need help?</p>
        <Link href="/contact" className="btn-primary mt-3">Contact us</Link>
      </div>
    </div>
  );
}
