"use client";
import { useCadastroItemStore } from "@/store/cadastroItemStore";
import { useRemessaStore } from "@/store/remessasStore";
import { useRoteirizacaoStore } from "@/store/roteirizacaoStrore";
import { CadastroProdutoItem } from "@/utils/uploads/cadastrosProdutos";
import { RemessasItem } from "@/utils/uploads/remessas";
import { RoteirizacaoItem } from "@/utils/uploads/roterizacao";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Package, Truck, CheckCircle2 } from "lucide-react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SeparacaoItem, useSeparacaoStore } from "@/store/separacaoStore";
import conversaoUM from "@/utils/ajustes/conversaoUnMedidade";
import definirFaixa from "@/utils/ajustes/definicaoFaixa";

export default function Validacao() {
  const { dataSeparacao, setDataSeparacao } = useSeparacaoStore();
  const { dataRemessa } = useRemessaStore();
  const { dataRoteirizacao } = useRoteirizacaoStore();
  const { dataCadastroItem } = useCadastroItemStore();
  const [itensSemCadastro, setItensSemCadastro] = useState<RemessasItem[]>([]);
  const [transporteSemCadastro, setTransporteSemCadastro] = useState<
    RemessasItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  function ajustarInformacoesIniciais() {
    const ajusteDados: SeparacaoItem[] = dataRemessa.map((item) => {
      const infoProduto = _.find(
        dataCadastroItem,
        (find: CadastroProdutoItem) => find.codSku === item.codItem
      );
      const { caixas, unidades } = conversaoUM(item.venda, item.unMedidade);
      return {
        ...item,
        caixas,
        unidades,
        faixa: definirFaixa(infoProduto?.shelf as number, item.vencimento),
        categoria: infoProduto?.linha as string,
      };
    });
    setDataSeparacao(ajusteDados);
    router.push("/impressao");
  }

  useEffect(() => {
    setLoading(true);

    // Limpar estados anteriores
    setItensSemCadastro([]);
    setTransporteSemCadastro([]);

    // Filtrar itens sem cadastro
    const itensSemCadastroTemp: RemessasItem[] = [];
    _.forEach(dataRemessa, (item) => {
      const validarDados = _.find(
        dataCadastroItem,
        (find: CadastroProdutoItem) => find.codSku === item.codItem
      );

      if (!validarDados) {
        itensSemCadastroTemp.push(item);
      }
    });

    // Filtrar transportes sem cadastro
    const transporteSemCadastroTemp: RemessasItem[] = [];
    _.forEach(dataRemessa, (item) => {
      const validarDados = _.find(
        dataRoteirizacao,
        (find: RoteirizacaoItem) => find.transporte === item.transporte
      );

      if (!validarDados) {
        transporteSemCadastroTemp.push(item);
      }
    });

    setItensSemCadastro(itensSemCadastroTemp);
    setTransporteSemCadastro(transporteSemCadastroTemp);
    setLoading(false);
  }, [dataRemessa, dataCadastroItem, dataRoteirizacao]);

  const itensUnicos = _.unionBy(itensSemCadastro, "codItem");
  const transportesUnicos = _.unionBy(transporteSemCadastro, "transporte");
  const totalItens = _.unionBy(dataRemessa, "codItem").length;
  const totalTransportes = _.unionBy(dataRemessa, "transporte").length;
  const hasErrors = itensUnicos.length > 0; // Apenas itens sem cadastro são impeditivos
  const hasWarnings = transportesUnicos.length > 0;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Validando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Validação de Dados
          </h1>
          <p className="text-muted-foreground">
            Verificação de inconsistências nos arquivos importados
          </p>
        </div>
        <Badge
          variant={
            hasErrors ? "destructive" : hasWarnings ? "secondary" : "default"
          }
          className="text-sm"
        >
          {hasErrors
            ? "Erros Críticos"
            : hasWarnings
            ? "Avisos"
            : "Dados Válidos"}
        </Badge>
      </div>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasErrors ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : hasWarnings ? (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
            Resumo da Validação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total de Itens Únicos */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{totalItens}</div>
              <div className="text-sm text-muted-foreground">Itens Únicos</div>
            </div>

            {/* Total de Transportes */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{totalTransportes}</div>
              <div className="text-sm text-muted-foreground">Transportes</div>
            </div>

            {/* Itens sem Cadastro */}
            <div className="text-center p-4 bg-muted rounded-lg border border-destructive/20">
              <div className="text-2xl font-bold text-destructive">
                {itensUnicos.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Itens sem Cadastro
              </div>
            </div>

            {/* Transportes Incompletos */}
            <div className="text-center p-4 bg-muted rounded-lg border border-yellow-300/20">
              <div className="text-2xl font-bold text-yellow-600">
                {transportesUnicos.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Transportes Incompletos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {hasErrors && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erros críticos encontrados!</strong> Existem produtos sem
            cadastro que impedem o processamento da remessa. Corrija os
            problemas antes de prosseguir.
          </AlertDescription>
        </Alert>
      )}

      {!hasErrors && hasWarnings && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Alguns transportes não possuem roteirização cadastrada. Isso não
            impede o processamento, mas pode afetar a eficiência logística.
          </AlertDescription>
        </Alert>
      )}

      {!hasErrors && !hasWarnings && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Todos os dados foram validados com sucesso! Não foram encontradas
            inconsistências.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Itens sem Cadastro - CRÍTICO */}
        <Card className={itensUnicos.length > 0 ? "border-destructive" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos sem Cadastro
              <Badge variant="destructive" className="ml-auto">
                {itensUnicos.length}
              </Badge>
              {itensUnicos.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  CRÍTICO
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Produtos da remessa que não possuem cadastro no sistema -{" "}
              <strong>Impedem o processamento</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itensUnicos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                <p>Todos os itens possuem cadastro válido</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {itensUnicos.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">
                          Código: {item.codItem}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {item.descItem}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        Remessa: {item.remessa}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transportes sem Cadastro - INFORMATIVO */}
        <Card
          className={transportesUnicos.length > 0 ? "border-yellow-300" : ""}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Transportes sem Roteirização
              <Badge variant="secondary" className="ml-auto">
                {transportesUnicos.length}
              </Badge>
              {transportesUnicos.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs border-yellow-300 text-yellow-700"
                >
                  INFORMATIVO
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Transportadoras sem roteirização cadastrada -{" "}
              <strong>Não impede o processamento</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transportesUnicos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                <p>Todos os transportes possuem roteirização válida</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transportesUnicos.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">
                          Transporte: {item.transporte}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Item: {item.codItem} - {item.descItem}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        Remessa: {item.remessa}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Ações */}
      {(hasErrors || hasWarnings) && (
        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>
              {hasErrors
                ? "Ações obrigatórias para resolver problemas críticos"
                : "Recomendações para otimizar o processo"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itensUnicos.length > 0 && (
                <div className="flex items-start gap-3 p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="rounded-full bg-destructive/10 p-1">
                    <Package className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-destructive">
                      🚨 Ação Obrigatória
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Cadastre os{" "}
                      <strong>{itensUnicos.length} produtos faltantes</strong>{" "}
                      no sistema antes de processar a remessa. Sem isso, o
                      processamento será bloqueado.
                    </div>
                  </div>
                </div>
              )}
              {transportesUnicos.length > 0 && (
                <div className="flex items-start gap-3 p-3 border border-yellow-300/20 rounded-lg bg-yellow-50/50">
                  <div className="rounded-full bg-yellow-100 p-1">
                    <Truck className="h-4 w-4 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-yellow-800">
                      💡 Recomendação
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Ajuste o arquivo de Roteirização para todas as informações
                      sairem no mapa de separação
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Botão de Continuar */}
      <div className="flex justify-end pt-6">
        <button
          onClick={ajustarInformacoesIniciais}
          disabled={hasErrors}
          className={`px-6 py-2 rounded-md font-medium ${
            hasErrors
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          Continuar Processamento
        </button>
      </div>
    </div>
  );
}
