export interface Rota {
  idRota?: number;
  origem: string;
  destino: string;
  tipoResponsavel?: string; // "motorista" ou "agregado"
  idResponsavel?: number;
  nomeResponsavel?: string;
  distanciaKm?: number;
  tempoEstimadoMinutos?: number;
  coordenadasOrigem?: string; // JSON: {"lat": -23.550520, "lng": -46.633308}
  coordenadasDestino?: string;
}
