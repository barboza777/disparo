import { createFileRoute } from "@tanstack/react-router";

function findName(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const key of ["nome", "name", "nomeCompleto", "nome_completo"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim().length > 1) {
      return candidate.trim();
    }
  }
  for (const child of Object.values(record)) {
    const found = findName(child);
    if (found) return found;
  }
  return null;
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
};

export const Route = createFileRoute("/api/public/cpf")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 200, headers: cors }),
      GET: async ({ request }) => {
        const cpf = (new URL(request.url).searchParams.get("cpf") ?? "").replace(/\D/g, "");
        if (cpf.length !== 11) {
          return new Response(JSON.stringify({ error: "CPF inválido" }), {
            status: 400,
            headers: cors,
          });
        }
        try {
          const token = "1479";
          const response = await fetch(
            `https://searchapi.it.com/consulta?token_api=${token}&cpf=${encodeURIComponent(cpf)}`,
          );
          const raw = await response.text();
          let data: unknown;
          try {
            data = JSON.parse(raw);
          } catch {
            data = null;
          }
          if (!response.ok) {
            return new Response(JSON.stringify({ error: "Não foi possível consultar este CPF" }), {
              status: response.status,
              headers: cors,
            });
          }
          const nome = findName(data);
          if (!nome) {
            return new Response(JSON.stringify({ error: "CPF não localizado" }), {
              status: 404,
              headers: cors,
            });
          }
          return new Response(JSON.stringify({ nome }), { status: 200, headers: cors });
        } catch (e) {
          return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: cors,
          });
        }
      },
    },
  },
});
