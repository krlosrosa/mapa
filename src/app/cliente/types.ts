export interface ItemRemessa {
  transporte: string;
  remessa: string;
  itemRemessa: string;
  centro: string;
  empresa: string;
  nomeEmpresa: string;
  placa: string;
  codItem: string;
  descItem: string;
  lote: string;
  venda: number;
  unMedidade: string;
  fabricacao: Date; // ou Date se for converter para objeto Date
  vencimento: Date; // ou Date se for converter para objeto Date
  codCliente: string;
  nomeCliente: string;
  pesoBruto: number;
  pesoLiquido: number;
  codSku: string;
  descSku: string;
  shelf: number;
  tipoPeso: number;
  pesoCaixa: number;
  unidadeCaixa: number;
  caixaPallet: number;
  linha: string;
  vermelhaFaixa: number;
  laranjaFaixa: number;
  amareloFaixa: number;
  verdeFaixa: number;
  pickWay: number;
  endereco: string;
  caixas?: number;
  unidades?: number;
  faixa?: string;
  palletsCompleto?: number
  percentPallet?: number
}