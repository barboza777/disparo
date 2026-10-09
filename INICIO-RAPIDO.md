# ⚡ Início Rápido - Deploy Vercel

## 🎯 Resumo das Alterações

✅ **API de CPF** - SearchAPI (token: 1479)
✅ **Gateway** - Hubpague integrado
✅ **UTMify** - Token atualizado: `Dc5wzLeH8RQnV6J7wzu4Y5ouU2l8puBgnc7g`
✅ **Painel Admin** - Com configuração de gateway

---

## 🚀 3 Passos para Colocar Online

### PASSO 1: GitHub (5 min)

```bash
# Terminal no seu computador

cd /Users/barboza/Downloads
unzip projeto-com-gateway-v3.zip
cd projeto-sem-gateway

# Criar repositório em: https://github.com/new
# Depois executar:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USER/SEU_REPO.git
git push -u origin main
```

> Substitua `SEU_USER` e `SEU_REPO` pelos seus dados

### PASSO 2: Vercel (2 min)

1. Acesse: https://vercel.com/new
2. Conecte seu GitHub
3. Selecione o repositório
4. Clique: **Deploy**

Vercel detecta tudo automaticamente ✅

### PASSO 3: Variáveis de Ambiente (3 min)

No Vercel, clique em **Settings → Environment Variables**

Cole estas variáveis:

```
VITE_SUPABASE_URL=seu_url_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
SUPABASE_URL=seu_url_supabase
SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta

UTMIFY_API_TOKEN=Dc5wzLeH8RQnV6J7wzu4Y5ouU2l8puBgnc7g
UTMIFY_SIGNING_SECRET=seu_secret

HUBPAGUE_API_TOKEN=oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg
SEARCHAPI_CPF_TOKEN=1479
ORDER_WEBHOOK_SECRET=qualquer_string_aleatoria
RECONCILIATION_TOKEN=qualquer_string_aleatoria
```

---

## ✅ Pronto!

Seu site estará em: `https://seu-projeto.vercel.app`

### Próximos passos:

1. Acesse: `https://seu-projeto.vercel.app/auth`
2. Crie conta admin
3. Vá em **Configurações**
4. Configure o gateway (tokens já pré-preenchidos)
5. Salve ✅

---

## 📞 Onde Conseguir Credenciais Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em: **Settings → API**
4. Copie:
   - `Project URL` = SUPABASE_URL
   - `anon public` = PUBLISHABLE_KEY
   - `service_role secret` = SERVICE_ROLE_KEY

---

## 🎉 Tudo Pronto!

Seu sistema está 100% funcional e online! 🚀

---

**Arquivo:** `projeto-com-gateway-v3.zip`  
**Versão:** 3.0  
**Status:** Pronto para produção ✅
