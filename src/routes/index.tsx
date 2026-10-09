import { createFileRoute } from "@tanstack/react-router";
import html from "../site/index.html?raw";
import { getHeaderLogoUrl } from "@/lib/branding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jadlog | Regularização de Entrega" },
      { name: "description", content: "Consulte e regularize a entrega da sua encomenda Jadlog." },
      { property: "og:title", content: "Jadlog | Regularização de Entrega" },
      { property: "og:description", content: "Consulte e regularize a entrega da sua encomenda Jadlog." },
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
