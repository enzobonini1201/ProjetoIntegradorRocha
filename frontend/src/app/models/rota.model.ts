export interface Rota {
  idRota?: number;
  origem: string;
  destino: string;
  tipoResponsavel?: string; // "motorista" ou "agregado"
  idResponsavel?: number;
  nomeResponsavel?: string;
  idNota?: number;
  numeroNota?: number;
  clienteNota?: string;
  idCliente?: number;
  nomeCliente?: string;
  idVeiculo?: number;
  nomeVeiculo?: string;
  placaVeiculo?: string;
  ajudantes?: Array<{ idAjuda?: number; nomeAjuda?: string }>;
  distanciaKm?: number;
  tempoEstimadoMinutos?: number;
  coordenadasOrigem?: string; // JSON: {"lat": -23.550520, "lng": -46.633308}
  coordenadasDestino?: string;
}
