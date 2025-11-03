import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Building2, User, MapPin, Briefcase, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { CompanySidebar } from "@/components/CompanySidebar";

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
  candidate?: {
    full_name: string;
    photo_url: string | null;
    city: string | null;
    state: string | null;
  };
}

export default function Matches() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<"candidate" | "company" | null>(null);

  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleData?.role === "candidate" || roleData?.role === "company") {
      setUserRole(roleData.role);
      fetchMatches(roleData.role, session.user.id);
    }
  };

  const fetchMatches = async (role: "candidate" | "company", userId: string) => {
    try {
      if (role === "candidate") {
        const { data, error } = await supabase
          .from("matches")
          .select(`
            id,
            matched_at,
            jobs!inner(id, title, location, job_type),
            company_profiles!inner(fantasy_name, logo_url)
          `)
          .eq("candidate_id", userId)
          .eq("status", "active")
          .order("matched_at", { ascending: false });

        if (error) throw error;
        
        const formattedData = data?.map(match => ({
          id: match.id,
          matched_at: match.matched_at,
          job: match.jobs,
          company: match.company_profiles,
        })) || [];
        
        setMatches(formattedData);
      } else {
        const { data, error } = await supabase
          .from("matches")
          .select(`
            id,
            matched_at,
            jobs!inner(id, title, location, job_type),
            profiles!inner(full_name, photo_url, city, state)
          `)
          .eq("company_id", userId)
          .eq("status", "active")
          .order("matched_at", { ascending: false });

        if (error) throw error;
        
        const formattedData = data?.map(match => ({
          id: match.id,
          matched_at: match.matched_at,
          job: match.jobs,
          candidate: match.profiles,
        })) || [];
        
        setMatches(formattedData);
      }
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {userRole === "candidate" ? (
        <CandidateSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      ) : (
        <CompanySidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            Seus Matches
          </h1>
          <p className="text-muted-foreground">
            {userRole === "candidate" 
              ? "Empresas que combinam com você" 
              : "Talentos que combinam com suas vagas"}
          </p>
        </div>

        {matches.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Nenhum match ainda</h2>
            <p className="text-muted-foreground mb-6">
              {userRole === "candidate"
                ? "Continue curtindo vagas para encontrar oportunidades perfeitas!"
                : "Continue avaliando candidatos para encontrar os talentos ideais!"}
            </p>
            <Button onClick={() => navigate(userRole === "candidate" ? "/candidate-swipe" : "/company-swipe")}>
              Começar a Curtir
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <Card key={match.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  {userRole === "candidate" ? (
                    <>
                      {match.company?.logo_url ? (
                        <img
                          src={match.company.logo_url}
                          alt={match.company.fantasy_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-5 h-5 text-primary fill-primary" />
                          <h3 className="text-xl font-bold">{match.job?.title}</h3>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1 mb-2">
                          <Building2 className="w-4 h-4" />
                          {match.company?.fantasy_name}
                        </p>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {match.job?.location}
                          </p>
                          <p className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {match.job?.job_type}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Match em {new Date(match.matched_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button onClick={() => navigate(`/candidate/job/${match.job?.id}`)}>
                        Ver Vaga
                      </Button>
                    </>
                  ) : (
                    <>
                      {match.candidate?.photo_url ? (
                        <img
                          src={match.candidate.photo_url}
                          alt={match.candidate.full_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-5 h-5 text-primary fill-primary" />
                          <h3 className="text-xl font-bold">{match.candidate?.full_name}</h3>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1 mb-2">
                          <Briefcase className="w-4 h-4" />
                          Para a vaga: {match.job?.title}
                        </p>
                        {(match.candidate?.city || match.candidate?.state) && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {match.candidate.city}{match.candidate.city && match.candidate.state && ", "}{match.candidate.state}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          Match em {new Date(match.matched_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Contatar
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
