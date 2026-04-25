"use client";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card">
        <div className="text-6xl animate-bounce">🎉</div>
        <h1 className="mt-4 text-2xl font-black">Payment successful!</h1>
        <p className="mt-2 text-sm text-ink-400">
          Your subscription is now active. All premium JLPT content is unlocked.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">Start learning</Link>
          <Link href="/vocabulary" className="btn-ghost">Browse words</Link>
        </div>
      </div>
      <div className="mt-20 flex justify-center gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full animate-ping" style={{
            backgroundColor: ["#ef4361", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"][i % 5],
            animationDelay: `${i * 0.15}s`, animationDuration: "1.5s",
          }} />
        ))}
      </div>
    </div>
  );
}
