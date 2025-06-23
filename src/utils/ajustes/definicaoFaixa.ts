export default function definirFaixa(shelf: number, vencimento: Date): number {
  const hoje = new Date();

  // Calcula a data de fabricação com base no vencimento e shelf (dias de validade)
  const dataFabricacao = new Date(vencimento);
  dataFabricacao.setDate(dataFabricacao.getDate() - shelf);

  const totalMs = vencimento.getTime() - dataFabricacao.getTime();
  const usadoMs = hoje.getTime() - dataFabricacao.getTime();

  // Proteção contra valores fora da faixa
  if (totalMs <= 0) return 100;
  if (usadoMs <= 0) return 0;

  const percentual = (usadoMs / totalMs) * 100;

  // Limita o valor entre 0 e 100
  return Math.min(100, Math.max(0, percentual));
}