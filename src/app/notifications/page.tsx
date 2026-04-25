"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPut } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface Notif { id: string; type: string; title: string; message: string; read: boolean; createdAt: string }

export default function NotificationsPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);

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

  return (
    <div className="mx-auto max-w-2xl py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Notifications</h1>
        <button className="btn-ghost !text-xs" onClick={markAll}>Mark all as read</button>
      </div>
      {notifs.length === 0 && <p className="text-ink-400 text-sm text-center mt-8">No notifications yet.</p>}
      {notifs.map((n) => (
        <div key={n.id} onClick={() => markOne(n.id)} className={`card cursor-pointer transition ${!n.read ? "border-sakura-500/30" : ""}`}>
          <div className="flex items-start gap-2">
            {!n.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-sakura-400 flex-shrink-0" />}
            <div><div className="font-semibold text-sm">{n.title}</div><div className="text-xs text-ink-400 mt-0.5">{n.message}</div>
              <div className="text-[0.6rem] text-ink-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
