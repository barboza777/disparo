import type { Json, Tables } from "@/integrations/supabase/types";
import { currentUtcDate, sendUtmifyOrder, type TrackingParameters, type UtmifyOrder } from "@/lib/utmify.server";


export const approvedStatuses = new Set([
  "paid",
  "approved",
  "completed",
  "confirmed",
  "success",
  "succeeded",
  "pago",
  "aprovado",
]);

const trackingKeys: Array<keyof TrackingParameters> = [
  "src", "sck", "utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term",
];

const emptyTracking: TrackingParameters = {
  src: null,
  sck: null,
  utm_source: null,
  utm_campaign: null,
  utm_medium: null,
  utm_content: null,
  utm_term: null,
};

export function parseProviderResponse(deposit: Record<string, unknown>) {
  const raw = deposit["provider_response"];
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) as unknown : raw;
    if (!parsed || typeof parsed !== "object") return null;
    const root = parsed as Record<string, unknown>;
    return root["data"] && typeof root["data"] === "object"
      ? root["data"] as Record<string, unknown>
      : root;
  } catch {
    return null;
  }
}

export function extractDeposit(data: unknown) {
  if (!data || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  const nested = root["data"] && typeof root["data"] === "object"
    ? root["data"] as Record<string, unknown>
    : undefined;
  const deposit = nested?.["deposit"] ?? root["deposit"] ?? nested ?? root;
  return deposit && typeof deposit === "object" ? deposit as Record<string, unknown> : null;
}

export function extractGatewayStatus(data: unknown) {
  const deposit = extractDeposit(data);
  if (!deposit) return "";
  const provider = parseProviderResponse(deposit);
  const rawStatus = provider?.["status"]
    ?? provider?.["transaction_status"]
    ?? deposit["status"]
    ?? deposit["transaction_status"]
    ?? "";
  return String(rawStatus).trim().toLowerCase();
}

export function isApprovedStatus(status: string) {
  return approvedStatuses.has(status.trim().toLowerCase());
}

function normalizeTracking(value: Json): TrackingParameters {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, Json | undefined>
    : {};
  return Object.fromEntries(
    trackingKeys.map((key) => [key, typeof source[key] === "string" ? source[key] : null]),
  ) as TrackingParameters;
}

export function orderFromRow(row: Tables<"payment_orders">): UtmifyOrder {
  return {
    orderId: row.txid,
    createdAt: row.created_at
      ? new Date(row.created_at).toISOString().slice(0, 19).replace("T", " ")
      : currentUtcDate(),
    amountInCents: row.amount_in_cents,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      document: row.customer_document,
      ...(row.customer_ip ? { ip: row.customer_ip } : {}),
    },
    trackingParameters: normalizeTracking(row.tracking_parameters),
  };
}

export async function savePaymentOrder(order: UtmifyOrder) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("payment_orders").upsert({
    txid: order.orderId,
    amount_in_cents: order.amountInCents,
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_document: order.customer.document,
    customer_ip: order.customer.ip ?? null,
    tracking_parameters: order.trackingParameters,
  }, { onConflict: "txid" });
  if (error) throw error;
}

export async function markPendingResult(txid: string, sent: boolean, errorMessage?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("payment_orders").update({
    ...(sent ? { utmify_pending_sent_at: new Date().toISOString(), last_error: null } : {}),
    ...(!sent ? { last_error: errorMessage ?? "Falha ao enviar venda pendente à UTMify" } : {}),
  }).eq("txid", txid);
}

type PaymentEvent = { response: Response; text: string; data: unknown; normalizedStatus: string };

export async function reconcilePayment(txid: string, gatewayResult?: PaymentEvent) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let gateway = gatewayResult;
  if (!gateway) {
    const { data: existing, error } = await supabaseAdmin.from("payment_orders").select("gateway_status").eq("txid", txid).maybeSingle();
    if (error) throw error;
    if (!existing) throw new Error("Pedido não encontrado");
    gateway = { response: new Response(null, { status: 200 }), text: "", data: null, normalizedStatus: existing.gateway_status };
  }
  const checkedAt = new Date().toISOString();
  await supabaseAdmin.from("payment_orders").update({
    gateway_status: gateway.normalizedStatus || "unknown",
    last_checked_at: checkedAt,
  }).eq("txid", txid);

  if (!isApprovedStatus(gateway.normalizedStatus)) {
    return { ...gateway, utmifyPaidSent: false };
  }

  const { data: claimed, error: claimError } = await supabaseAdmin
    .rpc("claim_payment_order_for_utmify", { _txid: txid })
    .maybeSingle();
  if (claimError) throw claimError;
  if (!claimed) {
    const { data: existing } = await supabaseAdmin
      .from("payment_orders")
      .select("utmify_paid_sent_at")
      .eq("txid", txid)
      .maybeSingle();
    return { ...gateway, utmifyPaidSent: Boolean(existing?.utmify_paid_sent_at) };
  }

  const order = orderFromRow(claimed);
  try {
    if (!claimed.utmify_pending_sent_at) {
      const pendingSent = await sendUtmifyOrder(order, "waiting_payment");
      if (pendingSent) {
        await supabaseAdmin.from("payment_orders").update({
          utmify_pending_sent_at: new Date().toISOString(),
        }).eq("txid", txid);
      }
    }
    const paidSent = await sendUtmifyOrder(order, "paid");
    await supabaseAdmin.from("payment_orders").update(paidSent ? {
      utmify_paid_sent_at: new Date().toISOString(),
      utmify_paid_claimed_at: null,
      last_error: null,
    } : {
      utmify_paid_claimed_at: null,
      last_error: "UTMify recusou a atualização da venda paga",
    }).eq("txid", txid);
    return { ...gateway, utmifyPaidSent: paidSent };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 1_000) : "Erro desconhecido";
    await supabaseAdmin.from("payment_orders").update({
      utmify_paid_claimed_at: null,
      last_error: message,
    }).eq("txid", txid);
    throw error;
  }
}

export async function reconcileOutstandingPayments(limit = 100) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const retryBefore = new Date(Date.now() - 60_000).toISOString();
  const { data: orders, error } = await supabaseAdmin
    .from("payment_orders")
    .select("txid")
    .is("utmify_paid_sent_at", null)
    .in("gateway_status", Array.from(approvedStatuses))
    .or(`last_checked_at.is.null,last_checked_at.lt.${retryBefore}`)
    .order("last_checked_at", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;

  const results = await Promise.allSettled((orders ?? []).map(({ txid }) => reconcilePayment(txid)));
  return {
    checked: results.length,
    paidSent: results.filter((result) => result.status === "fulfilled" && result.value.utmifyPaidSent).length,
    failed: results.filter((result) => result.status === "rejected").length,
  };
}