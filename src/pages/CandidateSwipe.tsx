import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Heart, Star, MapPin, Building2, Briefcase, DollarSign, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { darkMode } = useTheme();
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

      const { data: swipesData } = await supabase
        .from("swipes")
        .select("target_id")
        .eq("user_id", session.user.id)
        .eq("target_type", "job");

      const swipedJobIds = swipesData?.map(s => s.target_id) || [];
      setSwipedJobs(new Set(swipedJobIds));

      let query = supabase.from("jobs").select("*");
      
      if (swipedJobIds.length > 0) {
        query = query.not("id", "in", `(${swipedJobIds.join(",")})`);
      }
      
      const { data: jobsData, error } = await query.limit(20);

      if (error) throw error;

      const jobsWithCompanies = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { data: companyData } = await supabase
            .from("company_profiles")
            .select("fantasy_name, logo_url, sector")
            .eq("user_id", job.company_id)
            .maybeSingle();

          return {
            ...job,
            company_profiles: companyData || { fantasy_name: "Empresa", logo_url: null, sector: null },
          };
        })
      );

      setJobs(jobsWithCompanies);
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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Carregando vagas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      <CandidateSidebar showSidebar={sidebarOpen} setShowSidebar={setSidebarOpen} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Match de Vagas
          </h1>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Deslize para encontrar oportunidades perfeitas para você
          </p>
        </div>

        {!currentJob ? (
          <Card className={`p-12 text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <Heart className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Sem mais vagas por enquanto!</h2>
            <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Você viu todas as vagas disponíveis. Novas oportunidades aparecem diariamente!
            </p>
            <Button 
              onClick={() => navigate("/candidate-dashboard")}
              className="bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800"
            >
              Voltar ao Dashboard
            </Button>
          </Card>
        ) : (
          <div className="relative">
            <Card className={`p-6 mb-6 shadow-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white"}`}>
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-4">
                  {currentJob.company_profiles?.logo_url ? (
                    <img
                      src={currentJob.company_profiles.logo_url}
                      alt={currentJob.company_profiles.fantasy_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{currentJob.title}</h2>
                    <p className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Building2 className="w-4 h-4" />
                      {currentJob.company_profiles?.fantasy_name}
                    </p>
                  </div>
                </div>

                <div className={`space-y-3 mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{currentJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{currentJob.job_type}</span>
                  </div>
                  {currentJob.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{currentJob.salary}</span>
                    </div>
                  )}
                  {currentJob.company_profiles?.sector && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Setor: {currentJob.company_profiles.sector}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Descrição</h3>
                  <p className={`text-sm whitespace-pre-line ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {currentJob.description}
                  </p>
                </div>

                {currentJob.requirements && (
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Requisitos</h3>
                    <p className={`text-sm whitespace-pre-line ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
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
                className="w-16 h-16 rounded-full border-2 border-red-500 hover:bg-red-500 hover:text-white"
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
                className="w-16 h-16 rounded-full border-2 border-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => handleSwipe("like")}
              >
                <Heart className="w-8 h-8" />
              </Button>
            </div>

            <div className={`text-center mt-6 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {jobs.length - currentIndex} vagas restantes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
