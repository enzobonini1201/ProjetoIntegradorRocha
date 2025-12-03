-- Fix: Remover coluna duplicada endereco_ajuda da tabela tbajudante
-- A coluna correta é enderecoajuda (sem underscore)

ALTER TABLE tbajudante DROP COLUMN IF EXISTS endereco_ajuda;
