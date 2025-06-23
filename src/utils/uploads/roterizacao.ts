import * as XLSX from "xlsx";

export interface RoteirizacaoItem {
  empresa: string;
  rota: string;
  transporte: string;
  placa: string;
  remessa: string;
  sequencia: number;
  cliente: string;
  nomeCliente: string;
  local: string;
  veiculoRoterizado: string;
  veiculoEfetivo: string;
  transportadora: string;
  tipoCarga: string;
}

export async function processExcelFileRoteirizacao(
  file: File
): Promise<RoteirizacaoItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        }) as any[];

        const result: RoteirizacaoItem[] = jsonData.map((item) => ({
          empresa: String(item["Empresa"] ?? "").trim(),
          rota: String(item["Rota Gerada no Roteirizador"] ?? "").trim(),
          transporte: String(item["Nº transporte"] ?? "").trim(),
          placa: String(item["Identif.externo 1"] ?? "").trim(),
          remessa: String(item["Fornecimento"] ?? "").trim(),
          sequencia: parseInt(item["Seqüência"]) || 0,
          cliente: String(item["Cliente"] ?? "").trim(),
          nomeCliente: String(item["Nome"] ?? "").trim(),
          local: String(item["Local"] ?? "").trim(),
          veiculoRoterizado: String(item["Veículo Roteirizado"] ?? "").trim(),
          veiculoEfetivo: String(item["Veículo Efetivo"] ?? "").trim(),
          transportadora: String(item["Nome do Transportador"] ?? "").trim(),
          tipoCarga: String(item["Tipo de Carga"] ?? "").trim(),
        }));

        resolve(result);
      } catch (error) {
        console.error(error);
        reject(new Error("Erro ao processar o arquivo Excel"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };

    reader.readAsArrayBuffer(file);
  });
}
