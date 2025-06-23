import { CadastroProdutoItem } from "@/utils/uploads/cadastrosProdutos";
import _ from "lodash";

export function findInfoSku(
  param: string,
  dataCadastroItem: CadastroProdutoItem[]
) {
  return _.find(
    dataCadastroItem,
    (item: CadastroProdutoItem) => item.codSku === param
  );
}
