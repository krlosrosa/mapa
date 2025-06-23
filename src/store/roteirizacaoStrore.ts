// src/store/useTransporteStore.ts

import { create } from "zustand";
import { RoteirizacaoItem } from "@/utils/uploads/roterizacao";

interface RoteirizacaoStore {
  dataRoteirizacao: RoteirizacaoItem[];
  setDataRoteirizacao: (dataRoteirizacao: RoteirizacaoItem[]) => void;
  clearDataRoteirizacao: () => void;
}

export const useRoteirizacaoStore = create<RoteirizacaoStore>((set) => ({
  dataRoteirizacao: [],
  setDataRoteirizacao: (dataRoteirizacao) => set({ dataRoteirizacao }),
  clearDataRoteirizacao: () => set({ dataRoteirizacao: [] }),
}));
