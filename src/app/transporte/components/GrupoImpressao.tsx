"use client";

import { useMemo } from "react";
import _ from "lodash";
import { useRoteirizacaoStore } from "@/store/roteirizacaoStrore";
import { RoteirizacaoItem } from "@/utils/uploads/roterizacao";
import { GrupoUnico } from "../_obterGruposUnicos";
import { ItemRemessa } from "../types";
import { organizarSeparacaoPorResponsavel } from "../_organizarSeparacao";
import { filtrarDados } from "../_filtrarDados";
import { PalletHeader } from "./headerMapa";
import { TabelaSeparador } from "./TabelaSeparador";
import { TabelaEmpilhadeira } from "./TabelaEmpilhadeira";

interface GrupoImpressaoProps {
  grupo: GrupoUnico;
  dadosAgrupado: (ItemRemessa & {
    palletsCompleto: number;
    percentPallet: number;
    isOriginalLine?: boolean;
    isPalletLine?: boolean;
  })[];
  configuracaoCD: {
    quebrarPalletFracionado: boolean;
    limitePercentual: number;
  };
  isLast: boolean;
  index: number;
  qtdTransporte: number
}

export function GrupoImpressao({
  grupo,
  dadosAgrupado,
  configuracaoCD,
  isLast,
  index,
  qtdTransporte
}: GrupoImpressaoProps) {
  const { transporte, centro: empresa, linha: categoria } = grupo;
  const { dataRoteirizacao } = useRoteirizacaoStore();

  const infoTransporte = _.find(
    dataRoteirizacao,
    (find: RoteirizacaoItem) => find.transporte === transporte
  );

  const { blocosSeparador, blocosEmpilhadeira } = useMemo(() => {
    const dataFiltrada = filtrarDados(
      transporte,
      categoria,
      empresa,
      dadosAgrupado
    );
    const blocos = organizarSeparacaoPorResponsavel(
      dataFiltrada,
      configuracaoCD
    );

    return {
      blocosSeparador: blocos.filter((b) => b.responsavel === "SEPARADOR"),
      blocosEmpilhadeira: blocos.filter(
        (b) => b.responsavel === "EMPILHADEIRA"
      ),
    };
  }, [transporte, categoria, empresa, dadosAgrupado, configuracaoCD]);


  return (
    <div className={!isLast ? "grupo-page-break" : ""}>
      {/* SEÇÃO SEPARADOR */}
      {blocosSeparador.length > 0 && (
        <div className="space-y-4 mb-6">
          {blocosSeparador.map((bloco) => {

            return (
              <div
                key={bloco.pallet}
                className="border rounded-md overflow-hidden"
              >
                <PalletHeader
                  bloco={bloco}
                  tipo="SEPARADOR"
                  index={index}
                  transporte={transporte}
                  empresa={empresa}
                  categoria={categoria}
                  infoTransporte={infoTransporte}
                />

                <TabelaSeparador bloco={bloco} />
              </div>
            );
          })}
        </div>
      )}

      {/* SEÇÃO EMPILHADEIRA */}
      {blocosEmpilhadeira.length > 0 && (
        <div
          className={`space-y-4 mb-6 ${
            blocosSeparador.length > 0 ? "responsavel-page-break" : ""
          }`}
        >
          {blocosEmpilhadeira.map((bloco) => {
            return (
              <div
                key={bloco.pallet}
                className="border rounded-md overflow-hidden"
              >
                <PalletHeader
                  bloco={bloco}
                  tipo="EMPILHADEIRA"
                  index={index}
                  transporte={transporte}
                  empresa={empresa}
                  categoria={categoria}
                  infoTransporte={infoTransporte}
                />

                <TabelaEmpilhadeira bloco={bloco} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
