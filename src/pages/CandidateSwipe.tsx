import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Heart, Star, MapPin, Building2, Briefcase, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CandidateSidebar } from "@/components/CandidateSidebar";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string | null;
  job_type: string;
  requirements: string | null;
  company_id: string;
  company_profiles?: {
    fantasy_name: string;
    logo_url: string | null;
    sector: string | null;
  };
}

export default function CandidateSwipe() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [swipedJobs, setSwipedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
    fetchJobs();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
  };

  const fetchJobs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Buscar jobs que o candidato ainda não deu swipe
      const { data: swipesData } = await supabase
        .from("swipes")
        .select("target_id")
        .eq("user_id", session.user.id)
        .eq("target_type", "job");

      const swipedJobIds = swipesData?.map(s => s.target_id) || [];
      setSwipedJobs(new Set(swipedJobIds));

      // Buscar vagas disponíveis
      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select(`
          *,
          company_profiles!inner(fantasy_name, logo_url, sector)
        `)
        .not("id", "in", `(${swipedJobIds.join(",") || "null"})`)
        .limit(20);

      if (error) throw error;
      setJobs(jobsData || []);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vagas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: "like" | "dislike" | "super_like") => {
    const currentJob = jobs[currentIndex];
    if (!currentJob) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Salvar swipe
      const { error } = await supabase.from("swipes").insert({
        user_id: session.user.id,
        target_id: currentJob.id,
        target_type: "job",
        action,
      });

      if (error) throw error;

      if (action === "like" || action === "super_like") {
        toast({
          title: "Interesse registrado!",
          description: `Você curtiu a vaga ${currentJob.title}. Se a empresa também te curtir, vocês farão match! 💼`,
        });
      }

      // Verificar se houve match
      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .eq("candidate_id", session.user.id)
        .eq("job_id", currentJob.id)
        .maybeSingle();

      if (matchData) {
        toast({
          title: "🎉 É um Match!",
          description: `Você e ${currentJob.company_profiles?.fantasy_name} deram match! A empresa entrará em contato em breve.`,
        });
      }

      // Avançar para próxima vaga
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error("Erro ao registrar swipe:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua ação",
        variant: "destructive",
      });
    }
  };

  const currentJob = jobs[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando vagas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <CandidateSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Match de Vagas 💼</h1>
          <p className="text-muted-foreground">
            Deslize para encontrar oportunidades perfeitas para você
          </p>
        </div>

        {!currentJob ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sem mais vagas por enquanto!</h2>
            <p className="text-muted-foreground mb-6">
              Você viu todas as vagas disponíveis. Novas oportunidades aparecem diariamente!
            </p>
            <Button onClick={() => navigate("/candidate-dashboard")}>
              Voltar ao Dashboard
            </Button>
          </Card>
        ) : (
          <div className="relative">
            <Card className="p-6 mb-6 shadow-2xl border-2">
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-4">
                  {currentJob.company_profiles?.logo_url ? (
                    <img
                      src={currentJob.company_profiles.logo_url}
                      alt={currentJob.company_profiles.fantasy_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{currentJob.title}</h2>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {currentJob.company_profiles?.fantasy_name}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{currentJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{currentJob.job_type}</span>
                  </div>
                  {currentJob.salary && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>{currentJob.salary}</span>
                    </div>
                  )}
                  {currentJob.company_profiles?.sector && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>Setor: {currentJob.company_profiles.sector}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {currentJob.description}
                  </p>
                </div>

                {currentJob.requirements && (
                  <div>
                    <h3 className="font-semibold mb-2">Requisitos</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {currentJob.requirements}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex justify-center gap-6">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-destructive hover:bg-destructive hover:text-white"
                onClick={() => handleSwipe("dislike")}
              >
                <X className="w-8 h-8" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-20 h-20 rounded-full border-2 border-amber-500 hover:bg-amber-500 hover:text-white"
                onClick={() => handleSwipe("super_like")}
              >
                <Star className="w-10 h-10" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-success hover:bg-success hover:text-white"
                onClick={() => handleSwipe("like")}
              >
                <Heart className="w-8 h-8" />
              </Button>
            </div>

            <div className="text-center mt-6 text-sm text-muted-foreground">
              {jobs.length - currentIndex} vagas restantes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
