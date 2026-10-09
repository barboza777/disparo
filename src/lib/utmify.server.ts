import { createHmac, timingSafeEqual } from "node:crypto";

const UTMIFY_ENDPOINT = "https://api.utmify.com.br/api-credentials/orders";
const PRODUCT_ID = "jadlog-regularizacao-tarifa";
const PRODUCT_NAME = "Regularização de Tarifa - Jadlog";

export type TrackingParameters = {
  src: string | null;
  sck: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

export type UtmifyOrder = {
  orderId: string;
  createdAt: string;
  amountInCents: number;
  customer: {
    name: string;
    email: string;
    document: string | null;
    ip?: string;
  };
  trackingParameters: TrackingParameters;
};

function utcDate(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createOrderToken(order: UtmifyOrder) {
  const secret = process.env["UTMIFY_SIGNING_SECRET"] ?? "";
  if (!secret) return null;
  const payload = encode(JSON.stringify(order));
  return `${payload}.${signature(payload, secret)}`;
}

export function readOrderToken(token: string): UtmifyOrder | null {
  const secret = process.env["UTMIFY_SIGNING_SECRET"] ?? "";
  const [payload, suppliedSignature] = token.split(".");
  if (!secret || !payload || !suppliedSignature) return null;

  const expectedSignature = signature(payload, secret);
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as UtmifyOrder;
  } catch {
    return null;
  }
}

export async function sendUtmifyOrder(
  order: UtmifyOrder,
  status: "waiting_payment" | "paid",
) {
  const apiToken = process.env["UTMIFY_API_TOKEN"] ?? "";
  if (!apiToken) {
    console.error("UTMify: UTMIFY_API_TOKEN não configurado");
    return false;
  }

  const response = await fetch(UTMIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": apiToken,
    },
    body: JSON.stringify({
      orderId: order.orderId,
      platform: "Jadlog",
      paymentMethod: "pix",
      status,
      createdAt: order.createdAt,
      approvedDate: status === "paid" ? utcDate() : null,
      refundedAt: null,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: null,
        document: order.customer.document,
        country: "BR",
        ...(order.customer.ip ? { ip: order.customer.ip } : {}),
      },
      products: [
        {
          id: PRODUCT_ID,
          name: PRODUCT_NAME,
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: order.amountInCents,
        },
      ],
      trackingParameters: order.trackingParameters,
      commission: {
        totalPriceInCents: order.amountInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: order.amountInCents,
        currency: "BRL",
      },
      isTest: false,
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 1_000);
    console.error(`UTMify: falha ao enviar ${status} (${response.status}): ${detail}`);
    return false;
  }
  return true;
}

export function currentUtcDate() {
  return utcDate();
}