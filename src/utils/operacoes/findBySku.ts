import { useCadastroItemStore } from "@/store/cadastroItemStore";

export default function findBySku(param: string): any {
  const { dataCadastroItem } = useCadastroItemStore();
  const info = dataCadastroItem.find((item) => item.codSku === param);
  return {
    ADRESSE: info?.endereco || "",
    cxPallet: info?.caixaPallet || 0,
    familia: info?.linha || "",
    PICKWAY: info?.pickWay || 0,
    Shelf: info?.shelf || 0,
    sku: info?.codSku || "",
    unCaixa: info?.unidadeCaixa || 0,
  };
}
