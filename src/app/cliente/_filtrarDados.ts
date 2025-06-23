import _ from "lodash";
import { ItemRemessa } from "./types";

export function filtrarDados(
  codCliente: string,
  categoria: string,
  empresa: string,
  data: ItemRemessa[]
) {
  return _.filter(
    data,
    (item: ItemRemessa) =>
      item.codCliente === codCliente &&
      item.linha === categoria &&
      item.centro === empresa
  );
}
