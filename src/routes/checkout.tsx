import { createFileRoute } from "@tanstack/react-router";
import html from "../site/checkout.html?raw";
import { getBrandingAssetUrls } from "@/lib/branding";

const formatMoney = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? "");

async function checkoutHtml() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const assets = await getBrandingAssetUrls();
  const { data } = await supabaseAdmin.from("admin_settings").select("checkout_description,warning_banner_text,attention_title,processing_fee_cents,icms_fee_cents,federal_fee_cents").eq("id", true).maybeSingle();
  if (!data) return html.replaceAll("{{HEADER_LOGO_URL}}", assets.headerLogoUrl);
  const total = data.processing_fee_cents + data.icms_fee_cents + data.federal_fee_cents;
  return html
    .replaceAll("{{HEADER_LOGO_URL}}", assets.headerLogoUrl)
    .replaceAll("R$ 17,50", formatMoney(data.processing_fee_cents))
    .replaceAll("R$ 19,25", formatMoney(data.icms_fee_cents))
    .replaceAll("R$ 21,60", formatMoney(data.federal_fee_cents))
    .replaceAll("R$ 58,35", formatMoney(total))
    .replaceAll("Regularização ICMS", escapeHtml(data.checkout_description))
    .replace("{{WARNING_BANNER_TEXT}}", escapeHtml(data.warning_banner_text))
    .replace("{{ATTENTION_TITLE}}", escapeHtml(data.attention_title))
    .replaceAll(/{{[A-Z0-9_]+}}/g, "");
}

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Detalhes do pedido" },
      { name: "description", content: "Confira os detalhes e valores do seu pedido." },
      { property: "og:title", content: "Detalhes do pedido" },
      { property: "og:description", content: "Confira os detalhes e valores do seu pedido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  server: {
    handlers: {
      GET: async () =>
        new Response(await checkoutHtml(), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
