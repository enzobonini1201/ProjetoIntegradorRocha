-- Atualizar tabela de rotas com novos campos
ALTER TABLE tbrota DROP COLUMN IF EXISTS "nomeRota";
ALTER TABLE tbrota DROP COLUMN IF EXISTS "pedagios";
ALTER TABLE tbrota DROP COLUMN IF EXISTS "observacoes";

ALTER TABLE tbrota ADD COLUMN IF NOT EXISTS tipo_responsavel VARCHAR(20);
ALTER TABLE tbrota ADD COLUMN IF NOT EXISTS id_responsavel INTEGER;
ALTER TABLE tbrota ADD COLUMN IF NOT EXISTS nome_responsavel VARCHAR(200);
ALTER TABLE tbrota ADD COLUMN IF NOT EXISTS coordenadas_origem TEXT;
ALTER TABLE tbrota ADD COLUMN IF NOT EXISTS coordenadas_destino TEXT;
ALTER TABLE tbrota ADD COLUMN IF NOT EXISTS tempo_estimado_minutos INTEGER;

-- Renomear coluna se existir com nome antigo
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tbrota' AND column_name = 'tempoestimadohoras') THEN
        ALTER TABLE tbrota DROP COLUMN tempoestimadohoras;
    END IF;
END $$;

-- Atualizar colunas existentes para permitir NULL temporariamente
ALTER TABLE tbrota ALTER COLUMN origem DROP NOT NULL;
ALTER TABLE tbrota ALTER COLUMN destino DROP NOT NULL;
