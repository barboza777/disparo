# 🔗 Integrações Ativas

## ✅ Gateway Hubpague

**Status:** ✅ Integrado e Funcionando

- **Token:** `oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg`
- **URL API:** `https://api.hubpague.io/v1`
- **Funcionalidades:**
  - ✅ Gerar PIX com QR Code
  - ✅ Verificar status de pagamento
  - ✅ Reconciliação automática
  - ✅ Integração com Supabase

### Arquivos de Integração
- `src/integrations/hubpague/client.server.ts` - Cliente da API
- `src/routes/api/public/pix.ts` - Endpoint de geração de PIX
- `src/routes/api/public/pix-status.ts` - Endpoint de status

## ✅ API de CPF - SearchAPI

**Status:** ✅ Integrado e Funcionando

- **URL:** `https://searchapi.it.com/consulta`
- **Token:** `1479`
- **Funcionalidades:**
  - ✅ Consulta de dados por CPF
  - ✅ Validação de CPF
  - ✅ Extração de nome

### Arquivo de Integração
- `src/routes/api/public/cpf.ts` - Endpoint de consulta CPF

## ✅ Supabase

**Status:** ✅ Integrado

- Autenticação de admin
- Armazenamento de pedidos de pagamento
- Configurações de branding
- Reconciliação de pagamentos

### Arquivos
- `src/integrations/supabase/client.server.ts`
- `src/integrations/supabase/auth-middleware.ts`

## ✅ UTMify

**Status:** ✅ Integrado

- Rastreamento de vendas
- Reconciliação de pagamentos
- Integração com CRM

### Arquivo
- `src/lib/utmify.server.ts`

## 🔐 Segurança

- ✅ HMAC SHA256 para webhook verification
- ✅ Bearer Token para Hubpague
- ✅ CORS habilitado para API pública
- ✅ Validação de entrada em todos endpoints

## 📊 Fluxo de Pagamento

```
1. Cliente acessa /pagamento
2. Insere CPF e clica "Gerar Pix"
3. Sistema valida CPF via SearchAPI
4. Sistema cria pagamento via Hubpague
5. QR Code é exibido
6. Sistema monitora status a cada 5s
7. Webhook Hubpague notifica confirmação
8. Sistema integra com UTMify
9. Pedido marcado como pago
```

## 📝 Variáveis de Ambiente Necessárias

```bash
HUBPAGUE_API_TOKEN=oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg
SEARCHAPI_CPF_TOKEN=1479
SUPABASE_URL=sua_url
SUPABASE_SERVICE_ROLE_KEY=sua_chave
UTMIFY_API_TOKEN=seu_token
UTMIFY_SIGNING_SECRET=seu_secret
```

## 🚀 Deploy Vercel

1. Conecte o repositório à Vercel
2. Configure as variáveis de ambiente
3. O build e deploy acontecem automaticamente

## ✨ Funcionalidades Preservadas

- ✅ Painel Admin completo
- ✅ Autenticação de admin
- ✅ Configuração de branding
- ✅ Upload de imagens
- ✅ Histórico de pedidos
- ✅ Reconciliação de pagamentos
- ✅ Tracking de campanhas

---

**Última atualização:** 2026-10-09
**Versão:** 2.0 (com Hubpague + SearchAPI)
