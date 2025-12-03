-- Fix: Remover constraint NOT NULL da coluna nome_rota antes de dropar
DO $$ 
BEGIN
    -- Verificar se a coluna existe e remover NOT NULL
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tbrota' AND column_name = 'nome_rota') THEN
        ALTER TABLE tbrota ALTER COLUMN nome_rota DROP NOT NULL;
        ALTER TABLE tbrota DROP COLUMN nome_rota;
    END IF;
END $$;
