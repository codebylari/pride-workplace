import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  ratedUserId: string;
  ratedUserName: string;
  isRatingCandidate: boolean;
  onSuccess?: () => void;
}

export function RatingDialog({
  open,
  onOpenChange,
  applicationId,
  ratedUserId,
  ratedUserName,
  isRatingCandidate,
  onSuccess,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma avaliação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para avaliar.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("ratings").insert({
        application_id: applicationId,
        rater_id: user.id,
        rated_user_id: ratedUserId,
        rating: rating,
        comment: comment.trim() || null,
      });

      if (error) {
        console.error("Error submitting rating:", error);
        toast({
          title: "Erro ao enviar avaliação",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Avaliação enviada!",
        description: `Você avaliou ${ratedUserName} com ${rating.toFixed(1)} estrelas.`,
      });

      setRating(0);
      setComment("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro ao enviar avaliação",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (star: number, isHalf: boolean) => {
    setRating(isHalf ? star - 0.5 : star);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Avaliar {isRatingCandidate ? "Candidato" : "Empresa"}
          </DialogTitle>
          <DialogDescription>
            Como foi sua experiência com {ratedUserName}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium">Selecione uma avaliação:</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative">
                  <button
                    type="button"
                    onClick={() => handleStarClick(star, false)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={40}
                      className={
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                  {/* Half star button */}
                  <button
                    type="button"
                    onClick={() => handleStarClick(star, true)}
                    onMouseEnter={() => setHoveredRating(star - 0.5)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="absolute left-0 top-0 w-1/2 h-full transition-opacity hover:opacity-100 opacity-0 focus:outline-none"
                    style={{ zIndex: 10 }}
                  />
                </div>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating.toFixed(1)} estrelas
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comentário (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="Compartilhe sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {comment.length}/500 caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
