import { createFileRoute } from "@tanstack/react-router";

import { AdminLogin } from "@/components/admin-login";
import { getAuthenticationContent } from "@/lib/auth-content.functions";

export const Route = createFileRoute("/autenticacao")({
  loader: () => getAuthenticationContent(),
  head: () => ({ meta: [
    { title: "Autenticação | Painel administrativo" },
    { name: "description", content: "Acesso restrito ao painel administrativo." },
    { property: "og:title", content: "Autenticação | Painel administrativo" },
    { property: "og:description", content: "Acesso restrito ao painel administrativo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthenticationPage,
});

function AuthenticationPage() {
  return <AdminLogin {...Route.useLoaderData()} />;
}