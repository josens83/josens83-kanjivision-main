"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface KanjiPart { char: string; reading: string; meaning: string }
interface WordItem { id: string; lemma: string; reading: string; meaning: string; kanjiParts: KanjiPart[] }
interface PkgWord { word: WordItem; displayOrder: number }
interface Pkg { name: string; nameEn: string | null; slug: string; description: string | null; descriptionEn: string | null; price: number; priceGlobal: string | null; durationDays: number; badge: string | null; isComingSoon: boolean; wordCount: number; words: PkgWord[]; paddlePriceId: string | null }

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const user = useAppStore((s) => s.user);
  const [pkg, setPkg] = useState<Pkg | null>(null);

  useEffect(() => {
    apiGet<{ package: Pkg }>(`/api/packages/${slug}`).then((r) => { if (r.ok && r.data) setPkg(r.data.package); });
  }, [slug]);

  if (!pkg) return <div className="mt-10 text-center text-ink-400">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl py-6 flex flex-col gap-6">
      <Link href="/packages" className="text-xs text-sakura-300 hover:underline">&larr; All Packs</Link>
      <div className="card">
        {pkg.badge && <span className="chip mb-2">{pkg.badge}</span>}
        <h1 className="text-2xl font-black">{pkg.nameEn ?? pkg.name}</h1>
        {(pkg.descriptionEn ?? pkg.description) && <p className="mt-2 text-sm text-ink-400">{pkg.descriptionEn ?? pkg.description}</p>}
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-black text-sakura-300">${pkg.priceGlobal ?? (pkg.price / 100).toFixed(2)}</span>
          <span className="text-sm text-ink-400">{pkg.durationDays} days &middot; {pkg.wordCount} words</span>
        </div>
        {pkg.isComingSoon ? (
          <button className="btn-ghost mt-4 opacity-60" disabled>Coming Soon</button>
        ) : !pkg.paddlePriceId ? (
          <button className="btn-ghost mt-4 opacity-60" disabled>Price not set yet</button>
        ) : (
          <button className="btn-primary mt-4" onClick={() => {
            if (!user) { router.push(`/signin?next=/packages/${slug}`); return; }
            const Paddle = (window as any).Paddle;
            if (Paddle?.Checkout) {
              Paddle.Checkout.open({
                items: [{ priceId: pkg.paddlePriceId, quantity: 1 }],
                customer: { email: user.email },
                customData: { service: "kv", slug: pkg.slug, type: "package", userId: user.id },
                successCallback: () => router.push("/my"),
              });
            } else {
              alert("Payment system loading. Please refresh and try again.");
            }
          }}>Purchase Pack</button>
        )}
      </div>

      {pkg.words.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">Words in this pack ({pkg.wordCount})</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {pkg.words.map((pw) => (
              <Link key={pw.word.id} href={`/words/${pw.word.id}`} className="card hover:border-sakura-500/50 transition py-3">
                <ruby className="text-lg font-bold">{pw.word.lemma}<rt>{pw.word.reading}</rt></ruby>
                <div className="text-sm text-ink-400">{pw.word.meaning}</div>
                {pw.word.kanjiParts.length > 0 && (
                  <div className="mt-1 flex gap-1">{pw.word.kanjiParts.map((k) => <span key={k.char} className="chip text-[0.6rem]">{k.char} {k.meaning}</span>)}</div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
