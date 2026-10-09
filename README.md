# Projeto completo sem gateway de pagamentos

Esta cópia preserva as telas, fluxo de CPF, painel administrativo, login compartilhado em `/auth` e `/autenticacao`, código de envio à UTMify, registro de pedidos e estrutura de dados. O site original não foi alterado.

## Limites importantes
- O gateway foi removido: criação de Pix e consulta de pagamento retornam HTTP 503, sem cobranças nem aprovações simuladas.
- Credenciais privadas não podem ser exportadas. `.env.example` contém apenas nomes e valores vazios. Cadastre seus próprios valores no ambiente seguro da nova hospedagem.
- Dados de clientes, contas, senhas, vendas, configurações atuais e arquivos privados do armazenamento não estão incluídos: este é um download de código-fonte, não uma cópia do banco de dados.
- A consulta de CPF e UTMify mantêm seu código, mas exigem credenciais válidas. A ausência de gateway impede aprovação automática por um adquirente.
- A conexão de dados e autenticação exige um backend compatível configurado na nova hospedagem. A chave privilegiada do Lovable Cloud não está disponível para exportação; configure as credenciais do seu novo backend.

## Execução
Use Node.js 22 ou posterior e Bun.

```sh
bun install
bun run dev
bun run build
bun run start
```

Configure as variáveis listadas em `.env.example` antes da execução. As variáveis VITE são públicas e inseridas durante a compilação; as demais permanecem exclusivamente no servidor.

As migrações em `supabase/migrations` preservam as tabelas e políticas existentes; o job antigo que consultava o gateway foi excluído. No novo backend, aplique as migrações em ordem e crie um bucket privado `site-branding` para os uploads do painel. Crie a conta administrativa pelo serviço de autenticação e atribua a função admin em `public.user_roles` por um procedimento administrativo confiável. Não existe senha administrativa padrão no arquivo.

## UTMify e webhooks sem gateway
O envio à UTMify mantém `UTMIFY_API_TOKEN`, `UTMIFY_SIGNING_SECRET`, estados `waiting_payment` e `paid`, parâmetros de campanha e registro de envio. Nenhum evento de aprovação é enviado apenas por clicar em um botão.

Um sistema de pedidos confiável pode enviar eventos para `POST /api/public/utmify-webhook`. Este é um receptor genérico novo, não um webhook nativo da UTMify e não uma integração com adquirente.

Cabeçalhos:
- `Content-Type: application/json`
- `X-Order-Timestamp`: instante Unix em segundos, tolerância de 5 minutos.
- `X-Order-Signature`: `sha256=` seguido do HMAC-SHA256 hexadecimal de `${timestamp}.${corpoJSONExato}`, usando `ORDER_WEBHOOK_SECRET` compartilhado entre os dois sistemas.

Corpo:
```json
{
  "status": "waiting_payment",
  "order": {
    "orderId": "pedido-exemplo-001",
    "createdAt": "2026-10-09T10:37:00Z",
    "amountInCents": 100,
    "customer": { "name": "Cliente de exemplo", "email": "cliente@example.com", "document": null },
    "trackingParameters": { "src": null, "sck": null, "utm_source": null, "utm_campaign": null, "utm_medium": null, "utm_content": null, "utm_term": null }
  }
}
```
Somente o sistema confiável deve enviar `paid` após confirmação real. Não coloque o segredo no navegador. A aprovação usa o bloqueio de envio existente para limitar duplicidades; reenvio pendente sequencial é ignorado quando já registrado. Concorrência de eventos pendentes pode gerar tentativas repetidas, sempre com o mesmo orderId.

`POST /api/public/reconcile-payments` requer `Authorization: Bearer <RECONCILIATION_TOKEN>` e tenta reenviar apenas pedidos já marcados como pagos no banco. Ele não consulta adquirentes nem descobre pagamentos novos. Configure um agendador externo se quiser repetir os envios automaticamente.

## Arquivos e visual
As imagens enviadas ao editor foram incluídas em `public/assets`; QR library está em `public/qrcode.min.js`. As fontes Google continuam externas. Banners personalizados e dados atuais do painel devem ser migrados separadamente pelo proprietário, sem divulgar URLs assinadas ou dados privados.

## Verificação
O pacote foi inspecionado para excluir gateway, credenciais privadas, histórico Git, dependências e resultados de compilação. Testes de APIs externas reais, login e banco exigem configuração da nova hospedagem e não foram realizados neste download.
