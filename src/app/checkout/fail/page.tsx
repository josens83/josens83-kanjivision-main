import Link from "next/link";

export default function CheckoutFailPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card">
        <div className="text-5xl">😞</div>
        <h1 className="mt-4 text-2xl font-black text-red-400">Payment failed</h1>
        <p className="mt-2 text-sm text-ink-400">
          Your payment could not be processed. No charges were made.
        </p>
        <ul className="mt-4 text-left text-sm text-ink-400 list-disc list-inside">
          <li>Check your card details and try again</li>
          <li>Ensure sufficient balance</li>
          <li>Try a different payment method</li>
        </ul>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/pricing" className="btn-primary">Try again</Link>
          <Link href="/contact" className="btn-ghost">Contact support</Link>
        </div>
      </div>
    </div>
  );
}
