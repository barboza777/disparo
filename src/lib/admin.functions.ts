import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const paidStatuses = ["paid", "approved", "completed", "confirmed", "success", "succeeded", "pago", "aprovado"];

const settingsSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  companyDocument: z.string().trim().min(11).max(30),
  supportPhone: z.string().trim().min(10).max(30),
  checkoutDescription: z.string().trim().min(3).max(120),
  warningBannerText: z.string().trim().max(180),
  attentionTitle: z.string().trim().min(1).max(500),
  headerLogoPath: z.string().trim().max(255),
  bannerPrimaryPath: z.string().trim().max(255),
  bannerSecondaryPath: z.string().trim().max(255),
  footerPolicyOneLabel: z.string().trim().max(80),
  footerPolicyOneUrl: z.string().trim().url().or(z.literal("")),
  footerPolicyTwoLabel: z.string().trim().max(80),
  footerPolicyTwoUrl: z.string().trim().url().or(z.literal("")),
  processingFeeCents: z.number().int().min(0).max(1_000_000),
  icmsFeeCents: z.number().int().min(0).max(1_000_000),
  federalFeeCents: z.number().int().min(0).max(1_000_000),
  hubpagueApiToken: z.string().trim().min(10).max(500),
  searchapiCpfToken: z.string().trim().min(1).max(500),
});

async function requireAdmin(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Acesso administrativo não autorizado");
}

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("payment_orders")
      .select("id,txid,amount_in_cents,customer_name,customer_email,customer_document,gateway_status,utmify_pending_sent_at,utmify_paid_sent_at,last_error,created_at,updated_at")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const orders = data ?? [];
    const paid = orders.filter((order) => paidStatuses.includes(order.gateway_status.toLowerCase()));
    const pending = orders.filter((order) => !paidStatuses.includes(order.gateway_status.toLowerCase()));
    const dailyMap = new Map<string, { date: string; orders: number; paid: number; revenue: number }>();
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - offset);
      const key = date.toISOString().slice(0, 10);
      dailyMap.set(key, { date: key, orders: 0, paid: 0, revenue: 0 });
    }
    for (const order of orders) {
      const key = order.created_at.slice(0, 10);
      const day = dailyMap.get(key);
      if (!day) continue;
      day.orders += 1;
      if (paidStatuses.includes(order.gateway_status.toLowerCase())) {
        day.paid += 1;
        day.revenue += order.amount_in_cents;
      }
    }

    return {
      metrics: {
        totalOrders: orders.length,
        paidOrders: paid.length,
        conversion: orders.length ? (paid.length / orders.length) * 100 : 0,
        approvedRevenueCents: paid.reduce((sum, order) => sum + order.amount_in_cents, 0),
        pendingAmountCents: pending.reduce((sum, order) => sum + order.amount_in_cents, 0),
      },
      daily: Array.from(dailyMap.values()),
      orders,
      integration: {
        utmify: orders.some((order) => order.last_error) ? "warning" : "online",
        pendingSent: orders.filter((order) => order.utmify_pending_sent_at).length,
        paidSent: orders.filter((order) => order.utmify_paid_sent_at).length,
        errors: orders.filter((order) => order.last_error).length,
        lastSyncAt: orders.find((order) => order.updated_at)?.updated_at ?? null,
      },
    };
  });

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase.from("admin_settings").select("*").eq("id", true).single();
    if (error) throw error;
    const sign = async (path: string) => {
      if (!path) return "";
      const { data: signed } = await context.supabase.storage.from("site-branding").createSignedUrl(path, 3600);
      return signed?.signedUrl ?? "";
    };
    return {
      ...data,
      header_logo_url: await sign(data.header_logo_path),
      banner_primary_url: await sign(data.banner_primary_path),
      banner_secondary_url: await sign(data.banner_secondary_path),
    };
  });

export const saveAdminSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => settingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("admin_settings").update({
      company_name: data.companyName,
      company_document: data.companyDocument,
      support_phone: data.supportPhone,
      checkout_description: data.checkoutDescription,
      warning_banner_text: data.warningBannerText,
      attention_title: data.attentionTitle,
      header_logo_path: data.headerLogoPath,
      banner_primary_path: data.bannerPrimaryPath,
      banner_secondary_path: data.bannerSecondaryPath,
      footer_policy_one_label: data.footerPolicyOneLabel,
      footer_policy_one_url: data.footerPolicyOneUrl,
      footer_policy_two_label: data.footerPolicyTwoLabel,
      footer_policy_two_url: data.footerPolicyTwoUrl,
      processing_fee_cents: data.processingFeeCents,
      icms_fee_cents: data.icmsFeeCents,
      federal_fee_cents: data.federalFeeCents,
      hubpague_api_token: data.hubpagueApiToken,
      searchapi_cpf_token: data.searchapiCpfToken,
    }).eq("id", true);
    if (error) throw error;
    return { ok: true };
  });