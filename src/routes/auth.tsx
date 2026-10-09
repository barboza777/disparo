import { createFileRoute } from "@tanstack/react-router";

import { AdminLogin } from "@/components/admin-login";
import { getAuthenticationContent } from "@/lib/auth-content.functions";

export const Route = createFileRoute("/auth")({
  loader: () => getAuthenticationContent(),
  head: () => ({ meta: [
    { title: "Acesso administrativo | Central de pedidos" },
    { name: "description", content: "Acesso restrito ao painel administrativo de pedidos." },
    { property: "og:title", content: "Acesso administrativo | Central de pedidos" },
    { property: "og:description", content: "Acesso restrito ao painel administrativo de pedidos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  return <AdminLogin {...Route.useLoaderData()} />;
}