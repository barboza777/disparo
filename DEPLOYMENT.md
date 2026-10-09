# Guia de Deployment - Vercel

## ✅ Alterações Realizadas

1. **API de CPF** - Atualizada para `searchapi.it.com` com token `1479`
2. **Gateway Hubpague** - Integrado com token `oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg`
3. **Endpoints de Pagamento** - `/api/public/pix` e `/api/public/pix-status` totalmente funcionais
4. **Reconciliação de Pagamentos** - Mantida a integração com Supabase e UTMify
5. **Painel Admin** - Totalmente preservado e funcional
6. **Imagens e Assets** - Preservados

## 🚀 Deploy na Vercel

### Passo 1: Preparar o Repositório

1. Conecte seu repositório GitHub à Vercel
2. Ou faça upload desta pasta como um novo projeto

### Passo 2: Configurar Variáveis de Ambiente

Na dashboard da Vercel, acesse **Settings > Environment Variables** e adicione:

```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
SUPABASE_URL=sua_url_supabase
SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta
UTMIFY_API_TOKEN=seu_token_utmify
UTMIFY_SIGNING_SECRET=seu_secret_utmify
HUBPAGUE_API_TOKEN=oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg
SEARCHAPI_CPF_TOKEN=1479
ORDER_WEBHOOK_SECRET=seu_webhook_secret
RECONCILIATION_TOKEN=seu_reconciliation_token
```

### Passo 3: Build e Deploy

1. Vercel detectará automaticamente como fazer build
2. Execute: `npm install && npm run build`
3. Deploy automático após cada push

## 📝 Configuração de Webhooks Hubpague

Após fazer deploy, configure o webhook do Hubpague para:

```
https://seu-dominio-vercel.vercel.app/api/public/pix-status
```

## 🔍 Verificar Status do Pagamento

O sistema verifica o status do pagamento a cada 5 segundos automaticamente.

Para verificar manualmente:
```
GET /api/public/pix-status?txid=ID_DA_TRANSACAO
```

## 📱 Endpoints Disponíveis

- **POST** `/api/public/pix` - Gera um PIX
- **GET** `/api/public/pix-status` - Verifica status do pagamento
- **POST** `/api/public/cpf` - Valida CPF via SearchAPI

## ⚡ Dicas Importantes

1. As imagens e branding são carregados via URL
2. O painel admin continua em `/admin`
3. Supabase deve estar configurado e ativo
4. UTMify deve estar configurado para reconciliação

## 🛠️ Troubleshooting

Se houver erro ao gerar PIX:
1. Verifique se HUBPAGUE_API_TOKEN está correto
2. Verifique conexão com Supabase
3. Verifique logs da Vercel (Settings > Functions > Logs)

## 📞 Suporte

Para mais informações:
- Hubpague: https://app.hubpague.io/docs/api
- SearchAPI: https://searchapi.it.com
