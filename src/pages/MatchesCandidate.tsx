import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Building2, MapPin, Briefcase, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { useTheme } from "@/contexts/ThemeContext";

interface Match {
  id: string;
  matched_at: string;
  job?: {
    id: string;
    title: string;
    location: string;
    job_type: string;
  };
  company?: {
    fantasy_name: string;
    logo_url: string | null;
  };
}

export default function MatchesCandidate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { darkMode } = useTheme();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuthAndFetchMatches();
  }, []);

  const checkAuthAndFetchMatches = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchMatches(session.user.id);
  };

  const fetchMatches = async (userId: string) => {
    try {
      const { data: matchesData, error } = await supabase
        .from("matches")
        .select("*")
        .eq("candidate_id", userId)
        .eq("status", "active")
        .order("matched_at", { ascending: false });

      if (error) throw error;

      const formattedData = await Promise.all(
        (matchesData || []).map(async (match) => {
          const { data: jobData } = await supabase
            .from("jobs")
            .select("id, title, location, job_type")
            .eq("id", match.job_id)
            .maybeSingle();

          const { data: companyData } = await supabase
            .from("company_profiles")
            .select("fantasy_name, logo_url")
            .eq("user_id", match.company_id)
            .maybeSingle();

          return {
            id: match.id,
            matched_at: match.matched_at,
            job: jobData || { id: "", title: "", location: "", job_type: "" },
            company: companyData || { fantasy_name: "Empresa", logo_url: null },
          };
        })
      );
      
      setMatches(formattedData);
    } catch (error) {
      console.error("Erro ao buscar matches:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Carregando matches...</p>
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Seus Matches
          </h1>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Empresas que combinam com você
          </p>
        </div>

        {matches.length === 0 ? (
          <Card className={`p-12 text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <Heart className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Nenhum match ainda</h2>
            <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Continue curtindo vagas para encontrar oportunidades perfeitas!
            </p>
            <Button 
              onClick={() => navigate("/candidate-swipe")}
              className="bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800"
            >
              Começar a Curtir
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <Card key={match.id} className={`p-6 hover:shadow-lg transition-shadow ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <div className="flex items-start gap-4">
                  {match.company?.logo_url ? (
                    <img
                      src={match.company.logo_url}
                      alt={match.company.fantasy_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                      <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{match.job?.title}</h3>
                    </div>
                    <p className={`flex items-center gap-1 mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Building2 className="w-4 h-4" />
                      {match.company?.fantasy_name}
                    </p>
                    <div className={`space-y-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {match.job?.location}
                      </p>
                      <p className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {match.job?.job_type}
                      </p>
                    </div>
                    <p className={`text-xs mt-3 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      Match em {new Date(match.matched_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/job/${match.job?.id}`)}
                    className="bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800"
                  >
                    Ver Vaga
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
