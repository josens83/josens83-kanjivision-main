"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "INFO" | "WARNING" | "URGENT";
  publishedAt: string;
}

const TYPE_STYLES: Record<string, string> = {
  INFO: "border-sky-500/30 bg-sky-500/5",
  WARNING: "border-amber-500/30 bg-amber-500/5",
  URGENT: "border-red-500/30 bg-red-500/5",
};

const TYPE_LABEL: Record<string, string> = {
  INFO: "Info",
  WARNING: "Notice",
  URGENT: "Important",
};

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ announcements: Announcement[] }>("/api/announcements")
      .then((r) => { if (r.ok && r.data) setItems(r.data.announcements); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 py-4 max-w-2xl mx-auto">
      <header>
        <h1 className="text-2xl font-black">Announcements</h1>
        <p className="text-sm text-ink-400">Latest updates from the KanjiVision team.</p>
      </header>

      {loading ? (
        <div className="text-center text-ink-400 py-8">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-ink-400 py-8">No announcements at this time.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((a) => (
            <article key={a.id} className={`card border ${TYPE_STYLES[a.type] ?? ""}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="chip text-[0.6rem]">{TYPE_LABEL[a.type] ?? a.type}</span>
                <span className="text-xs text-ink-400">
                  {new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <h2 className="text-lg font-bold">{a.title}</h2>
              <p className="mt-1 text-sm text-ink-300 whitespace-pre-line">{a.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
