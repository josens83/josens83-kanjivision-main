export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-3xl py-10 text-ink-100">
      <h1 className="text-3xl font-black">Refund Policy</h1>
      <p className="text-sm text-ink-400">Operator: Unipath &middot; kanjivision.app &middot; Last updated: April 2026</p>
      <h2 className="mt-6 text-xl font-bold">Subscriptions (Basic / Premium)</h2>
      <ul>
        <li>Full refund within <b>7 days</b> of your first subscription charge.</li>
        <li>After 7 days, no prorated refunds. Cancel anytime — access continues until the current billing period ends.</li>
        <li>Refunds are processed through Paddle, our payment processor.</li>
      </ul>
      <h2 className="mt-6 text-xl font-bold">One-shot level packs (N3 / N2 / N1)</h2>
      <ul>
        <li>Digital content — <b>no refunds</b> once purchased, as access is granted immediately.</li>
        <li>Exception: if the content is materially different from what was advertised, contact support.</li>
      </ul>
      <h2 className="mt-6 text-xl font-bold">How to request a refund</h2>
      <ol>
        <li>Email <code>support@kanjivision.app</code> with your account email and reason.</li>
        <li>Or use the <a href="/contact">Contact form</a>.</li>
        <li>Refunds are processed within 5-10 business days.</li>
      </ol>
      <p className="mt-8 text-xs text-ink-400">This policy is subject to change. Users will be notified of material changes via email.</p>
    </article>
  );
}
