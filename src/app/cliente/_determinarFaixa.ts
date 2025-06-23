import { ItemRemessa } from "./types";

interface FaixaValidade {
  faixa: "vermelha" | "laranja" | "amarela" | "verde";
  porcentagem: number;
  diasRestantes: number;
}

export function determinarFaixaValidade(
  item: ItemRemessa,
  dataReferencia: Date = new Date()
): FaixaValidade {
  // Converter strings de data para objetos Date
  const dataFabricacao = new Date(item.fabricacao);
  const dataVencimento = new Date(item.vencimento);

  // Calcular o tempo total de validade em dias
  const tempoTotalValidade = item.shelf; // Já está em dias

  // Calcular dias decorridos desde a fabricação até a data de referência
  const diffTempoMs = dataReferencia.getTime() - dataFabricacao.getTime();
  const diasDecorridos = Math.floor(diffTempoMs / (1000 * 60 * 60 * 24));

  // Calcular dias restantes até o vencimento
  const diffVencimentoMs = dataVencimento.getTime() - dataReferencia.getTime();
  const diasRestantes = Math.max(
    0,
    Math.floor(diffVencimentoMs / (1000 * 60 * 60 * 24))
  );

  // Calcular porcentagem da vida útil consumida
  const porcentagemConsumida = (diasDecorridos / tempoTotalValidade) * 100;
  const porcentagemRestante = 100 - porcentagemConsumida;

  // Determinar a faixa com base nos limites do item
  if (porcentagemRestante <= item.vermelhaFaixa) {
    return {
      faixa: "vermelha",
      porcentagem: porcentagemRestante,
      diasRestantes,
    };
  } else if (porcentagemRestante <= item.laranjaFaixa) {
    return {
      faixa: "laranja",
      porcentagem: porcentagemRestante,
      diasRestantes,
    };
  } else if (porcentagemRestante <= item.amareloFaixa) {
    return {
      faixa: "amarela",
      porcentagem: porcentagemRestante,
      diasRestantes,
    };
  } else {
    return { faixa: "verde", porcentagem: porcentagemRestante, diasRestantes };
  }
}
