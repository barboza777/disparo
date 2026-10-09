import { createFileRoute } from "@tanstack/react-router";
import { createHubpaguePayment } from "@/integrations/hubpague/client.server";
import { savePaymentOrder } from "@/lib/payment-reconciliation.server";
import type { UtmifyOrder } from "@/lib/utmify.server";

interface PixRequest {
  amount: number;
  description?: string;
  customer: {
    name: string;
    document?: string;
    email?: string;
  };
  trackingParameters?: Record<string, string | null>;
}

export const Route = createFileRoute("/api/public/pix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as PixRequest;

          if (!body.customer?.name) {
            return Response.json(
              { error: "Nome do cliente obrigatório" },
              { status: 400 },
            );
          }

          const amount = Math.round((body.amount || 0) * 100);
          if (amount <= 0) {
            return Response.json(
              { error: "Valor do pagamento inválido" },
              { status: 400 },
            );
          }

          const paymentResponse = await createHubpaguePayment({
            amount,
            customer_name: body.customer.name,
            customer_email: body.customer.email || "nao-informado@email.com",
            customer_document: body.customer.document,
            description: body.description || "Pedido de compra",
            reference_id: `order_${Date.now()}`,
          });

          const order: UtmifyOrder = {
            orderId: paymentResponse.id,
            createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
            amountInCents: amount,
            customer: {
              name: body.customer.name,
              email: body.customer.email || "nao-informado@email.com",
              document: body.customer.document,
            },
            trackingParameters: (body.trackingParameters || {}) as Record<string, string | null>,
          };

          await savePaymentOrder(order);

          return Response.json({
            data: {
              deposit: {
                txid: paymentResponse.id,
                pix_code: paymentResponse.qr_code || "",
                qr_code: paymentResponse.qr_code || "",
                copy_paste: paymentResponse.qr_code || "",
                status: "pending",
                provider_response: JSON.stringify(paymentResponse),
              },
            },
            orderToken: paymentResponse.id,
          });
        } catch (error) {
          console.error("Erro ao gerar PIX:", error);
          return Response.json(
            {
              error: error instanceof Error
                ? error.message
                : "Erro ao gerar PIX",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
