import { createFileRoute } from "@tanstack/react-router";
import html from "../site/status.html?raw";
import { getHeaderLogoUrl } from "@/lib/branding";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status da Entrega | Jadlog" },
      { name: "description", content: "Acompanhe o status e as pendências da sua entrega Jadlog." },
      { property: "og:title", content: "Status da Entrega | Jadlog" },
      { property: "og:description", content: "Acompanhe o status e as pendências da sua entrega Jadlog." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  server: {
    handlers: {
      GET: async () =>
        new Response(html.replaceAll("{{HEADER_LOGO_URL}}", await getHeaderLogoUrl()), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
