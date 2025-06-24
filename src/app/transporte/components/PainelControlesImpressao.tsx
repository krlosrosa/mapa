"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  quebrarPorPercent: boolean;
  onChangeQuebrar: (value: boolean) => void;
  onImprimir: () => void;
  isPrinting: boolean;
  handlePrintTransporte: () => void;
}

export function PainelControlesImpressao({
  quebrarPorPercent,
  onChangeQuebrar,
  onImprimir,
  isPrinting,
  handlePrintTransporte,
}: Props) {
  return (
    <div className="mb-4 flex items-center space-x-4 no-print">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="quebrar"
          checked={quebrarPorPercent}
          onCheckedChange={(value) => onChangeQuebrar(Boolean(value))}
        />
        <Label htmlFor="quebrar">
          Quebrar pallets fracionados por percentual?
        </Label>
      </div>
      <Button onClick={onImprimir} disabled={isPrinting}>
        {isPrinting ? "Gerando PDF..." : "Imprimir Mapa"}
      </Button>
            <Button onClick={handlePrintTransporte}> Imprimir resumo</Button>
    </div>
  );
}
