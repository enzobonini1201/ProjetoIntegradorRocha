-- Migration: Adicionar campos de responsáveis (motorista/agregado) para coleta e entrega em notas
-- Data: 2025-12-03

-- Adicionar campos para COLETADO POR
ALTER TABLE tbnotas ADD COLUMN tipo_coletador VARCHAR(20);
ALTER TABLE tbnotas ADD COLUMN id_coletador BIGINT;
ALTER TABLE tbnotas ADD COLUMN nome_coletador VARCHAR(200);

-- Adicionar campos para ENTREGUE POR
ALTER TABLE tbnotas ADD COLUMN tipo_entregador VARCHAR(20);
ALTER TABLE tbnotas ADD COLUMN id_entregador BIGINT;
ALTER TABLE tbnotas ADD COLUMN nome_entregador VARCHAR(200);

-- Comentários explicativos
COMMENT ON COLUMN tbnotas.tipo_coletador IS 'Tipo do responsável pela coleta: motorista ou agregado';
COMMENT ON COLUMN tbnotas.id_coletador IS 'ID do motorista ou agregado que coletou';
COMMENT ON COLUMN tbnotas.nome_coletador IS 'Nome do responsável pela coleta';
COMMENT ON COLUMN tbnotas.tipo_entregador IS 'Tipo do responsável pela entrega: motorista ou agregado';
COMMENT ON COLUMN tbnotas.id_entregador IS 'ID do motorista ou agregado que entregou';
COMMENT ON COLUMN tbnotas.nome_entregador IS 'Nome do responsável pela entrega';

-- Verificar resultado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tbnotas' 
  AND column_name IN ('tipo_coletador', 'id_coletador', 'nome_coletador', 'tipo_entregador', 'id_entregador', 'nome_entregador')
ORDER BY ordinal_position;
