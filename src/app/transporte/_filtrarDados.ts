import _ from "lodash";
import { ItemRemessa } from "./types";

export function filtrarDados(
  transporte: string,
  categoria: string,
  empresa: string,
  data: ItemRemessa[]
) {
  return _.filter(
    data,
    (item: ItemRemessa) =>
      item.transporte === transporte &&
      item.linha === categoria &&
      item.centro === empresa
  );
}
