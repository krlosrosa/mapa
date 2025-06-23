"use client";

import { RoteirizacaoItem } from "@/utils/uploads/roterizacao";
import { BlocoSeparacao } from "../_organizarSeparacao";
import { QRCodeSVG } from "qrcode.react";
import { useRoteirizacaoStore } from "@/store/roteirizacaoStrore";

interface PalletHeaderProps {
  bloco: BlocoSeparacao;
  tipo: "SEPARADOR" | "EMPILHADEIRA";
  index: number;
  codCliente: string;
  empresa: string;
  categoria: string;
  infoTransporte?: RoteirizacaoItem;
}

export function PalletHeader({
  bloco,
  tipo,
  index,
  codCliente,
  empresa,
  categoria,
  infoTransporte,
}: PalletHeaderProps) {
  const totalCaixas = bloco.itens.reduce(
    (sum, item) => sum + (item.caixas ?? 0),
    0
  );
  const totalUnidades = bloco.itens.reduce(
    (sum, item) => sum + (item.unidades ?? 0),
    0
  );
  const enderecosUnicos = new Set(
    bloco.itens.filter((item) => item.codItem && item.lote)
  ).size;

  const { dataRoteirizacao } = useRoteirizacaoStore();

  const qrCodeData = `${codCliente};${index}${bloco.pallet};${totalCaixas};${totalUnidades};${enderecosUnicos};${categoria};${empresa}`;

  // Estilos baseados no tipo
  const isPicking = tipo === "SEPARADOR";
  const icon = isPicking ? "📦" : "🚛";

  const listClientes = dataRoteirizacao.filter(
    (item) => item.transporte === infoTransporte?.transporte
  ).map((mapear) => mapear.nomeCliente).join(" | ");

  return (
    <div className={`relative rounded-lg border-b-1`}>
      {/* Faixa superior com gradiente */}
      <div className={`py-2 px-4 bg-blue-100`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h1 className="font-bold text-lg">
                {infoTransporte?.transporte} •{" "}
                {isPicking ? "PICKING" : "PALLET FULL"}
              </h1>
              <div className="text-xs opacity-90">
                ID: {index}
                {bloco.pallet} | Cliente: {codCliente} | Desc Cliente:{" "}
                {infoTransporte?.nomeCliente} | Empresa: {empresa}
              </div>
            </div>
          </div>

          <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
            {categoria} | Pallet {bloco.pallet}
          </div>
        </div>
      </div>

      {/* Área de informações */}
      <div className="bg-white p-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          {/* Informações de transporte (se existirem) */}
          {infoTransporte && (
            <div className="flex-1 min-w-[250px]">
              <div className="text-sm font-semibold text-gray-700 mb-1">
                Informações de Transporte
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  🚚 {infoTransporte.transporte}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  🔢 {infoTransporte.placa}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  🗺️ Rota {infoTransporte.rota}
                </span>
              </div>
            </div>
          )}

          {/* Estatísticas */}
          <div
            className={`flex divide-x ${
              isPicking ? "divide-blue-100" : "divide-green-100"
            } 
            border ${
              isPicking ? "border-blue-200" : "border-green-200"
            } rounded-lg overflow-hidden shadow-sm`}
          >
            <div className="px-4 py-2 text-center">
              <div className="text-xs font-medium text-gray-500">Caixas</div>
              <div className={`text-xl font-bold `}>{totalCaixas}</div>
            </div>
            <div className="px-4 py-2 text-center">
              <div className="text-xs font-medium text-gray-500">Unidades</div>
              <div className={`text-xl font-bold `}>{totalUnidades}</div>
            </div>
            <div className="px-4 py-2 text-center">
              <div className="text-xs font-medium text-gray-500">Endereços</div>
              <div className={`text-xl font-bold `}>{enderecosUnicos}</div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-1 rounded border border-gray-200">
              <QRCodeSVG value={qrCodeData} size={80} level="H" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
