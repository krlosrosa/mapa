import { useCadastroItemStore } from "@/store/cadastroItemStore";
import { useRemessaStore } from "@/store/remessasStore";
import { useState, useMemo } from "react";
import { prepararDadosRemessa } from "./_prepararDadosRemessa";
import { agruparItensRemessa } from "./_agruparDados";
import { GrupoUnico, obterGruposUnicosTransporteEmpresaLinha } from "./_obterGruposUnicos";
import { ItemRemessa } from "./types";

interface ConfiguracaoCD {
  quebrarPalletFracionado: boolean;
  limitePercentual: number;
}

interface UseRemessaDadosHook {
  dadosAgrupado: (ItemRemessa & {
    palletsCompleto: number;
    percentPallet: number;
    isOriginalLine?: boolean;
    isPalletLine?: boolean;
  })[]; // substitua 'any' pelo tipo correto
  grupos: GrupoUnico[]; // substitua 'any' pelo tipo correto
  quebrarPorPercent: boolean;
  setQuebrarPorPercent: (value: boolean) => void;
  isPrinting: boolean;
  setIsPrinting: (value: boolean) => void;
  configuracaoCD: ConfiguracaoCD;
}

export function useRemessaDados(): UseRemessaDadosHook {
  const { dataRemessa } = useRemessaStore();
  const { dataCadastroItem } = useCadastroItemStore();
  const [quebrarPorPercent, setQuebrarPorPercent] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  // Memoize os dados para evitar recálculos desnecessários
  const { dadosAgrupado, grupos } = useMemo(() => {
    const dados = prepararDadosRemessa({ dataCadastroItem, dataRemessa });
    const dadosAgrupado = agruparItensRemessa(dados);
    const grupos = obterGruposUnicosTransporteEmpresaLinha(dadosAgrupado);
    return { dadosAgrupado, grupos };
  }, [dataCadastroItem, dataRemessa]);

  const configuracaoCD = useMemo(
    () => ({
      quebrarPalletFracionado: quebrarPorPercent,
      limitePercentual: 100,
    }),
    [quebrarPorPercent]
  );

  return {
    dadosAgrupado,
    grupos,
    quebrarPorPercent,
    setQuebrarPorPercent,
    isPrinting,
    setIsPrinting,
    configuracaoCD,
  };
}
