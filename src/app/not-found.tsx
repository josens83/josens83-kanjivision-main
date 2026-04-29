import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="text-6xl font-black text-sakura-300">404</div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-sm text-ink-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/learn" className="btn-ghost">Start learning</Link>
      </div>
    </div>
  );
}
