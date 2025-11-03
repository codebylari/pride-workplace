import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: {
    fullName: string;
    aboutMe?: string;
    experience?: string;
    education?: string;
    journey?: string;
  };
  onResumeGenerated: (resumeUrl: string) => void;
}

export function AIResumeDialog({ open, onOpenChange, profileData, onResumeGenerated }: AIResumeDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateResume = async () => {
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume', {
        body: {
          fullName: profileData.fullName,
          aboutMe: profileData.aboutMe || '',
          experience: profileData.experience || '',
          education: profileData.education || '',
          journey: profileData.journey || '',
        }
      });

      if (error) throw error;

      if (data?.resumeUrl) {
        onResumeGenerated(data.resumeUrl);
        toast({
          title: "Currículo gerado!",
          description: "Seu currículo foi criado com sucesso pela IA.",
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Erro ao gerar currículo:', error);
      toast({
        title: "Erro ao gerar currículo",
        description: error.message || "Não foi possível gerar o currículo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-purple-500" size={24} />
            Criar Currículo com IA
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            A IA irá criar um currículo profissional em PDF usando as informações do seu perfil:
          </p>
          
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Nome e informações básicas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Sobre mim</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Experiências profissionais</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Formação acadêmica</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Jornada profissional</span>
            </li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Dica: Preencha todas as seções do seu perfil para obter um currículo mais completo!
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGenerateResume}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Currículo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
