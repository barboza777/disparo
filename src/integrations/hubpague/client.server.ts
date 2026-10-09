const HUBPAGUE_API_URL = "https://api.hubpague.io/v1";

async function getHubpagueToken(): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("admin_settings")
    .select("hubpague_api_token")
    .eq("id", true)
    .single();

  if (error || !data?.hubpague_api_token) {
    const fallback = process.env.HUBPAGUE_API_TOKEN;
    if (!fallback) {
      throw new Error("Token Hubpague não configurado. Configure nas Configurações do painel admin.");
    }
    return fallback;
  }

  return data.hubpague_api_token;
}

interface HubpaguePaymentConfig {
  amount: number;
  customer_email: string;
  customer_name: string;
  customer_document?: string;
  description?: string;
  reference_id?: string;
  webhook_url?: string;
}

interface HubpaguePaymentResponse {
  id: string;
  status: string;
  payment_url?: string;
  qr_code?: string;
  [key: string]: unknown;
}

export async function createHubpaguePayment(
  config: HubpaguePaymentConfig,
): Promise<HubpaguePaymentResponse> {
  const token = await getHubpagueToken();

  const response = await fetch(`${HUBPAGUE_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: config.amount,
      customer: {
        email: config.customer_email,
        name: config.customer_name,
        document: config.customer_document,
      },
      description: config.description || "Pedido de compra",
      reference_id: config.reference_id,
      webhook_url: config.webhook_url,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao criar pagamento no Hubpague: ${response.statusText}`,
    );
  }

  return response.json() as Promise<HubpaguePaymentResponse>;
}

export async function getHubpaguePaymentStatus(
  paymentId: string,
): Promise<HubpaguePaymentResponse> {
  const token = await getHubpagueToken();

  const response = await fetch(`${HUBPAGUE_API_URL}/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar status de pagamento: ${response.statusText}`,
    );
  }

  return response.json() as Promise<HubpaguePaymentResponse>;
}

export async function verifyHubpagueWebhook(
  signature: string,
  payload: string,
): Promise<boolean> {
  const token = await getHubpagueToken();
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha256", token)
    .update(payload)
    .digest("hex");
  return hash === signature;
}
