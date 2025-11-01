import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function CompanyViewCandidateProfileAlias() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      navigate(`/candidate-profile/${id}`, { replace: true });
    } else {
      toast({
        title: "Rota antiga",
        description: "Use o botão 'Ver Perfil' na lista de candidatos ou acesse /candidate-profile/:id",
      });
      navigate("/company-jobs", { replace: true });
    }
  }, [navigate, searchParams, toast]);

  return null;
}
