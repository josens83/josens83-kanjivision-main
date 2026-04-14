"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function SignInPage() {
  const signIn = useAppStore((s) => s.signIn);
  const router = useRouter();
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    signIn(email);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-3xl font-black">Sign in</h1>
      <p className="mt-1 text-sm text-ink-400">
        Magic-link auth ships in Phase 2 (SendGrid). Today this creates a local
        identity so you can try the demo.
      </p>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input
          className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <button className="btn-primary">Continue</button>
      </form>
    </div>
  );
}
