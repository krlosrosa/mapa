import _ from "lodash";
import { ItemRemessa } from "./types";

export interface GrupoUnico {
  codCliente: string;
  centro: string;
  linha: string;
}

export function obterGruposUnicosTransporteEmpresaLinha(
  itens: ItemRemessa[]
): GrupoUnico[] {
  return _.uniqBy(
    itens.map((item) => ({
      codCliente: item.codCliente,
      centro: item.centro,
      linha: item.linha,
    })),
    (item) => `${item.codCliente}-${item.centro}-${item.linha}`
  );
}
