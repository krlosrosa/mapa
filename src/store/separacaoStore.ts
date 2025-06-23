// src/store/useTransporteStore.ts

import { create } from "zustand";

interface SeparacaoStore {
  dataSeparacao: SeparacaoItem[];
  setDataSeparacao: (dataSeparacao: SeparacaoItem[]) => void;
  clearDataSeparacao: () => void;
}

export const useSeparacaoStore = create<SeparacaoStore>((set) => ({
  dataSeparacao: [],
  setDataSeparacao: (dataSeparacao) => set({ dataSeparacao }),
  clearDataSeparacao: () => set({ dataSeparacao: [] }),
}));

export interface SeparacaoItem {
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
  fabricacao: Date;
  vencimento: Date;
  codCliente: string;
  nomeCliente: string;
  pesoBruto: number;
  pesoLiquido: number;
  caixas: number;
  unidades: number;
  faixa: number;
  categoria: string;
}
