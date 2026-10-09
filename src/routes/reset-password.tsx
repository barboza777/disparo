import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Redefinir senha | Central de pedidos" },
    { name: "description", content: "Crie uma nova senha para sua conta administrativa." },
    { property: "og:title", content: "Redefinir senha | Central de pedidos" },
    { property: "og:description", content: "Crie uma nova senha para sua conta administrativa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("Validando link…");
  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    supabase.auth.getSession().then(({ data }) => {
      const ok = recovery || Boolean(data.session);
      setValid(ok);
      setMessage(ok ? "" : "Este link expirou ou não é válido.");
    });
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMessage("Não foi possível alterar a senha.");
    await navigate({ to: "/admin" });
  }
  return <main className="grid min-h-screen place-items-center bg-muted/40 px-4"><form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-lg border bg-card p-7"><div><h1 className="text-2xl font-semibold">Nova senha</h1><p className="mt-2 text-sm text-muted-foreground">Escolha uma senha segura para continuar.</p></div>{message && <p className="text-sm">{message}</p>}{valid && <><div className="space-y-2"><Label htmlFor="new-password">Nova senha</Label><Input id="new-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></div><Button className="w-full" variant="destructive">Salvar nova senha</Button></>}</form></main>;
}