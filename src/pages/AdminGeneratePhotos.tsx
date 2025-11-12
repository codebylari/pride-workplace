import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AdminGeneratePhotos() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    candidatesProcessed: number;
    candidatesSuccess: number;
    candidatesFailed: number;
    companiesProcessed: number;
    companiesSuccess: number;
    companiesFailed: number;
    errors: string[];
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    autoGenerateAll();
  }, []);

  const autoGenerateAll = async () => {
    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('auto-generate-profile-images');

      if (error) throw error;

      setResults(data);
      
      const totalSuccess = data.candidatesSuccess + data.companiesSuccess;
      const totalFailed = data.candidatesFailed + data.companiesFailed;

      toast({
        title: "Geração Concluída",
        description: `${totalSuccess} imagens geradas com sucesso${totalFailed > 0 ? `, ${totalFailed} falharam` : ''}`,
        variant: totalFailed > 0 ? "destructive" : "default",
      });
    } catch (error: any) {
      console.error("Error in auto generation:", error);
      toast({
        title: "Erro na Geração Automática",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Geração Automática de Imagens</h1>
        <p className="text-muted-foreground">
          Gerando automaticamente fotos de perfil para candidatos e logos para empresas usando IA
        </p>

        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-lg">Processando imagens...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {results && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Candidatos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Processados: {results.candidatesProcessed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Sucesso: {results.candidatesSuccess}</span>
                </div>
                {results.candidatesFailed > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Falhas: {results.candidatesFailed}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empresas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Processados: {results.companiesProcessed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Sucesso: {results.companiesSuccess}</span>
                </div>
                {results.companiesFailed > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Falhas: {results.companiesFailed}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {results && results.errors.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Erros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {results.errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
