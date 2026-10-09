import { createServerFn } from "@tanstack/react-start";

const fallbackContent = {
  warningBannerText: "Área restrita",
  attentionTitle: "Entre com a conta autorizada para acompanhar os pedidos.",
};

export const getAuthenticationContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("admin_settings")
      .select("warning_banner_text,attention_title")
      .eq("id", true)
      .maybeSingle();

    if (error || !data) return fallbackContent;

    return {
      warningBannerText: data.warning_banner_text?.trim() || fallbackContent.warningBannerText,
      attentionTitle: data.attention_title?.trim() || fallbackContent.attentionTitle,
    };
  } catch {
    return fallbackContent;
  }
});