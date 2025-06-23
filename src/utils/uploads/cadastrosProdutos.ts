import * as XLSX from "xlsx";

export interface CadastroProdutoItem {
  codSku: string;
  descSku: string;
  shelf: number;
  tipoPeso: number;
  pesoCaixa: number;
  unidadeCaixa: number;
  caixaPallet: number;
  linha: string;
  vermelhaFaixa: number;
  laranjaFaixa: number;
  amareloFaixa: number;
  verdeFaixa: number;
  pickWay: number;
  endereco: string;
}

function parseNumberBr(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(value.replace(/\./g, ",").replace(",", "."));
}

export async function processExcelFileCadastroProduto(
  file: File
): Promise<CadastroProdutoItem[]> {
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

        const result: CadastroProdutoItem[] = jsonData.map((item) => ({
          codSku: String(item["Cod_SKU"] ?? "").trim(),
          descSku: String(item["Descricao_SKU"] ?? "").trim(),
          shelf: parseInt(item["Shelf_Life"]) || 0,
          tipoPeso: parseInt(item["Tipo_Peso"]) || 0,
          pesoCaixa: parseNumberBr(item["Peso_Liq(cx)"]),
          unidadeCaixa: parseInt(item["Un_Cx"]) || 0,
          caixaPallet: parseInt(item["Cx_Pallet"]) || 0,
          linha: String(item["Linha"] ?? "").trim(),
          vermelhaFaixa: parseNumberBr(item["Vermelho"]),
          laranjaFaixa: parseNumberBr(item["Laranja"]),
          amareloFaixa: parseNumberBr(item["Amarelo"]),
          verdeFaixa: parseNumberBr(item["Verde"]),
          pickWay: parseInt(item["PickWay"]) || 0,
          endereco: String(item["Endereço"] ?? "").trim(),
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
