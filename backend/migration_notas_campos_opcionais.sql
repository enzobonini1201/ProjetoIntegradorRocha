-- Permitir valores NULL nos campos entreguepor_nota e dataentrega_nota
ALTER TABLE tbnotas ALTER COLUMN entreguepor_nota DROP NOT NULL;
ALTER TABLE tbnotas ALTER COLUMN dataentrega_nota DROP NOT NULL;
