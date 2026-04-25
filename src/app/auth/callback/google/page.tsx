"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authToken } from "@/lib/api";
import { useAppStore } from "@/lib/store";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const hydrate = useAppStore((s) => s.hydrate);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params?.get("token");
    const err = params?.get("error");

    if (err) {
      setError(err);
      return;
    }
    if (!token) {
      setError("토큰이 없습니다.");
      return;
    }

    authToken.set(token);
    hydrate().then(() => {
      router.replace("/dashboard");
    });
  }, [params, router, hydrate]);

  if (error) {
    return (
      <div className="mx-auto max-w-sm py-16 text-center">
        <h1 className="text-xl font-bold text-red-400">로그인 실패</h1>
        <p className="mt-2 text-sm text-ink-400">{error}</p>
        <a href="/signin" className="btn-primary mt-4 inline-block">
          다시 시도
        </a>
      </div>
    );
  }

  return (
    <div className="mt-16 text-center text-ink-400">
      Google 로그인 처리 중...
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="mt-16 text-center text-ink-400">로딩 중...</div>}>
      <CallbackInner />
    </Suspense>
  );
}
