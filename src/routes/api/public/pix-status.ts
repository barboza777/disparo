import { createFileRoute } from "@tanstack/react-router";
import { getHubpaguePaymentStatus } from "@/integrations/hubpague/client.server";
import { reconcilePayment, extractGatewayStatus } from "@/lib/payment-reconciliation.server";

export const Route = createFileRoute("/api/public/pix-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const txid = url.searchParams.get("txid");

          if (!txid) {
            return Response.json(
              { error: "txid obrigatório" },
              { status: 400 },
            );
          }

          const paymentData = await getHubpaguePaymentStatus(txid);
          const normalizedStatus = extractGatewayStatus(paymentData);

          await reconcilePayment(txid, {
            response: new Response(null, { status: 200 }),
            text: JSON.stringify(paymentData),
            data: paymentData,
            normalizedStatus,
          });

          return Response.json({
            data: {
              deposit: {
                txid,
                status: normalizedStatus,
                provider_response: JSON.stringify(paymentData),
              },
            },
            normalizedStatus,
            status: normalizedStatus,
          });
        } catch (error) {
          console.error("Erro ao buscar status do PIX:", error);
          return Response.json(
            {
              error: error instanceof Error
                ? error.message
                : "Erro ao buscar status",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
