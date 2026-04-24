"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";

const LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

export function NavBar() {
  const pathname = usePathname();
  const user = useAppStore((s) => s.user);
  const signOut = useAppStore((s) => s.signOut);

  return (
    <header className="sticky top-0 z-30 border-b border-ink-400/10 bg-ink-900/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sakura-500 text-lg font-black text-white">
            漢
          </span>
          <span className="text-sm font-bold tracking-tight">
            KanjiVision<span className="text-sakura-400"> AI</span>
          </span>
        </Link>
        <ul className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  pathname?.startsWith(l.href)
                    ? "bg-ink-800 text-white"
                    : "text-ink-100 hover:bg-ink-800/70"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="chip hidden sm:inline-flex">
                {user.tier === "premium" ? "★ Premium" : user.tier === "basic" ? "Basic" : "Free"}
              </span>
              <button className="btn-ghost !py-1.5 !text-xs" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signin" className="btn-primary !py-1.5 !text-xs">
              Sign in
            </Link>
          )}
        </div>
      </nav>
      {/* Mobile sub-nav */}
      <ul className="flex items-center justify-around border-t border-ink-400/10 py-1 sm:hidden">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={clsx(
                "px-3 py-1.5 text-xs",
                pathname?.startsWith(l.href) ? "text-sakura-300" : "text-ink-100"
              )}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
