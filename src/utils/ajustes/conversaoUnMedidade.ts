type ReturnProps = {
  caixas: number;
  unidades: number;
};
export default function conversaoUM(
  venda: number,
  unMedida: string
): ReturnProps {
  if (unMedida === "UN" || unMedida === "CJ" || unMedida === "PC") {
    return { unidades: venda, caixas: 0 };
  } else {
    return { unidades: 0, caixas: venda };
  }
}
