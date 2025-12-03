-- Migration: Substituir campo CEP por Endereço Completo nas tabelas tbajudante e tbagregado
-- Data: 02/12/2025

-- Adicionar coluna enderecoAjuda na tabela tbajudante
ALTER TABLE tbajudante ADD COLUMN endereco_ajuda VARCHAR(200);

-- Copiar dados do CEP para o novo campo de endereço (temporariamente)
UPDATE tbajudante SET endereco_ajuda = cep_ajuda WHERE cep_ajuda IS NOT NULL;

-- Tornar a coluna obrigatória após popular os dados
ALTER TABLE tbajudante ALTER COLUMN endereco_ajuda SET NOT NULL;

-- Remover a coluna antiga de CEP
ALTER TABLE tbajudante DROP COLUMN cep_ajuda;

-- Adicionar coluna enderecoAgre na tabela tbagregado
ALTER TABLE tbagregado ADD COLUMN endereco_agre VARCHAR(200);

-- Copiar dados do CEP para o novo campo de endereço (temporariamente)
UPDATE tbagregado SET endereco_agre = cep_agre WHERE cep_agre IS NOT NULL;

-- Tornar a coluna obrigatória após popular os dados
ALTER TABLE tbagregado ALTER COLUMN endereco_agre SET NOT NULL;

-- Remover a coluna antiga de CEP
ALTER TABLE tbagregado DROP COLUMN cep_agre;
