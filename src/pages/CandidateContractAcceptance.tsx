import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Calendar, Briefcase, Building2, Check, X } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ContractAcceptance() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !applicationId) {
      setLoading(false);
      return;
    }

    fetchApplication();
  }, [applicationId, user, authLoading]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      
      // Buscar application
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("id", applicationId)
        .eq("candidate_id", user?.id)
        .maybeSingle();

      if (appError) throw appError;
      if (!appData) {
        toast({
          title: "Contrato não encontrado",
          description: "Verifique o link de convite ou acesse via Minhas Candidaturas.",
        });
        setApplication(null);
        return;
      }

      // Buscar job
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", appData.job_id)
        .maybeSingle();

      if (jobError) throw jobError;

      // Buscar empresa
      const { data: companyData, error: companyError } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", jobData?.company_id)
        .maybeSingle();

      if (companyError) throw companyError;

      setApplication({
        ...appData,
        job: jobData,
        company: companyData
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar contrato",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          candidate_accepted: true,
          contract_status: 'active'
        })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Contrato aceito!",
        description: "Você aceitou o contrato. Boa sorte!",
      });

      navigate("/my-applications");
    } catch (error: any) {
      toast({
        title: "Erro ao aceitar contrato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          candidate_accepted: false,
          status: 'cancelled',
          contract_status: 'cancelled'
        })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Contrato recusado",
        description: "Você recusou o contrato.",
      });

      navigate("/my-applications");
    } catch (error: any) {
      toast({
        title: "Erro ao recusar contrato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4">
          <p className="text-center">Carregando...</p>
        </header>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4">
          <p className="text-center">Você precisa estar logado para ver esta página</p>
        </header>
        <div className="container mx-auto px-4 py-8 text-center">
          <Button onClick={() => navigate("/auth")}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4">
          <p className="text-center">Contrato não encontrado</p>
        </header>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className={`rounded-xl shadow-lg p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
            Proposta de Contrato
          </h1>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Building2 className={`w-6 h-6 mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Empresa</p>
                <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {application.company?.fantasy_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Briefcase className={`w-6 h-6 mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Vaga</p>
                <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {application.job?.title}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className={`w-6 h-6 mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Período do Contrato</p>
                <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {new Date(application.start_date).toLocaleDateString('pt-BR')} até {new Date(application.end_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <div className={`mt-8 p-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Ao aceitar este contrato, você concorda em trabalhar com {application.company?.fantasy_name} durante o período especificado.
              Após o término, ambos poderão avaliar a experiência.
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <X size={20} />
              Recusar
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
            >
              <Check size={20} />
              Aceitar Contrato
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
