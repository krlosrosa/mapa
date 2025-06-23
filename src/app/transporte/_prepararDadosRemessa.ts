import { CadastroProdutoItem } from "@/utils/uploads/cadastrosProdutos";
import { ItemRemessa } from "./types";
import { findInfoSku } from "./_findInfoSku";
import { determinarFaixaValidade } from "./_determinarFaixa";
import conversaoUnidadeMedida from "./_converterUnMedida";
import { RemessasItem } from "@/utils/uploads/remessas";

interface Params {
  dataRemessa: RemessasItem[];
  dataCadastroItem: CadastroProdutoItem[];
}

export function prepararDadosRemessa({
  dataRemessa,
  dataCadastroItem,
}: Params): (ItemRemessa &
  CadastroProdutoItem & { faixa: string; caixas: number; unidades: number })[] {
  return dataRemessa.map((item) => {
    const dataSku = findInfoSku(item.codItem, dataCadastroItem);
    const dadosAgrupados = { ...item, ...(dataSku as CadastroProdutoItem) };

    const calculoFaixa = determinarFaixaValidade(dadosAgrupados);
    const ajustarCaixas = conversaoUnidadeMedida(
      dadosAgrupados.venda,
      dadosAgrupados.unMedidade
    );

    return {
      ...dadosAgrupados,
      faixa: calculoFaixa.faixa,
      caixas: ajustarCaixas.caixas,
      unidades: ajustarCaixas.unidades,
      transporte: item.transporte
    };
  });
}
