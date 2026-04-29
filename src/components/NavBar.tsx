"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";
import { apiGet } from "@/lib/api";

const LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/quiz", label: "Quiz" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

const USER_MENU = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/achievements", label: "Achievements" },
  { href: "/statistics", label: "Statistics" },
  { href: "/settings", label: "Settings" },
  { href: "/my", label: "My subscription" },
  { href: "/account", label: "Account" },
];

export function NavBar() {
  const pathname = usePathname();
  const user = useAppStore((s) => s.user);
  const signOut = useAppStore((s) => s.signOut);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    apiGet<{ count: number }>("/api/notifications/unread-count").then((r) => {
      if (r.ok && r.data) setUnreadCount(r.data.count);
    });
  }, [user, pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
          {user && (
            <Link href="/notifications" className="relative rounded-full p-1.5 text-ink-300 transition hover:bg-ink-800 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sakura-500 text-[0.55rem] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-ink-400/30 px-3 py-1.5 text-xs transition hover:bg-ink-800"
              >
                <span className="hidden sm:inline text-sakura-300">
                  {user.tier === "premium" ? "★" : user.tier === "basic" ? "◆" : "○"}
                </span>
                <span className="max-w-[100px] truncate">
                  {user.email.split("@")[0]}
                </span>
                <span className="text-ink-400">▾</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-ink-400/20 bg-ink-800 py-1 shadow-card">
                  {USER_MENU.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "block px-4 py-2 text-sm transition hover:bg-ink-900/60",
                        pathname?.startsWith(item.href) ? "text-sakura-300" : "text-ink-100"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-ink-400/20" />
                  <button
                    onClick={signOut}
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 transition hover:bg-ink-900/60"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
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
