import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Heart, Star, MapPin, User, GraduationCap, Briefcase, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CompanySidebar } from "@/components/CompanySidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { useTheme } from "@/contexts/ThemeContext";

interface Candidate {
  id: string;
  full_name: string;
  photo_url: string | null;
  city: string | null;
  state: string | null;
  about_me: string | null;
  experience: string | null;
  education: string | null;
  rating: number;
}

export default function CompanySwipe() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { darkMode } = useTheme();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchCandidates();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
  };

  const fetchCandidates = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: swipesData } = await supabase
        .from("swipes")
        .select("target_id")
        .eq("user_id", session.user.id)
        .eq("target_type", "candidate");

      const swipedCandidateIds = swipesData?.map(s => s.target_id) || [];

      const { data: applicationsData, error: appsError } = await supabase
        .from("applications")
        .select("candidate_id, jobs!inner(company_id)")
        .eq("jobs.company_id", session.user.id);

      if (appsError) throw appsError;

      const candidateIds = [...new Set(applicationsData?.map(app => app.candidate_id))];
      
      const filteredCandidateIds = candidateIds.filter(id => !swipedCandidateIds.includes(id));

      if (filteredCandidateIds.length === 0) {
        setCandidates([]);
        return;
      }

      const { data: candidatesData, error: candidatesError } = await supabase
        .from("profiles")
        .select("id, full_name, photo_url, city, state, about_me, experience, education, rating")
        .in("id", filteredCandidateIds)
        .limit(20);

      if (candidatesError) throw candidatesError;

      setCandidates(candidatesData || []);
    } catch (error) {
      console.error("Erro ao buscar candidatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os candidatos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: "like" | "dislike" | "super_like") => {
    const currentCandidate = candidates[currentIndex];
    if (!currentCandidate) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from("swipes").insert({
        user_id: session.user.id,
        target_id: currentCandidate.id,
        target_type: "candidate",
        action,
      });

      if (error) throw error;

      if (action === "like" || action === "super_like") {
        toast({
          title: "Interesse registrado!",
          description: `Você curtiu ${currentCandidate.full_name}. Se o candidato também te curtir, vocês farão match! 🎯`,
        });
      }

      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .eq("candidate_id", currentCandidate.id)
        .eq("company_id", session.user.id)
        .maybeSingle();

      if (matchData) {
        toast({
          title: "🎉 É um Match!",
          description: `Você e ${currentCandidate.full_name} deram match! Entre em contato para dar o próximo passo.`,
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const currentCandidate = candidates[currentIndex];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Carregando candidatos...</p>
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

      <CompanySidebar showSidebar={sidebarOpen} setShowSidebar={setSidebarOpen} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Match de Talentos
          </h1>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Deslize para encontrar os melhores talentos para sua empresa
          </p>
        </div>

        {!currentCandidate ? (
          <Card className={`p-12 text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <Heart className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Sem mais candidatos por enquanto!</h2>
            <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Você viu todos os candidatos disponíveis. Novos talentos aparecem diariamente!
            </p>
            <Button 
              onClick={() => navigate("/company-dashboard")}
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
                  {currentCandidate.photo_url ? (
                    <img
                      src={currentCandidate.photo_url}
                      alt={currentCandidate.full_name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{currentCandidate.full_name}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(currentCandidate.rating || 5)}
                      <span className={`ml-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {currentCandidate.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>
                </div>

                {(currentCandidate.city || currentCandidate.state) && (
                  <div className={`flex items-center gap-2 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <MapPin className="w-4 h-4" />
                    <span>{currentCandidate.city}{currentCandidate.city && currentCandidate.state && ", "}{currentCandidate.state}</span>
                  </div>
                )}

                {currentCandidate.about_me && (
                  <div className="mb-4">
                    <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      <User className="w-4 h-4" />
                      Sobre Mim
                    </h3>
                    <p className={`text-sm whitespace-pre-line ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {currentCandidate.about_me}
                    </p>
                  </div>
                )}

                {currentCandidate.experience && (
                  <div className="mb-4">
                    <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      <Briefcase className="w-4 h-4" />
                      Experiência
                    </h3>
                    <p className={`text-sm whitespace-pre-line ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {currentCandidate.experience}
                    </p>
                  </div>
                )}

                {currentCandidate.education && (
                  <div>
                    <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      <GraduationCap className="w-4 h-4" />
                      Formação
                    </h3>
                    <p className={`text-sm whitespace-pre-line ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {currentCandidate.education}
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
              {candidates.length - currentIndex} candidatos restantes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
