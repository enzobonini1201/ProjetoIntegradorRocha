-- Adicionar colunas para tipo e ID do responsável na tabela de transportes

-- Adicionar coluna tipoResponsavel (motorista ou agregado)
ALTER TABLE tbtransporte ADD COLUMN IF NOT EXISTS tipoResponsavel VARCHAR(20);

-- Adicionar coluna idResponsavel (ID do motorista ou agregado)
ALTER TABLE tbtransporte ADD COLUMN IF NOT EXISTS idResponsavel BIGINT;

-- Adicionar coluna nomeResponsavel (nome do motorista ou agregado)
ALTER TABLE tbtransporte ADD COLUMN IF NOT EXISTS nomeResponsavel VARCHAR(200);

-- Atualizar registros existentes (opcional - define como 'motorista' se já tem responsavel_trans)
UPDATE tbtransporte 
SET tipoResponsavel = 'motorista', 
    idResponsavel = 0,
    nomeResponsavel = responsavel_trans
WHERE tipoResponsavel IS NULL AND responsavel_trans IS NOT NULL;

-- Após a migração, você pode opcionalmente tornar as colunas NOT NULL
-- ALTER TABLE tbtransporte ALTER COLUMN tipoResponsavel SET NOT NULL;
-- ALTER TABLE tbtransporte ALTER COLUMN idResponsavel SET NOT NULL;
