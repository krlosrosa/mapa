// src/store/useTransporteStore.ts

import { create } from "zustand";
import { CadastroProdutoItem } from "@/utils/uploads/cadastrosProdutos";

interface CadastroItemStore {
  dataCadastroItem: CadastroProdutoItem[];
  setDataCadastroItem: (dataCadastroItem: CadastroProdutoItem[]) => void;
  clearDataCadastroItem: () => void;
}

export const useCadastroItemStore = create<CadastroItemStore>((set) => ({
  dataCadastroItem: [],
  setDataCadastroItem: (dataCadastroItem) => set({ dataCadastroItem }),
  clearDataCadastroItem: () => set({ dataCadastroItem: [] }),
}));
