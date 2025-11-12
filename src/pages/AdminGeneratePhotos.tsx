import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminGeneratePhotos() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const { toast } = useToast();

  const generateCandidatePhotos = async () => {
    setLoading(true);
    setProgress("Buscando candidatos sem fotos...");

    try {
      // Buscar candidatos sem fotos
      const { data: candidates, error } = await supabase
        .from("profiles")
        .select("id, full_name, gender")
        .or("photo_url.is.null,photo_url.eq.");

      if (error) throw error;

      setProgress(`Encontrados ${candidates?.length || 0} candidatos. Gerando fotos...`);

      for (let i = 0; i < (candidates?.length || 0); i++) {
        const candidate = candidates[i];
        const genderPrompt = 
          candidate.gender?.toLowerCase().includes("feminino") 
            ? "professional woman" 
            : candidate.gender?.toLowerCase().includes("masculino")
            ? "professional man"
            : "professional person";

        setProgress(`Gerando foto ${i + 1}/${candidates.length} - ${candidate.full_name}...`);

        // Gerar imagem via edge function
        const { data: imageData, error: imageError } = await supabase.functions.invoke(
          "generate-profile-image",
          {
            body: {
              prompt: `Generate a professional headshot photo of a ${genderPrompt}, neutral background, business casual attire, smiling, high quality portrait`,
              type: "candidate"
            }
          }
        );

        if (imageError) throw imageError;
        const imageUrl = imageData?.imageUrl;

        if (imageUrl) {
          // Converter base64 para blob
          const base64Data = imageUrl.split(',')[1];
          const blob = await fetch(`data:image/png;base64,${base64Data}`).then(r => r.blob());

          // Upload para Supabase Storage
          const fileName = `${candidate.id}.png`;
          const { error: uploadError } = await supabase.storage
            .from("profile-photos")
            .upload(fileName, blob, { upsert: true });

          if (uploadError) throw uploadError;

          // Obter URL pública
          const { data: { publicUrl } } = supabase.storage
            .from("profile-photos")
            .getPublicUrl(fileName);

          // Atualizar perfil
          await supabase
            .from("profiles")
            .update({ photo_url: publicUrl })
            .eq("id", candidate.id);
        }
      }

      setProgress("Concluído!");
      toast({
        title: "Fotos geradas com sucesso!",
        description: `${candidates?.length || 0} fotos de candidatos foram adicionadas.`,
      });
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro ao gerar fotos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCompanyLogos = async () => {
    setLoading(true);
    setProgress("Buscando empresas sem logos...");

    try {
      // Buscar empresas sem logos
      const { data: companies, error } = await supabase
        .from("company_profiles")
        .select("user_id, fantasy_name")
        .or("logo_url.is.null,logo_url.eq.");

      if (error) throw error;

      setProgress(`Encontradas ${companies?.length || 0} empresas. Gerando logos...`);

      for (let i = 0; i < (companies?.length || 0); i++) {
        const company = companies[i];

        setProgress(`Gerando logo ${i + 1}/${companies.length} - ${company.fantasy_name}...`);

        // Gerar logo via edge function
        const { data: imageData, error: imageError } = await supabase.functions.invoke(
          "generate-profile-image",
          {
            body: {
              prompt: `Generate a modern, professional company logo for "${company.fantasy_name}", clean design, minimalist, suitable for tech/business company, square format`,
              type: "company"
            }
          }
        );

        if (imageError) throw imageError;
        const imageUrl = imageData?.imageUrl;

        if (imageUrl) {
          // Converter base64 para blob
          const base64Data = imageUrl.split(',')[1];
          const blob = await fetch(`data:image/png;base64,${base64Data}`).then(r => r.blob());

          // Upload para Supabase Storage
          const fileName = `company_${company.user_id}.png`;
          const { error: uploadError } = await supabase.storage
            .from("profile-photos")
            .upload(fileName, blob, { upsert: true });

          if (uploadError) throw uploadError;

          // Obter URL pública
          const { data: { publicUrl } } = supabase.storage
            .from("profile-photos")
            .getPublicUrl(fileName);

          // Atualizar perfil da empresa
          await supabase
            .from("company_profiles")
            .update({ logo_url: publicUrl })
            .eq("user_id", company.user_id);
        }
      }

      setProgress("Concluído!");
      toast({
        title: "Logos gerados com sucesso!",
        description: `${companies?.length || 0} logos de empresas foram adicionados.`,
      });
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro ao gerar logos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Gerar Fotos e Logos Automáticos</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Candidatos sem Fotos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gera fotos profissionais automaticamente para todos os candidatos que não possuem foto,
              respeitando o gênero cadastrado.
            </p>
            <Button
              onClick={generateCandidatePhotos}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Fotos dos Candidatos"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empresas sem Logos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gera logos profissionais automaticamente para todas as empresas que não possuem logo,
              baseado no nome fantasia.
            </p>
            <Button
              onClick={generateCompanyLogos}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Logos das Empresas"
              )}
            </Button>
          </CardContent>
        </Card>

        {progress && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm">{progress}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
