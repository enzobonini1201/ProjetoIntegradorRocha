-- Script PostgreSQL para Sistema Rocha Transportes
-- Convertido de MySQL para PostgreSQL

-- Criar o banco de dados (execute separadamente se necessário)
-- CREATE DATABASE db_rocha;

-- Conectar ao banco de dados
-- \c db_rocha;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS tbusuario (
    loginUser VARCHAR(45) PRIMARY KEY,
    senhaUser VARCHAR(255) NOT NULL,
    nomeUser VARCHAR(45) NOT NULL,
    cpfUser VARCHAR(14) UNIQUE,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agregados
CREATE TABLE IF NOT EXISTS tbagregado (
    idAgre SERIAL PRIMARY KEY,
    nomeAgre VARCHAR(200) NOT NULL,
    telefoneAgre VARCHAR(15) NOT NULL,
    datanascAgre DATE NOT NULL,
    cpfAgre VARCHAR(15) NOT NULL,
    cepAgre VARCHAR(15) NOT NULL,
    buonnyAgre DATE NOT NULL,
    cnhAgre VARCHAR(15) NOT NULL,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ajudantes
CREATE TABLE IF NOT EXISTS tbajudante (
    idAjuda SERIAL PRIMARY KEY,
    nomeAjuda VARCHAR(200) NOT NULL,
    telefoneAjuda VARCHAR(15) NOT NULL,
    datanascAjuda DATE NOT NULL,
    cpfAjuda VARCHAR(15) NOT NULL,
    cepAjuda VARCHAR(100) NOT NULL,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS tbcliente (
    idCliente SERIAL PRIMARY KEY,
    telefoneCliente VARCHAR(15) NOT NULL,
    razaosocialCliente VARCHAR(100) NOT NULL,
    cnpjCliente VARCHAR(15) NOT NULL,
    cepCliente VARCHAR(100) NOT NULL,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Motoristas
CREATE TABLE IF NOT EXISTS tbmotorista (
    idMoto SERIAL PRIMARY KEY,
    nomeMoto VARCHAR(200) NOT NULL,
    telefoneMoto VARCHAR(15),
    datanascMoto VARCHAR(100),
    cpfMoto VARCHAR(11),
    enderecoMoto VARCHAR(200),
    buonnyMoto VARCHAR(100),
    cnhMoto VARCHAR(15),
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Notas Fiscais
CREATE TABLE IF NOT EXISTS tbnotas (
    idNota SERIAL PRIMARY KEY,
    numeroNota INTEGER NOT NULL,
    qtdNota INTEGER NOT NULL,
    razaosocialdestNota VARCHAR(100) NOT NULL,
    cidadedestNota VARCHAR(100) NOT NULL,
    cnpjdestNota VARCHAR(15) NOT NULL,
    coletadoporNota VARCHAR(60) NOT NULL,
    entregueporNota VARCHAR(60) NOT NULL,
    datacoletaNota DATE NOT NULL,
    dataentregaNota DATE NOT NULL,
    clienteNota VARCHAR(100) NOT NULL,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Transportes
CREATE TABLE IF NOT EXISTS tbtransporte (
    idTrans SERIAL PRIMARY KEY,
    tipoTrans VARCHAR(60) NOT NULL,
    placaTrans VARCHAR(10) NOT NULL,
    capacidadeTrans VARCHAR(100) NOT NULL,
    nomeTrans VARCHAR(200) NOT NULL,
    responsavelTrans VARCHAR(100) NOT NULL,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Rotas (nova tabela para o módulo de rotas)
CREATE TABLE IF NOT EXISTS tbrota (
    idRota SERIAL PRIMARY KEY,
    nomeRota VARCHAR(200) NOT NULL,
    origem VARCHAR(200) NOT NULL,
    destino VARCHAR(200) NOT NULL,
    distanciaKm DECIMAL(10, 2),
    tempoEstimadoHoras DECIMAL(5, 2),
    pedagios DECIMAL(10, 2),
    observacoes TEXT,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário padrão (senha: 123456 - hash SHA-256)
-- Nota: No sistema Java será usado BCrypt, então esta senha precisará ser recadastrada
INSERT INTO tbusuario (loginUser, senhaUser, nomeUser) VALUES 
('admin', '$2a$10$qB5h8RJTqXD6lLJN6dR2auqQPPRMCDJz0D4rU5Xj0GvYOGz7Y8wLO', 'Administrador')
ON CONFLICT (loginUser) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_agregado_cpf ON tbagregado(cpfAgre);
CREATE INDEX IF NOT EXISTS idx_ajudante_cpf ON tbajudante(cpfAjuda);
CREATE INDEX IF NOT EXISTS idx_cliente_cnpj ON tbcliente(cnpjCliente);
CREATE INDEX IF NOT EXISTS idx_motorista_cpf ON tbmotorista(cpfMoto);
CREATE INDEX IF NOT EXISTS idx_motorista_cnh ON tbmotorista(cnhMoto);
CREATE INDEX IF NOT EXISTS idx_notas_cliente ON tbnotas(clienteNota);
CREATE INDEX IF NOT EXISTS idx_notas_data_coleta ON tbnotas(datacoletaNota);
CREATE INDEX IF NOT EXISTS idx_transporte_placa ON tbtransporte(placaTrans);
CREATE INDEX IF NOT EXISTS idx_rota_origem_destino ON tbrota(origem, destino);

-- Função para atualizar automaticamente o campo atualizadoEm
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizadoEm = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar atualizadoEm automaticamente
CREATE TRIGGER update_tbusuario_updated_at BEFORE UPDATE ON tbusuario
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tbagregado_updated_at BEFORE UPDATE ON tbagregado
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tbajudante_updated_at BEFORE UPDATE ON tbajudante
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tbcliente_updated_at BEFORE UPDATE ON tbcliente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tbmotorista_updated_at BEFORE UPDATE ON tbmotorista
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tbnotas_updated_at BEFORE UPDATE ON tbnotas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tbtransporte_updated_at BEFORE UPDATE ON tbtransporte
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tbrota_updated_at BEFORE UPDATE ON tbrota
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE tbusuario IS 'Tabela de usuários do sistema';
COMMENT ON TABLE tbagregado IS 'Tabela de motoristas agregados';
COMMENT ON TABLE tbajudante IS 'Tabela de ajudantes';
COMMENT ON TABLE tbcliente IS 'Tabela de clientes';
COMMENT ON TABLE tbmotorista IS 'Tabela de motoristas';
COMMENT ON TABLE tbnotas IS 'Tabela de notas fiscais';
COMMENT ON TABLE tbtransporte IS 'Tabela de veículos de transporte';
COMMENT ON TABLE tbrota IS 'Tabela de rotas de transporte';
