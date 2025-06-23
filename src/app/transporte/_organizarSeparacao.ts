import { ItemRemessa } from "./types";

interface ConfiguracaoSeparacao {
  quebrarPalletFracionado: boolean; // true = faz quebra por percent, false = tudo junto
  limitePercentual: number; // ex: 100
}

type TipoResponsavel = "SEPARADOR" | "EMPILHADEIRA";

export interface BlocoSeparacao {
  responsavel: TipoResponsavel;
  pallet: number;
  itens: ItemRemessa[];
}

export function organizarSeparacaoPorResponsavel(

  itens: ItemRemessa[],
  config: ConfiguracaoSeparacao
): BlocoSeparacao[] {
  const resultado: BlocoSeparacao[] = [];

  console.log({itens})

  let palletIndex = 1;
  let acumuladoPercent = 0;
  let bufferSeparador: ItemRemessa[] = [];
  const bufferEmpilhadeira: ItemRemessa[] = [];

  for (const item of itens) {
    const completos = item.palletsCompleto ?? 0;
    const percent = item.percentPallet ?? 0;

    if (completos >= 1) {
      bufferEmpilhadeira.push(item);
      continue;
    }

    if (!config.quebrarPalletFracionado) {
      // Se não quebra pallet fracionado, junta tudo
      bufferSeparador.push(item);
      continue;
    }

    // Quebra por percentPallet
    if (acumuladoPercent + percent > config.limitePercentual && bufferSeparador.length > 0) {
      resultado.push({
        responsavel: "SEPARADOR",
        pallet: palletIndex++,
        itens: bufferSeparador,
      });
      bufferSeparador = [];
      acumuladoPercent = 0;
    }

    bufferSeparador.push(item);
    acumuladoPercent += percent;
  }

  // Fecha pallet do separador, se sobrou
  if (bufferSeparador.length > 0) {
    resultado.push({
      responsavel: "SEPARADOR",
      pallet: palletIndex++,
      itens: bufferSeparador,
    });
  }

  // Empilhadeira: todos os pallets completos num bloco só
  if (bufferEmpilhadeira.length > 0) {
    resultado.push({
      responsavel: "EMPILHADEIRA",
      pallet: palletIndex++,
      itens: bufferEmpilhadeira,
    });
  }

  return resultado;
}
