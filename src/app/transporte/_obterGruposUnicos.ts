import _ from "lodash";
import { ItemRemessa } from "./types";

export interface GrupoUnico {
  transporte: string;
  centro: string;
  linha: string;
}

export function obterGruposUnicosTransporteEmpresaLinha(
  itens: ItemRemessa[]
): GrupoUnico[] {
  return _.uniqBy(
    itens.map((item) => ({
      transporte: item.transporte,
      centro: item.centro,
      linha: item.linha,
    })),
    (item) => `${item.transporte}-${item.centro}-${item.linha}`
  );
}
