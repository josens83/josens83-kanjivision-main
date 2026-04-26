"use client";

import { usePathname } from "next/navigation";

const HIDE_FOOTER_PREFIXES = ["/learn", "/quiz", "/chat", "/study", "/review"];

export function Footer() {
  const pathname = usePathname();
  const hide = HIDE_FOOTER_PREFIXES.some((p) => pathname?.startsWith(p));
  if (hide) return null;

  return (
    <footer className="border-t border-ink-400/10 px-4 py-10 text-center text-xs text-ink-400">
      <p>&copy; 2026 Unipath. All rights reserved.</p>
      <p className="mt-2">
        <a className="underline hover:text-sakura-200" href="/legal/terms">Terms</a>
        <span className="mx-1">&middot;</span>
        <a className="underline hover:text-sakura-200" href="/legal/privacy">Privacy</a>
        <span className="mx-1">&middot;</span>
        <a className="underline hover:text-sakura-200" href="/legal/refund-policy">Refund</a>
        <span className="mx-1">&middot;</span>
        <a className="underline hover:text-sakura-200" href="/cs">Help</a>
        <span className="mx-1">&middot;</span>
        <a className="underline hover:text-sakura-200" href="/contact">Contact</a>
        <span className="mx-1">&middot;</span>
        <a className="text-sakura-300 underline" href="https://vocavision.app">VocaVision</a>
        <span className="mx-1">&middot;</span>
        <a className="text-sakura-300 underline" href="https://hangeulvision.app">HangeulVision</a>
      </p>
    </footer>
  );
}
