import { createFileRoute } from "@tanstack/react-router";
import html from "../site/pix-pendente.html?raw";
import { getBrandingAssetUrls } from "@/lib/branding";

const formatMoney = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? "");

async function pendingPixHtml() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [assets, { data }] = await Promise.all([
    getBrandingAssetUrls(),
    supabaseAdmin.from("admin_settings").select("processing_fee_cents,icms_fee_cents,federal_fee_cents").eq("id", true).maybeSingle(),
  ]);
  const total = data ? data.processing_fee_cents + data.icms_fee_cents + data.federal_fee_cents : 5835;
  return html
    .replaceAll("{{PRIMARY_BANNER_URL}}", assets.primaryBannerUrl)
    .replaceAll("R$ 58,35", formatMoney(total));
}

export const Route = createFileRoute("/pix-pendente")({
  head: () => ({ meta: [
    { title: "Pix pendente | Área segura" },
    { name: "description", content: "Acompanhe e conclua seu pagamento Pix." },
    { property: "og:title", content: "Pix pendente | Área segura" },
    { property: "og:description", content: "Acompanhe e conclua seu pagamento Pix." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  server: { handlers: { GET: async () => new Response(await pendingPixHtml(), { headers: { "Content-Type": "text/html; charset=utf-8" } }) } },
});
