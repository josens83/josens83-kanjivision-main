import type { UserPurchase } from "@prisma/client";

interface ReceiptData {
  userName: string | null;
  userEmail: string;
  packageName: string;
  amount: number;
  transactionId: string;
  purchaseDate: Date;
  expiresAt: Date;
}

export function generateReceiptHTML(data: ReceiptData): string {
  const amountStr = `$${(data.amount / 100).toFixed(2)}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Receipt — KanjiVision AI</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #333; }
  .header { border-bottom: 2px solid #ef4361; padding-bottom: 16px; margin-bottom: 24px; }
  .header h1 { color: #ef4361; margin: 0; font-size: 24px; }
  .header p { color: #888; margin: 4px 0 0; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  td { padding: 8px 0; border-bottom: 1px solid #eee; }
  td:first-child { color: #888; width: 140px; }
  .total td { border-bottom: 2px solid #333; font-weight: bold; font-size: 18px; }
  .footer { margin-top: 32px; color: #888; font-size: 11px; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <h1>KanjiVision AI</h1>
    <p>Purchase Receipt</p>
  </div>
  <table>
    <tr><td>Customer</td><td>${data.userName ?? data.userEmail}</td></tr>
    <tr><td>Email</td><td>${data.userEmail}</td></tr>
    <tr><td>Product</td><td>${data.packageName}</td></tr>
    <tr><td>Date</td><td>${data.purchaseDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td></tr>
    <tr><td>Access until</td><td>${data.expiresAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td></tr>
    <tr><td>Transaction ID</td><td style="font-size:12px">${data.transactionId}</td></tr>
    <tr class="total"><td>Total</td><td>${amountStr} USD</td></tr>
  </table>
  <div class="footer">
    <p>KanjiVision AI · Part of the Vision Platform</p>
    <p>Questions? Contact support@kanjivision.app</p>
  </div>
</body>
</html>`;
}
