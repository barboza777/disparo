import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { reconcileOutstandingPayments } from "@/lib/payment-reconciliation.server";
export const Route = createFileRoute("/api/public/reconcile-payments")({ server: { handlers: {
  POST: async ({ request }) => {
    const expected = process.env["RECONCILIATION_TOKEN"];
    const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!expected || !supplied) return new Response("Unauthorized", { status: 401 });
    const digest = (value: string) => createHmac("sha256", expected).update(value).digest();
    if (!timingSafeEqual(digest(expected), digest(supplied))) return new Response("Unauthorized", { status: 401 });
    try { return Response.json({ success: true, ...await reconcileOutstandingPayments() }); }
    catch { return Response.json({ success: false }, { status: 500 }); }
  },
} } });
