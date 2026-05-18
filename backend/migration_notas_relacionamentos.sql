-- Ajustes de schema para o novo cadastro de notas pela tela de rotas
-- Executar no PostgreSQL quando o banco já existir com a estrutura anterior.

ALTER TABLE tbnotas
  ADD COLUMN IF NOT EXISTS idcliente bigint,
  ADD COLUMN IF NOT EXISTS nomecliente varchar(200),
  ADD COLUMN IF NOT EXISTS idveiculo bigint,
  ADD COLUMN IF NOT EXISTS nomeveiculo varchar(200),
  ADD COLUMN IF NOT EXISTS placaveiculo varchar(20);

CREATE TABLE IF NOT EXISTS tbnota_ajudantes (
  id_nota bigint NOT NULL,
  id_ajudante bigint NOT NULL,
  CONSTRAINT pk_tbnota_ajudantes PRIMARY KEY (id_nota, id_ajudante),
  CONSTRAINT fk_tbnota_ajudantes_nota FOREIGN KEY (id_nota) REFERENCES tbnotas (idnota) ON DELETE CASCADE,
  CONSTRAINT fk_tbnota_ajudantes_ajudante FOREIGN KEY (id_ajudante) REFERENCES tbajudante (idajuda) ON DELETE CASCADE
);
