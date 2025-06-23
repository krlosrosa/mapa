"use client";

import { useRef } from "react";
import _ from "lodash";
import { GrupoImpressao } from "./components/GrupoImpressao";
import { PainelControlesImpressao } from "./components/PainelControlesImpressao";
import { useHandlePrint } from "./_useHandlePrint";
import { useRemessaDados } from "./_usePrepararDadosRemessa";

export default function ClientePage() {
  const {
    dadosAgrupado,
    grupos,
    quebrarPorPercent,
    setQuebrarPorPercent,
    isPrinting,
    configuracaoCD,
  } = useRemessaDados();

  const printRef = useRef<HTMLDivElement>(null);
  const { handlePrint } = useHandlePrint(printRef);
  return (
    <div className="p-1">
      {/* Controles */}
      <PainelControlesImpressao
        quebrarPorPercent={quebrarPorPercent}
        onChangeQuebrar={setQuebrarPorPercent}
        onImprimir={handlePrint}
        isPrinting={isPrinting}
      />

      {/* Área de impressão otimizada */}
      <div ref={printRef} className="print-area">
        {grupos.map((grupo, index) => {
          return (
            <GrupoImpressao
              key={`${grupo.codCliente}-${grupo.centro}-${grupo.linha}`}
              grupo={grupo}
              dadosAgrupado={dadosAgrupado}
              configuracaoCD={configuracaoCD}
              isLast={index === grupos.length - 1}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}
