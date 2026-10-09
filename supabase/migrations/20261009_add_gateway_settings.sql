-- Adicionar colunas para configuração do Gateway Hubpague
ALTER TABLE admin_settings
ADD COLUMN IF NOT EXISTS hubpague_api_token TEXT,
ADD COLUMN IF NOT EXISTS searchapi_cpf_token TEXT;

-- Comentários para documentação
COMMENT ON COLUMN admin_settings.hubpague_api_token IS 'Token da API Hubpague para processamento de pagamentos';
COMMENT ON COLUMN admin_settings.searchapi_cpf_token IS 'Token da API SearchAPI para validação de CPF';
