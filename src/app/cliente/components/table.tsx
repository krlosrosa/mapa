import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ItemRemessa } from "../types";
type Props = {
  data: ItemRemessa[]
}
export default function TableMapa({data}:Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transporte</TableHead>
          <TableHead>Remessa</TableHead>
          <TableHead>Item Remessa</TableHead>
          <TableHead>Centro</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Nome Empresa</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Cód. Item</TableHead>
          <TableHead>Desc. Item</TableHead>
          <TableHead>Lote</TableHead>
          <TableHead>Venda</TableHead>
          <TableHead>Un. Medida</TableHead>
          <TableHead>Fabricação</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Cód. Cliente</TableHead>
          <TableHead>Nome Cliente</TableHead>
          <TableHead>Peso Bruto</TableHead>
          <TableHead>Peso Líquido</TableHead>
          <TableHead>Cód. SKU</TableHead>
          <TableHead>Desc. SKU</TableHead>
          <TableHead>Shelf</TableHead>
          <TableHead>Tipo Peso</TableHead>
          <TableHead>Peso Caixa</TableHead>
          <TableHead>Unidade Caixa</TableHead>
          <TableHead>Caixa Pallet</TableHead>
          <TableHead>Linha</TableHead>
          <TableHead>Vermelha Faixa</TableHead>
          <TableHead>Laranja Faixa</TableHead>
          <TableHead>Amarelo Faixa</TableHead>
          <TableHead>Verde Faixa</TableHead>
          <TableHead>Pick Way</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Caixas</TableHead>
          <TableHead>Unidades</TableHead>
          <TableHead>Faixa</TableHead>
          <TableHead>Pallet Completo</TableHead>
          <TableHead>% PAllet</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={`${item.remessa}-${item.itemRemessa}`}>
            <TableCell>{item.transporte}</TableCell>
            <TableCell>{item.remessa}</TableCell>
            <TableCell>{item.itemRemessa}</TableCell>
            <TableCell>{item.centro}</TableCell>
            <TableCell>{item.empresa}</TableCell>
            <TableCell>{item.nomeEmpresa}</TableCell>
            <TableCell>{item.placa}</TableCell>
            <TableCell>{item.codItem}</TableCell>
            <TableCell>{item.descItem}</TableCell>
            <TableCell>{item.lote}</TableCell>
            <TableCell>{item.venda}</TableCell>
            <TableCell>{item.unMedidade}</TableCell>
            <TableCell>{item.fabricacao.toLocaleDateString()}</TableCell>
            <TableCell>{item.vencimento.toLocaleDateString()}</TableCell>
            <TableCell>{item.codCliente}</TableCell>
            <TableCell>{item.nomeCliente}</TableCell>
            <TableCell>{item.pesoBruto}</TableCell>
            <TableCell>{item.pesoLiquido}</TableCell>
            <TableCell>{item.codSku}</TableCell>
            <TableCell>{item.descSku}</TableCell>
            <TableCell>{item.shelf}</TableCell>
            <TableCell>{item.tipoPeso}</TableCell>
            <TableCell>{item.pesoCaixa}</TableCell>
            <TableCell>{item.unidadeCaixa}</TableCell>
            <TableCell>{item.caixaPallet}</TableCell>
            <TableCell>{item.linha}</TableCell>
            <TableCell>{item.vermelhaFaixa}</TableCell>
            <TableCell>{item.laranjaFaixa}</TableCell>
            <TableCell>{item.amareloFaixa}</TableCell>
            <TableCell>{item.verdeFaixa}</TableCell>
            <TableCell>{item.pickWay}</TableCell>
            <TableCell>{item.endereco}</TableCell>
            <TableCell>{item.caixas || "-"}</TableCell>
            <TableCell>{item.unidades || "-"}</TableCell>
            <TableCell>{item.faixa || "-"}</TableCell>
            <TableCell>{item.palletsCompleto || "-"}</TableCell>
            <TableCell>{item.percentPallet || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
