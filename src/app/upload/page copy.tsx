'use client'
import { Button } from "@/components/ui/button";
import CadastroProdutoPage from "./_components/_upload_cadastro";
import CadastroRoteirizacaoPage from "./_components/_upload_roterizacao";
import CadastroRemessaPage from "./_components/_uploadRemessa";
import { useRouter } from "next/navigation";

export default function Page() {

  const router = useRouter()

  return (
    <div className="">
      <CadastroRemessaPage />
      <CadastroProdutoPage />
      <CadastroRoteirizacaoPage />
      <div className=" flex justify-center items-center">
        <Button onClick={()=> {router.push("/validacao")}} >Cadastrar</Button>
      </div>
    </div>
  );
}
