"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPut } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface Notif { id: string; type: string; title: string; message: string; read: boolean; createdAt: string }

const CATEGORIES = ["all", "SYSTEM", "PAYMENT", "LEARNING", "ANNOUNCEMENT"] as const;
const CAT_LABELS: Record<string, string> = { all: "All", SYSTEM: "System", PAYMENT: "Payment", LEARNING: "Learning", ANNOUNCEMENT: "Announcements" };
const TYPE_ICON: Record<string, string> = { SYSTEM: "gear", PAYMENT: "card", LEARNING: "book", ANNOUNCEMENT: "megaphone" };

export default function NotificationsPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    apiGet<{ notifications: Notif[] }>("/api/notifications").then((r) => { if (r.ok && r.data) setNotifs(r.data.notifications); });
  }, [user]);

  if (!user) return <div className="card mx-auto mt-10 max-w-md text-center"><h1 className="text-xl font-bold">Sign in</h1><button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/notifications")}>Sign in</button></div>;

  async function markAll() {
    await apiPut("/api/notifications/read-all");
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  }

  async function markOne(id: string) {
    await apiPut(`/api/notifications/${id}/read`);
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  const filtered = filter === "all" ? notifs : notifs.filter((n) => n.type === filter);
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Notifications</h1>
          {unreadCount > 0 && <p className="text-xs text-ink-400">{unreadCount} unread</p>}
        </div>
        <button className="btn-ghost !text-xs" onClick={markAll}>Mark all as read</button>
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${filter === c ? "bg-sakura-500 text-white" : "text-ink-400 hover:bg-ink-800"}`}
          >
            {CAT_LABELS[c]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-ink-400 text-sm text-center mt-8">No notifications{filter !== "all" ? ` in ${CAT_LABELS[filter]}` : ""}.</p>}
      {filtered.map((n) => (
        <div key={n.id} onClick={() => markOne(n.id)} className={`card cursor-pointer transition ${!n.read ? "border-sakura-500/30" : ""}`}>
          <div className="flex items-start gap-2">
            {!n.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-sakura-400 flex-shrink-0" />}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{n.title}</span>
                <span className="chip text-[0.5rem] !py-0">{n.type}</span>
              </div>
              <div className="text-xs text-ink-400 mt-0.5">{n.message}</div>
              <div className="text-[0.6rem] text-ink-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
