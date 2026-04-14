export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-3xl py-10 text-ink-100">
      <h1 className="text-3xl font-black">Terms of Service</h1>
      <p className="text-sm text-ink-400">Operator: Unipath · kanjivision.app</p>
      <p>
        KanjiVision AI is an educational service for learning Japanese (JLPT N5
        → N1). By using the site or app you agree to these terms.
      </p>
      <h2 className="mt-6 text-xl font-bold">Subscriptions</h2>
      <p>
        Paid plans (Basic, Premium) auto-renew monthly unless cancelled.
        One-shot packs (N3, N2, N1) grant lifetime access to the corresponding
        deck. Refunds are available within 7 days of the first subscription
        charge.
      </p>
      <h2 className="mt-6 text-xl font-bold">Acceptable use</h2>
      <p>
        No reverse-engineering, no scraping, no bulk export outside the provided
        Anki export tool.
      </p>
      <h2 className="mt-6 text-xl font-bold">Processors</h2>
      <p>Paddle (global) and TossPayments (Korea) handle billing.</p>
      <p className="mt-8 text-xs text-ink-400">
        This is a placeholder document — final legal text will be prepared
        before launch.
      </p>
    </article>
  );
}
