"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="text-6xl font-black text-red-400">500</div>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-sm text-ink-400 max-w-md">{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset} className="btn-primary">Try again</button>
    </div>
  );
}
