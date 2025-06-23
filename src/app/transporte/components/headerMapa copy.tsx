"use client";

import { RoteirizacaoItem } from "@/utils/uploads/roterizacao";
import { BlocoSeparacao } from "../_organizarSeparacao";
import { QRCodeSVG } from "qrcode.react";

interface PalletHeaderProps {
  bloco: BlocoSeparacao;
  tipo: "SEPARADOR" | "EMPILHADEIRA";
  index: number;
  transporte: string;
  empresa: string;
  categoria: string;
  infoTransporte?: RoteirizacaoItem;
}

export function PalletHeader({
  bloco,
  tipo,
  index,
  transporte,
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
  const enderecosUnicos = new Set(bloco.itens.filter((item) => item.codItem && item.lote))
    .size;

  // Dados para o QR Code
  const qrCodeData = `${transporte};${index};${totalCaixas};${totalUnidades};${enderecosUnicos};${categoria};${empresa}`;

  return (
    <div
      className={`p-3 ${
        tipo === "SEPARADOR" ? "bg-blue-50" : "bg-green-50"
      } rounded-t-md flex justify-between items-start`}
    >
      <div className="flex-1">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="font-bold">
              {tipo === "SEPARADOR" ? "📦 PICKING" : "🚚 PALLET FULL"} •
              Pallet {bloco.pallet}
            </h3>
            <div className="text-sm text-gray-600">
              <span>Cliente: {transporte} | </span>
              <span>Empresa: {empresa} | </span>
              <span>Linha: {categoria} | </span>
              <span>Id: {index}</span>
            </div>
            {infoTransporte && (
              <div className="text-xs mt-1">
                <span>Transporte: {infoTransporte.transporte} | </span>
                <span>Placa: {infoTransporte.placa} | </span>
                <span>Rota: {infoTransporte.rota}</span>
              </div>
            )}
          </div>

          <div className="flex gap-4 bg-white px-3 py-1 rounded-md shadow-xs">
            <div className="text-center">
              <div className="text-xs text-gray-500">Caixas</div>
              <div className="font-bold">{totalCaixas}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Unidades</div>
              <div className="font-bold">{totalUnidades}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Endereços</div>
              <div className="font-bold">{enderecosUnicos}</div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code no lado direito */}
      <div className="ml-4 bg-white p-1 rounded">
        <QRCodeSVG value={qrCodeData} size={80} level="H" />
      </div>
    </div>
  );
}
