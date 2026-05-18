export interface Nota {
  idNota?: number;
  numeroNota: number;
  qtdNota: number;
  razaosocialdestNota: string;
  cidadedestNota: string;
  cnpjdestNota: string;
  coletadoporNota: string;
  entregueporNota?: string | null;
  datacoletaNota: string;
  dataentregaNota?: string | null;
  clienteNota: string;
  idCliente?: number;
  nomeCliente?: string;
  idVeiculo?: number;
  nomeVeiculo?: string;
  placaVeiculo?: string;
  ajudantes?: Array<{ idAjuda?: number; nomeAjuda?: string }>;
  diasRestantes?: number;
  status?: string;
  // Novos campos para coletador
  tipoColetador?: string;
  idColetador?: number;
  nomeColetador?: string;
  // Novos campos para entregador
  tipoEntregador?: string;
  idEntregador?: number;
  nomeEntregador?: string;
}
