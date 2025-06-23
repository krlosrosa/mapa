"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { useRoteirizacaoStore } from "@/store/roteirizacaoStrore";
import { processExcelFileRoteirizacao } from "@/utils/uploads/roterizacao";
import { useRemessaStore } from "@/store/remessasStore";
import { processExcelFileRemessaItem } from "@/utils/uploads/remessas";

export default function CadastroRemessaPage() {
  const { dataRemessa, setDataRemessa } = useRemessaStore();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setIsSuccess(false);
    setProgress(0);

    try {
      // Simulando progresso (você pode adaptar para o progresso real)
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await processExcelFileRemessaItem(file);
      setDataRemessa(result);

      clearInterval(timer);
      setProgress(100);
      setIsSuccess(true);
    } catch (err) {
      console.error("Erro ao processar Excel:", err);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <p className="text-muted-foreground">
        Faça upload do arquivo Excel das remessas
      </p>

      <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Processando arquivo... {progress}%
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="p-4 border border-green-200 bg-green-50 rounded-md flex items-center gap-3">
          <CheckCircle className="text-green-600" />
          <div>
            <h3 className="font-medium text-green-800">
              Arquivo processado com sucesso!
            </h3>
            <p className="text-sm text-green-600">
              {dataRemessa.length} itens foram carregados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}