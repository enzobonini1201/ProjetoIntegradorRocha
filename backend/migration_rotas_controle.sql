ALTER TABLE tbrota
  ADD COLUMN IF NOT EXISTS id_nota bigint,
  ADD COLUMN IF NOT EXISTS numero_nota integer,
  ADD COLUMN IF NOT EXISTS cliente_nota varchar(100),
  ADD COLUMN IF NOT EXISTS id_cliente bigint,
  ADD COLUMN IF NOT EXISTS nome_cliente varchar(200),
  ADD COLUMN IF NOT EXISTS id_veiculo bigint,
  ADD COLUMN IF NOT EXISTS nome_veiculo varchar(200),
  ADD COLUMN IF NOT EXISTS placa_veiculo varchar(20);

CREATE TABLE IF NOT EXISTS tbrota_ajudantes (
  id_rota bigint NOT NULL,
  id_ajudante bigint NOT NULL,
  CONSTRAINT pk_tbrota_ajudantes PRIMARY KEY (id_rota, id_ajudante),
  CONSTRAINT fk_tbrota_ajudantes_rota FOREIGN KEY (id_rota) REFERENCES tbrota (idRota) ON DELETE CASCADE,
  CONSTRAINT fk_tbrota_ajudantes_ajudante FOREIGN KEY (id_ajudante) REFERENCES tbajudante (idAjuda) ON DELETE CASCADE
);