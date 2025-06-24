"use client";

import { useRef } from "react";
import _ from "lodash";
import { GrupoImpressao } from "./components/GrupoImpressao";
import { PainelControlesImpressao } from "./components/PainelControlesImpressao";
import { useHandlePrint } from "./_useHandlePrint";
import { useRemessaDados } from "./_usePrepararDadosRemessa";
import { Button } from "@/components/ui/button";

export default function TransportePage() {
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

  const printRefTransportes = useRef<HTMLDivElement>(null);
  const { handlePrint: handlePrintTransporte } =
    useHandlePrint(printRefTransportes);

  return (
    <div className="p-1">
      {/* Controles */}
      <PainelControlesImpressao
        quebrarPorPercent={quebrarPorPercent}
        onChangeQuebrar={setQuebrarPorPercent}
        onImprimir={handlePrint}
        isPrinting={isPrinting}
        handlePrintTransporte={handlePrintTransporte}
      />

      {/* Área de impressão otimizada */}
      <div ref={printRef} className="print-area">
        {grupos.map((grupo, index) => {
          return (
            <GrupoImpressao
              key={`${grupo.transporte}-${grupo.centro}-${grupo.linha}`}
              grupo={grupo}
              dadosAgrupado={dadosAgrupado}
              configuracaoCD={configuracaoCD}
              isLast={index === grupos.length - 1}
              index={index}   
              qtdTransporte={grupos.length}
            />
          );
        })}
      </div>
      <div ref={printRefTransportes} className="print-area">
        <strong>Resumo transportes impressos</strong>
        {_.unionBy(grupos, "transporte").map((info) => {
          return (
            <div className="border text-[10px]">
              <div>{info.transporte}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
