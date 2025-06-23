import * as XLSX from "xlsx";
function parseNumberBr(value: string | number): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(value.replace(/\./g, "").replace(",", "."));
}

export interface RemessasItem {
  transporte: string;
  remessa: string;
  itemRemessa: string;
  centro: string;
  empresa: string;
  nomeEmpresa: string;
  placa: string;
  codItem: string;
  descItem: string;
  lote: string;
  venda: number;
  unMedidade: string;
  fabricacao: Date;
  vencimento: Date;
  codCliente: string;
  nomeCliente: string;
  pesoBruto: number;
  pesoLiquido: number;
}

export async function processExcelFileRemessaItem(file: File): Promise<RemessasItem[]> {
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

        const result: RemessasItem[] = jsonData.map((item) => ({
          transporte: String(item["Nº transporte(DT)"] ?? "").trim(),
          remessa: String(item["Remessa"] ?? "").trim(),
          itemRemessa: String(item["Nº item remessa"] ?? "").trim(),
          centro: String(item["Centro"] ?? "").trim(),
          empresa: String(item["Empresa"] ?? "").trim(),
          nomeEmpresa: String(item["Nome Empresa"] ?? "").trim(),
          placa: String(item["Descrição do produto"] ?? "").trim(),
          codItem: String(item["Cód. Item"] ?? "").trim(),
          descItem: String(item["Descrição do produto"] ?? "").trim(),
          lote: String(item["Lote"] ?? "").trim(),
          venda: parseNumberBr(item["Total(Unid.Vda.)"]),
          unMedidade: String(item["Unid.Armaz."] ?? "").trim(),
          fabricacao: new Date(item["Dt.Fabricação"]),
          vencimento: new Date(item["Dt.Vencimento"]),
          codCliente: String(item["Cód. Cliente"] ?? "").trim(),
          nomeCliente: String(item["Nome Cliente"] ?? "").trim(),
          pesoBruto: parseNumberBr(item["Peso Bruto"]),
          pesoLiquido: parseNumberBr(item["Peso Líquido"]),
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
