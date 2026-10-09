import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type AdminLoginProps = {
  warningBannerText: string;
  attentionTitle: string;
};

export function AdminLogin({ warningBannerText, attentionTitle }: AdminLoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      const unavailable = /fetch|network|timeout|unavailable/i.test(error.message);
      setMessage(unavailable ? "O acesso está temporariamente indisponível. Tente novamente em alguns minutos." : "E-mail ou senha inválidos.");
      return;
    }
    await navigate({ to: "/admin" });
  }

  async function resetPassword() {
    if (!email) return setMessage("Informe seu e-mail para recuperar o acesso.");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setMessage(error ? "Não foi possível enviar o e-mail." : "Enviamos o link de recuperação para seu e-mail.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 px-4 py-10">
      <section className="w-full max-w-sm rounded-lg border bg-card p-7 shadow-sm">
        <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-md bg-destructive text-destructive-foreground">
          <KeyRound className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold uppercase text-destructive">{warningBannerText}</p>
        <h1 className="mt-2 text-2xl font-semibold">Painel administrativo</h1>
        <p className="mt-2 text-sm text-muted-foreground">{attentionTitle}</p>
        <form className="mt-7 space-y-4" onSubmit={signIn}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" autoComplete="email" className="pl-9" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {message && <p className="rounded-md bg-muted px-3 py-2 text-xs" role="status">{message}</p>}
          <Button className="w-full" variant="destructive" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <>Entrar <ArrowRight /></>}</Button>
          <Button type="button" variant="ghost" className="w-full" onClick={resetPassword} disabled={busy}>Esqueci minha senha</Button>
        </form>
      </section>
    </main>
  );
}