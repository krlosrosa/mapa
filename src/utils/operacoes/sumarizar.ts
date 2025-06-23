import _ from "lodash";
import findBySku from "./findBySku";
import { SeparacaoItem } from "@/store/separacaoStore";

export function sumarizacao(
  grupo: SeparacaoItem[],
  key: string,
  item: string
): any[] {
  const agrupado = _.groupBy(grupo, key);

  return Object.values(agrupado).map((grupoSimilar) => {
    const totalUnidades = _.sumBy(grupoSimilar, "unidades");
    const acumuladoCaixas = _.sumBy(grupoSimilar, "caixas");
    const info = findBySku(item);

    const cxPallet = info?.cxPallet || 1;
    const unCaixa = info?.unCaixa || 1;

    const caixaCompleta = unCaixa > 0 ? Math.floor(totalUnidades / unCaixa) : 0;
    const unidadesRestante =
      unCaixa > 0 ? totalUnidades % unCaixa : totalUnidades;

    const totalCaixas = acumuladoCaixas + caixaCompleta;

    const palletsCompletos =
      cxPallet > 0 ? Math.floor(totalCaixas / cxPallet) : 0;
    const caixasRestantes = cxPallet > 0 ? totalCaixas % cxPallet : totalCaixas;
    const percentPallet = cxPallet > 0 ? (caixasRestantes / cxPallet) * 100 : 0;

    return {
      caixas: caixasRestantes,
      unidades: unidadesRestante,
      percentPallet: percentPallet,
      palletsCompleto: palletsCompletos,
    };
  });
}
