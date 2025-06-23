// src/store/useTransporteStore.ts

import { create } from "zustand";
import { RemessasItem } from "@/utils/uploads/remessas";

interface RemessaStore {
  dataRemessa: RemessasItem[];
  setDataRemessa: (dataRemessa: RemessasItem[]) => void;
  clearDataRemessa: () => void;
}

export const useRemessaStore = create<RemessaStore>((set) => ({
  dataRemessa: [],
  setDataRemessa: (dataRemessa) => set({ dataRemessa }),
  clearDataRemessa: () => set({ dataRemessa: [] }),
}));
