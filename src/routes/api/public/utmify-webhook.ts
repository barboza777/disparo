import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { currentUtcDate, sendUtmifyOrder } from "@/lib/utmify.server";
import { markPendingResult, reconcilePayment, savePaymentOrder } from "@/lib/payment-reconciliation.server";

const tracking = z.object({ src: z.string().nullable(), sck: z.string().nullable(), utm_source: z.string().nullable(), utm_campaign: z.string().nullable(), utm_medium: z.string().nullable(), utm_content: z.string().nullable(), utm_term: z.string().nullable() });
const schema = z.object({
  status: z.enum(["waiting_payment", "paid"]),
  order: z.object({ orderId: z.string().min(1).max(200), createdAt: z.string().datetime().optional(), amountInCents: z.number().int().positive().max(100000000), customer: z.object({ name: z.string().min(1).max(200), email: z.string().email(), document: z.string().max(30).nullable(), ip: z.string().max(64).optional() }), trackingParameters: tracking }),
});

export const Route = createFileRoute("/api/public/utmify-webhook")({ server: { handlers: {
  POST: async ({ request }) => {
    const secret = process.env["ORDER_WEBHOOK_SECRET"];
    const timestamp = request.headers.get("x-order-timestamp") ?? "";
    const received = request.headers.get("x-order-signature") ?? "";
    if (!secret || !timestamp || !Number.isFinite(Number(timestamp)) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return new Response("Unauthorized", { status: 401 });
    const raw = await request.text();
    if (raw.length > 65536) return new Response("Payload too large", { status: 413 });
    const expected = `sha256=${createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex")}`;
    const a = Buffer.from(expected), b = Buffer.from(received);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Unauthorized", { status: 401 });
    let json: unknown;
    try { json = JSON.parse(raw); } catch { return new Response("Invalid JSON", { status: 400 }); }
    const parsed = schema.safeParse(json);
    if (!parsed.success) return new Response("Invalid payload", { status: 400 });
    const { order: input, status } = parsed.data;
    const order = { ...input, createdAt: input.createdAt ? new Date(input.createdAt).toISOString().slice(0, 19).replace("T", " ") : currentUtcDate(), customer: { name: input.customer.name, email: input.customer.email, document: input.customer.document, ...(input.customer.ip ? { ip: input.customer.ip } : {}) } };
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: existing, error } = await supabaseAdmin.from("payment_orders").select("amount_in_cents,customer_document,gateway_status,utmify_pending_sent_at").eq("txid", order.orderId).maybeSingle();
      if (error) throw error;
      if (existing && (existing.amount_in_cents !== order.amountInCents || existing.customer_document !== order.customer.document)) return new Response("Order conflict", { status: 409 });
      if (!existing) await savePaymentOrder(order);
      if (status === "paid") {
        const result = await reconcilePayment(order.orderId, { response: new Response(null, { status: 200 }), text: "", data: null, normalizedStatus: "paid" });
        return Response.json({ success: result.utmifyPaidSent }, { status: result.utmifyPaidSent ? 200 : 503 });
      }
      if (existing?.gateway_status === "paid" || existing?.utmify_pending_sent_at) return Response.json({ success: true });
      const sent = await sendUtmifyOrder(order, "waiting_payment");
      await markPendingResult(order.orderId, sent);
      return Response.json({ success: sent }, { status: sent ? 200 : 503 });
    } catch { return Response.json({ success: false }, { status: 500 }); }
  },
} } });
