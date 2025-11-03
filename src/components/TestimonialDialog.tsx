import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
}

export function TestimonialDialog({
  open,
  onOpenChange,
  applicationId,
  companyId,
  companyName,
  jobTitle,
}: TestimonialDialogProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva um comentário",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("testimonials").insert({
        application_id: applicationId,
        candidate_id: user.id,
        company_id: companyId,
        job_title: jobTitle,
        comment: comment.trim(),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Depoimento Enviado!",
        description: `Seu depoimento sobre ${companyName} foi enviado para aprovação.`,
      });

      setComment("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao enviar depoimento:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o depoimento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Deixe seu depoimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Como foi sua experiência trabalhando como <strong>{jobTitle}</strong> na empresa <strong>{companyName}</strong>?
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Seu comentário
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Compartilhe sua experiência, o ambiente de trabalho, aprendizados e qualquer feedback sobre trabalhar nesta empresa..."
              className="min-h-[150px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <Star className="w-4 h-4 inline mr-1" />
              Seu depoimento será enviado para aprovação da empresa antes de aparecer no perfil público.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !comment.trim()}
            className="bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800"
          >
            {loading ? "Enviando..." : "Enviar Depoimento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}