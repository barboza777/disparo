import { createFileRoute } from "@tanstack/react-router";
import html from "../site/payment.html?raw";
import { getBrandingAssetUrls } from "@/lib/branding";

const formatMoney = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? "");

async function paymentHtml() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [assets, { data }] = await Promise.all([
    getBrandingAssetUrls(),
    supabaseAdmin.from("admin_settings").select("checkout_description,processing_fee_cents,icms_fee_cents,federal_fee_cents").eq("id", true).maybeSingle(),
  ]);
  if (!data) return html
    .replaceAll("{{HEADER_LOGO_URL}}", assets.headerLogoUrl)
    .replaceAll("{{PAYMENT_BANNER_URL}}", assets.secondaryBannerUrl)
    .replaceAll(/{{[A-Z0-9_]+}}/g, "");
  const total = data.processing_fee_cents + data.icms_fee_cents + data.federal_fee_cents;
  return html
    .replaceAll("{{HEADER_LOGO_URL}}", assets.headerLogoUrl)
    .replaceAll("{{PAYMENT_BANNER_URL}}", assets.secondaryBannerUrl)
    .replaceAll("{{CHECKOUT_DESCRIPTION}}", escapeHtml(data.checkout_description))
    .replaceAll("R$ 17,50", formatMoney(data.processing_fee_cents))
    .replaceAll("R$ 19,25", formatMoney(data.icms_fee_cents))
    .replaceAll("R$ 21,60", formatMoney(data.federal_fee_cents))
    .replaceAll("R$ 58,35", formatMoney(total))
    .replaceAll("58.35", (total / 100).toFixed(2));
}

export const Route = createFileRoute("/pagamento")({
  head: () => ({ meta: [
    { title: "Pagamento Pix | Área segura" },
    { name: "description", content: "Finalize o pagamento do pedido por Pix." },
    { property: "og:title", content: "Pagamento Pix | Área segura" },
    { property: "og:description", content: "Finalize o pagamento do pedido por Pix." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  server: { handlers: { GET: async () => new Response(await paymentHtml(), { headers: { "Content-Type": "text/html; charset=utf-8" } }) } },
});