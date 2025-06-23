import _ from "lodash";
import { ItemRemessa } from "./types";

export function agruparItensRemessa(itens: ItemRemessa[]): (ItemRemessa & {
  palletsCompleto: number;
  percentPallet: number;
  isOriginalLine?: boolean;
  isPalletLine?: boolean;
})[] {
  // Primeiro agrupa os itens normalmente
  const itensAgrupados = _(itens)
    .groupBy((item) => `${item.transporte}-${item.codSku}-${item.lote}`)
    .map((grupo) => {
      const base = grupo[0];

      const totalUnidades = _.sumBy(grupo, (i) => i.unidades ?? 0);
      const totalCaixasInformadas = _.sumBy(grupo, (i) => i.caixas ?? 0);
      const pesoBruto = _.sumBy(grupo, (i) => i.pesoBruto ?? 0);
      const pesoLiquido = _.sumBy(grupo, (i) => i.pesoLiquido ?? 0);

      const unCaixa = base.unidadeCaixa || 1;
      const cxPallet = base.caixaPallet || 1;

      // Calcula caixas adicionais a partir das unidades
      const caixasAdicionais = unCaixa > 0 ? Math.floor(totalUnidades / unCaixa) : 0;
      const unidadesRestantes = unCaixa > 0 ? totalUnidades % unCaixa : totalUnidades;

      const totalCaixas = totalCaixasInformadas + caixasAdicionais;

      const palletsCompletos = cxPallet > 0 ? Math.floor(totalCaixas / cxPallet) : 0;
      const caixasRestantes = cxPallet > 0 ? totalCaixas % cxPallet : totalCaixas;
      const percentPallet = cxPallet > 0 ? (caixasRestantes / cxPallet) * 100 : 0;

      return {
        ...base,
        caixas: caixasRestantes,
        unidades: unidadesRestantes,
        pesoBruto,
        pesoLiquido,
        palletsCompleto: palletsCompletos,
        percentPallet: percentPallet,
      };
    })
    .value();

  // Agora expande os itens que têm pallets completos
  const itensExpandidos = _.flatMap(itensAgrupados, (item) => {
    const baseItem = _.omit(item, [
      "caixas",
      "unidades",
      "palletsCompleto",
      "percentPallet",
      "pesoBruto",
      "pesoLiquido"
    ]);

    // Processa a divisão de pallets
    if (item.palletsCompleto > 0) {
      return [
        {
          ...item,
          palletsCompleto: 0,
          percentPallet: 0,
          isOriginalLine: true,
        },
        {
          ...baseItem,
          caixas: 0,
          unidades: 0,
          palletsCompleto: item.palletsCompleto,
          percentPallet: 100, // Pallets completos são 100%
          pesoBruto: item.pesoBruto * (item.palletsCompleto * item.caixaPallet / (item.palletsCompleto * item.caixaPallet + item.caixas)),
          pesoLiquido: item.pesoLiquido * (item.palletsCompleto * item.caixaPallet / (item.palletsCompleto * item.caixaPallet + item.caixas)),
          isPalletLine: true,
        },
      ];
    }

    return item;
  }).filter(
    (item) =>
      // Remove linhas onde todos os valores são zero
      !(
        item.caixas === 0 &&
        item.unidades === 0 &&
        item.palletsCompleto === 0
      )
  );

  return _.sortBy(itensExpandidos, ["transporte", "pickWay"]);
}