import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransportePage from "../transporte/page";
import ClientePage from "../cliente/page";

export default function ImpressaoPage() {
  return (
    <div>
      <Tabs defaultValue="Transporte">
        <TabsList>
          <TabsTrigger value="Transporte">Transporte</TabsTrigger>
          <TabsTrigger value="Cliente">Cliente</TabsTrigger>
        </TabsList>
        <TabsContent value="Transporte">
          <TransportePage />
        </TabsContent>
        <TabsContent value="Cliente">
          <ClientePage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
