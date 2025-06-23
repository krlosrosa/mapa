"use client";

import { useReactToPrint } from "react-to-print";
import { RefObject } from "react";

export function useHandlePrint(printRef: RefObject<HTMLElement | null>) {
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Mapa de Separação",
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-size: 12px;
          margin: 0;
          padding: 0;
        }
        .print-area * {
          visibility: visible;
        }
        .no-print {
          display: none !important;
        }
        .grupo-page-break {
          page-break-after: always;
        }
        .grupo-page-break:last-child {
          page-break-after: auto;
        }
        .responsavel-page-break {
          page-break-before: always;
        }
        .bloco-impressao {
          page-break-inside: avoid;
          break-inside: avoid;
          margin-bottom: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 2px 4px;
          border: 1px solid #ddd;
        }
      }
    `,
  });

  return { handlePrint };
}
