"use client";

import { BlocoSeparacao } from "../_organizarSeparacao";

interface Props {
  bloco: BlocoSeparacao;
}

export function TabelaSeparador({ bloco }: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left p-2">Endereço</th>
          <th className="text-left p-2">Item</th>
          <th className="text-left p-2">Descrição</th>
          <th className="text-left p-2">Lote</th>
          <th className="text-left p-2">Fabricação</th>
          <th className="text-left p-2">Faixa</th>
          <th className="text-left p-2">Caixas</th>
          <th className="text-left p-2">Unidades</th>
        </tr>
      </thead>
      <tbody>
        {bloco.itens.map((item, i) => (
          <tr
            key={i}
            className={`${
              item.faixa === "verde" ? "" : "font-bold bg-slate-100"
            } border-t hover:bg-gray-50`}
          >
            <td className="p-2 font-mono">{item.endereco.substring(0, 10)}</td>
            <td className="p-2">{item.codItem}</td>
            <td className="p-2">{item.descItem}</td>
            <td className="p-2">{item.lote}</td>
            <td className="p-2">
              {item.fabricacao.toLocaleDateString("pt-BR")}
            </td>
            <td className="p-2">{item.faixa === "verde" ? "" : item.faixa}</td>
            <td className="p-2">{item.caixas ?? 0}</td>
            <td className="p-2">{item.unidades ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
