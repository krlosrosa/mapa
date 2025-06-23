'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Route, Package, ArrowRight, AlertCircle } from "lucide-react";
import { useRemessaStore } from "@/store/remessasStore";
import { useCadastroItemStore } from "@/store/cadastroItemStore";
import { processExcelFileRemessaItem } from "@/utils/uploads/remessas";
import { processExcelFileCadastroProduto } from "@/utils/uploads/cadastrosProdutos";
import { processExcelFileRoteirizacao } from "@/utils/uploads/roterizacao";
import { useRoteirizacaoStore } from "@/store/roteirizacaoStrore";

interface UploadStatus {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  progress: number;
  fileName?: string;
}

export default function FileUploadLayout() {
  const { setDataRemessa } = useRemessaStore();
  const { setDataCadastroItem } = useCadastroItemStore();
  const { setDataRoteirizacao } = useRoteirizacaoStore();
  const router = useRouter();

  const [uploadStatus, setUploadStatus] = useState<{
    remessa: UploadStatus;
    produto: UploadStatus;
    roteirizacao: UploadStatus;
  }>({
    remessa: { isLoading: false, isSuccess: false, error: null, progress: 0 },
    produto: { isLoading: false, isSuccess: false, error: null, progress: 0 },
    roteirizacao: { isLoading: false, isSuccess: false, error: null, progress: 0 },
  });

  const handleFileUpload = async (
    file: File,
    type: 'remessa' | 'produto' | 'roteirizacao'
  ) => {
    if (!file) return;

    setUploadStatus(prev => ({
      ...prev,
      [type]: { 
        isLoading: true, 
        isSuccess: false, 
        error: null, 
        progress: 0,
        fileName: file.name
      }
    }));

    try {
      const timer = setInterval(() => {
        setUploadStatus(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            progress: prev[type].progress >= 90 ? prev[type].progress : prev[type].progress + 10
          }
        }));
      }, 200);

      let result;
      switch (type) {
        case 'remessa':
          result = await processExcelFileRemessaItem(file);
          setDataRemessa(result);
          break;
        case 'produto':
          result = await processExcelFileCadastroProduto(file);
          setDataCadastroItem(result);
          break;
        case 'roteirizacao':
          result = await processExcelFileRoteirizacao(file);
          setDataRoteirizacao(result);
          break;
      }

      clearInterval(timer);
      setUploadStatus(prev => ({
        ...prev,
        [type]: { 
          isLoading: false, 
          isSuccess: true, 
          error: null, 
          progress: 100,
          fileName: file.name
        }
      }));
    } catch (err) {
      setUploadStatus(prev => ({
        ...prev,
        [type]: { 
          isLoading: false, 
          isSuccess: false, 
          error: `Erro ao processar arquivo ${type}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`, 
          progress: 0,
          fileName: file.name
        }
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'remessa' | 'produto' | 'roteirizacao') => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(fileExtension)) {
        setUploadStatus(prev => ({
          ...prev,
          [type]: { 
            isLoading: false, 
            isSuccess: false, 
            error: 'Formato de arquivo inválido. Use apenas arquivos Excel (.xlsx, .xls)', 
            progress: 0,
            fileName: file.name
          }
        }));
        return;
      }

      handleFileUpload(file, type);
    }
  };

  const isAllUploadsComplete = uploadStatus.remessa.isSuccess && uploadStatus.produto.isSuccess;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Cadastro de Arquivos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Faça upload dos arquivos Excel necessários para prosseguir com a impressão.
            Os dois primeiros são obrigatórios.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-sm">
            <div className={`flex items-center space-x-2 ${uploadStatus.remessa.isSuccess ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${uploadStatus.remessa.isSuccess ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium">Remessa</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center space-x-2 ${uploadStatus.produto.isSuccess ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${uploadStatus.produto.isSuccess ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium">Produto</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center space-x-2 ${uploadStatus.roteirizacao.isSuccess ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${uploadStatus.roteirizacao.isSuccess ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium">Roteirização</span>
            </div>
          </div>
        </div>

        {/* Upload Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Remessa Card */}
          <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
            uploadStatus.remessa.isSuccess ? 'border-green-200 bg-green-50' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  uploadStatus.remessa.isSuccess ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {uploadStatus.remessa.isSuccess ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <CardTitle className="text-lg">Cadastro de Remessa</CardTitle>
                  <CardDescription className="text-sm">
                    {uploadStatus.remessa.isSuccess 
                      ? 'Arquivo carregado com sucesso' 
                      : 'Upload do arquivo Excel com dados de remessa'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={(e) => handleFileChange(e, 'remessa')}
                disabled={uploadStatus.remessa.isLoading}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              
              {uploadStatus.remessa.fileName && (
                <p className="text-sm text-gray-600">
                  Arquivo: {uploadStatus.remessa.fileName}
                </p>
              )}
              
              {uploadStatus.remessa.isLoading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadStatus.remessa.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Processando... {uploadStatus.remessa.progress}%
                  </p>
                </div>
              )}

              {uploadStatus.remessa.error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {uploadStatus.remessa.error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Produto Card */}
          <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
            uploadStatus.produto.isSuccess ? 'border-green-200 bg-green-50' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  uploadStatus.produto.isSuccess ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {uploadStatus.produto.isSuccess ? <CheckCircle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <div>
                  <CardTitle className="text-lg">Cadastro de Produto</CardTitle>
                  <CardDescription className="text-sm">
                    {uploadStatus.produto.isSuccess 
                      ? 'Arquivo carregado com sucesso' 
                      : 'Upload do arquivo Excel com dados de produtos'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={(e) => handleFileChange(e, 'produto')}
                disabled={uploadStatus.produto.isLoading}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              
              {uploadStatus.produto.fileName && (
                <p className="text-sm text-gray-600">
                  Arquivo: {uploadStatus.produto.fileName}
                </p>
              )}
              
              {uploadStatus.produto.isLoading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadStatus.produto.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Processando... {uploadStatus.produto.progress}%
                  </p>
                </div>
              )}

              {uploadStatus.produto.error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {uploadStatus.produto.error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roteirização Card */}
          <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
            uploadStatus.roteirizacao.isSuccess ? 'border-green-200 bg-green-50' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  uploadStatus.roteirizacao.isSuccess ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {uploadStatus.roteirizacao.isSuccess ? <CheckCircle className="w-5 h-5" /> : <Route className="w-5 h-5" />}
                </div>
                <div>
                  <CardTitle className="text-lg">Cadastro de Roteirização</CardTitle>
                  <CardDescription className="text-sm">
                    {uploadStatus.roteirizacao.isSuccess 
                      ? 'Arquivo carregado com sucesso' 
                      : 'Upload do arquivo Excel com dados de roteirização'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={(e) => handleFileChange(e, 'roteirizacao')}
                disabled={uploadStatus.roteirizacao.isLoading}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              
              {uploadStatus.roteirizacao.fileName && (
                <p className="text-sm text-gray-600">
                  Arquivo: {uploadStatus.roteirizacao.fileName}
                </p>
              )}
              
              {uploadStatus.roteirizacao.isLoading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadStatus.roteirizacao.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Processando... {uploadStatus.roteirizacao.progress}%
                  </p>
                </div>
              )}

              {uploadStatus.roteirizacao.error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {uploadStatus.roteirizacao.error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-8">
          <Button
            disabled={!isAllUploadsComplete}
            size="lg"
            className={`px-8 py-3 text-lg font-semibold transition-all duration-200 ${
              isAllUploadsComplete 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
            onClick={() => {
              if (isAllUploadsComplete) {
                router.push('/validacao');
              }
            }}
          >
            {isAllUploadsComplete ? 'Continuar para Validação' : 'Complete todos os uploads obrigatórios'}
          </Button>
        </div>
      </div>
    </div>
  );
}