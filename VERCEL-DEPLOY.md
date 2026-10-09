# 🚀 Deploy na Vercel - Guia Passo a Passo

## ✅ Pré-requisitos

- [ ] Conta GitHub (https://github.com)
- [ ] Conta Vercel (https://vercel.com)
- [ ] Projeto descompactado
- [ ] Credenciais Supabase prontas
- [ ] Token UTMify: `Dc5wzLeH8RQnV6J7wzu4Y5ouU2l8puBgnc7g`

---

## 📋 PASSO 1: Preparar o Repositório GitHub

### 1.1 - Criar Repositório

1. Acesse: https://github.com/new
2. Nome do repositório: `seu-projeto-pix` (qualquer nome)
3. Descrição: "Sistema de pagamento PIX com Hubpague"
4. Selecione: **Public** (opcional)
5. Clique: **Create repository**

### 1.2 - Upload do Projeto

No seu computador, abra o terminal na pasta do projeto:

```bash
# Entrar na pasta
cd /Users/barboza/Downloads
unzip projeto-com-gateway-v3.zip
cd projeto-sem-gateway

# Inicializar Git
git init
git add .
git commit -m "Initial commit: PIX payment system with Hubpague integration"
git branch -M main

# Adicionar origem remota (copie da página do GitHub)
git remote add origin https://github.com/SEU_USUARIO/seu-projeto-pix.git

# Fazer push
git push -u origin main
```

> **Nota:** Substitua `SEU_USUARIO` pelo seu usuário do GitHub

---

## 🌐 PASSO 2: Conectar à Vercel

### 2.1 - Login na Vercel

1. Acesse: https://vercel.com/login
2. Clique: **Continue with GitHub**
3. Autorize a Vercel no GitHub

### 2.2 - Importar Projeto

1. Clique: **Add New...** → **Project**
2. Selecione seu repositório GitHub
3. Clique: **Import**

### 2.3 - Configurar Projeto

Na tela de configuração:

**Framework Preset:** Node.js  
**Root Directory:** `./` (deixar em branco)  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

> O Vercel detectará automaticamente. Clique Next.

---

## 🔐 PASSO 3: Configurar Variáveis de Ambiente

### 3.1 - Acessar Settings

1. Na dashboard da Vercel
2. Selecione seu projeto
3. Clique: **Settings**
4. Navegue: **Environment Variables**

### 3.2 - Adicionar Variáveis

Cole cada uma dessas variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
UTMIFY_API_TOKEN=Dc5wzLeH8RQnV6J7wzu4Y5ouU2l8puBgnc7g
UTMIFY_SIGNING_SECRET=seu_secret_aqui
HUBPAGUE_API_TOKEN=oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg
SEARCHAPI_CPF_TOKEN=1479
ORDER_WEBHOOK_SECRET=gere_uma_string_aleatoria_aqui
RECONCILIATION_TOKEN=gere_uma_string_aleatoria_aqui
```

> **Importante:** Pegue as credenciais Supabase em:
> Supabase Dashboard → Project Settings → API

---

## 🎯 PASSO 4: Deploy

### 4.1 - Fazer Deploy

1. De volta em **Deployments**
2. Você verá um deploy em progresso
3. Aguarde a conclusão (2-5 minutos)
4. Clique no link gerado: `https://seu-projeto.vercel.app`

### 4.2 - Testar Acesso

Acesse: `https://seu-projeto.vercel.app/auth`

Você deve ver a página de login. ✅

---

## 🔧 PASSO 5: Configurar Admin e Gateway

### 5.1 - Criar Conta Admin

1. Acesse: `https://seu-projeto.vercel.app/auth`
2. Faça login com sua conta Supabase
3. Confirme o email
4. Vá para: `/admin`

### 5.2 - Configurar Gateway

1. No painel admin, clique: **Configurações**
2. Procure: **Gateway de Pagamentos**
3. Cole os tokens:
   - **Hubpague:** `oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg`
   - **SearchAPI:** `1479`
4. Clique: **Salvar configurações** ✅

---

## 🧪 PASSO 6: Testar Pagamento

1. Acesse: `https://seu-projeto.vercel.app/pagamento`
2. Preencha um CPF válido (ex: 123.456.789-10)
3. Clique: **Gerar Pix**
4. Um QR Code deve aparecer ✅

---

## ⚡ Atualizações Futuras

Quando fizer mudanças no código:

```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

Vercel fará deploy automaticamente! 🚀

---

## 🆘 Troubleshooting

### "Module not found"
→ Rode `npm install` localmente antes de fazer push

### "Build failed"
→ Verifique os logs em Vercel → Deployments → logs

### "404 on routes"
→ Espere 5 minutos após o deploy ficar pronto

### "Gateway não funciona"
→ Verifique se os tokens estão corretos em Settings > Environment Variables

---

## 📞 URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Seu Site:** https://seu-projeto.vercel.app
- **Admin Panel:** https://seu-projeto.vercel.app/admin
- **Pagamento:** https://seu-projeto.vercel.app/pagamento

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Projeto feito push para GitHub
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy concluído com sucesso
- [ ] Conta admin criada
- [ ] Gateway configurado no painel
- [ ] Teste de pagamento funcionando

**Parabéns! 🎉 Seu site está ao vivo!**

---

**Versão:** 3.0
**Data:** 2026-10-09
