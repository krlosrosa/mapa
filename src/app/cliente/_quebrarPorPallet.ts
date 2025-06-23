import { ItemRemessa } from "./types";

interface PalletSeparado {
  pallet: number;
  itens: ItemRemessa[];
}

export function quebrarPorPallets(itens: ItemRemessa[]): PalletSeparado[] {
  const resultado: PalletSeparado[] = [];
  let acumulado = 0;
  let atual: ItemRemessa[] = [];
  let palletIndex = 1;

  for (const item of itens) {
    const percent = item.percentPallet ?? 0;

    if (acumulado + percent > 100 && atual.length > 0) {
      // Finaliza pallet atual
      resultado.push({
        pallet: palletIndex,
        itens: atual,
      });
      // Inicia novo pallet
      palletIndex++;
      atual = [];
      acumulado = 0;
    }

    atual.push(item);
    acumulado += percent;
  }

  // Adiciona último pallet
  if (atual.length > 0) {
    resultado.push({
      pallet: palletIndex,
      itens: atual,
    });
  }

  return resultado;
}
