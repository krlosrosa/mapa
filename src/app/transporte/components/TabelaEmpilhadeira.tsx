"use client";

import { BlocoSeparacao } from "../_organizarSeparacao";


interface Props {
  bloco: BlocoSeparacao;
}

export function TabelaEmpilhadeira({ bloco }: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left p-2">Item</th>
          <th className="text-left p-2">Descrição</th>
          <th className="text-left p-2">Lote</th>
          <th className="text-left p-2">Endereço</th>
          <th className="text-left p-2" colSpan={2}>
            Qtd. Pallets
          </th>
        </tr>
      </thead>
      <tbody>
        {bloco.itens.map((item, i) => (
          <tr key={i} className="border-t hover:bg-gray-50">
            <td className="p-2">{item.codItem}</td>
            <td className="p-2">{item.descItem}</td>
            <td className="p-2">{item.lote}</td>
            <td className="p-2 font-mono">{item.endereco}</td>
            <td className="p-2" colSpan={2}>
              {item.palletsCompleto ?? 1}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
