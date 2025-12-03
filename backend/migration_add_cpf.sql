-- Script de migração para adicionar coluna CPF na tabela de usuários
-- Execute este script se você já tem o banco de dados criado

ALTER TABLE tbusuario ADD COLUMN IF NOT EXISTS cpfUser VARCHAR(14) UNIQUE;

-- Comentário sobre a migração
COMMENT ON COLUMN tbusuario.cpfUser IS 'CPF do usuário no formato XXX.XXX.XXX-XX';
