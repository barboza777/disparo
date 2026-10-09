const fallbackLogoUrl = "/assets/cabecalho-logo.jpg";

export async function getHeaderLogoUrl() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("admin_settings")
    .select("header_logo_path")
    .eq("id", true)
    .maybeSingle();

  if (!data?.header_logo_path) return fallbackLogoUrl;

  const { data: signed } = await supabaseAdmin.storage
    .from("site-branding")
    .createSignedUrl(data.header_logo_path, 3600);

  return signed?.signedUrl ?? fallbackLogoUrl;
}

export async function getBrandingAssetUrls() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("admin_settings")
    .select("header_logo_path,banner_primary_path,banner_secondary_path")
    .eq("id", true)
    .maybeSingle();

  const sign = async (path: string | null | undefined, fallback = "") => {
    if (!path) return fallback;
    const { data: signed } = await supabaseAdmin.storage.from("site-branding").createSignedUrl(path, 3600);
    return signed?.signedUrl ?? fallback;
  };

  return {
    headerLogoUrl: await sign(data?.header_logo_path, fallbackLogoUrl),
    primaryBannerUrl: await sign(data?.banner_primary_path),
    secondaryBannerUrl: await sign(data?.banner_secondary_path),
  };
}