# 📊 Configuração do Painel Admin

## 🚀 Primeiro Acesso

Após fazer deploy na Vercel, acesse:
```
https://seu-dominio.vercel.app/auth
```

### Criar Conta Admin

1. Faça login com sua conta Supabase
2. Na primeira vez, você será redirecionado para criar uma conta de admin
3. Confirme o email
4. Acesse o painel em: `/admin`

## ⚙️ Configurar Gateway de Pagamentos

No painel admin, clique em **"Configurações"** e procure pela seção **"Gateway de Pagamentos"**.

### 1️⃣ Token Hubpague

- Cole seu token: `oJsYbjnyPGe1bohgPeaAYNy4PX5Cx6cAn33VgIdg`
- Este token é armazenado com segurança no banco de dados

### 2️⃣ Token SearchAPI CPF

- Cole o token: `1479`
- Usado para validação de CPF dos clientes

### 3️⃣ Salvar Configurações

Clique em **"Salvar configurações"** e pronto! ✅

**O sistema usará automaticamente essas credenciais em todos os pagamentos.**

## 📱 Abas do Painel Admin

### Visão Geral
- Métricas de pedidos e conversão
- Receita aprovada e pendente
- Gráfico dos últimos 7 dias
- Status das integrações

### Pedidos
- Lista completa de pedidos
- Filtrar por cliente ou código
- Filtrar por status (pagos/pendentes)
- Status na integração UTMify

### Configurações
- **Gateway** - Tokens do Hubpague e SearchAPI
- **Identidade Visual** - Logo e banners
- **Textos** - Personalizações de página
- **Políticas** - Links do rodapé
- **Dados de Cobrança** - Razão social, CNPJ, telefone, taxas

## 🔐 Segurança

✅ Tokens são armazenados apenas no banco de dados (nunca em variáveis públicas)
✅ Apenas usuários com role "admin" podem acessar o painel
✅ Todas as requisições têm autenticação obrigatória
✅ As credenciais nunca são expostas no frontend

## 🔄 Fluxo de Pagamento com Gateway Configurado

```
1. Cliente clica em "Gerar Pix"
2. Sistema busca token Hubpague do banco ✅
3. API Hubpague cria PIX e retorna QR Code
4. Cliente escaneia QR Code e paga
5. Webhook Hubpague confirma pagamento
6. Sistema reconcilia com UTMify
7. Pedido marcado como "Pago"
```

## ⚠️ Erros Comuns

**"Token não configurado"**
- Vá em Configurações > Gateway de Pagamentos
- Preencha os tokens obrigatórios
- Salve as alterações

**"Não foi possível gerar o Pix"**
- Verifique se o token Hubpague está correto
- Verifique conexão com a internet
- Verifique logs da Vercel (Settings > Functions > Logs)

## 📞 Suporte

- Hubpague API: https://app.hubpague.io/docs/api
- SearchAPI: https://searchapi.it.com

---

**Versão:** 3.0 com Painel Admin Integrado
**Data:** 2026-10-09
