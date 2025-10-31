import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Bell, Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut, List } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobCandidates() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const companyName = user?.user_metadata?.company_name || "Empresa";

  useEffect(() => {
    if (jobId && user) {
      fetchJobAndCandidates();
    }
  }, [jobId, user]);

  const fetchJobAndCandidates = async () => {
    try {
      setLoading(true);
      
      // Fetch job details
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("company_id", user?.id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Fetch applications for this job
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select(`
          *,
          profiles:candidate_id (
            full_name,
            city,
            state
          )
        `)
        .eq("job_id", jobId);

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar candidatos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <Bell size={24} />
          </button>
          
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notificações</h3>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>Sem novas notificações</p>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
            className="absolute left-0 top-0 h-full w-80 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {companyName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{companyName}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Dashboard</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/create-job");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-jobs");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <List size={24} />
                <span className="text-lg">Minhas Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-company");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
              >
                <LogOut size={24} />
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-6xl">
        <h1 className={`text-4xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Candidatos a Vaga
        </h1>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            {job && (
              <h2 className={`text-2xl font-semibold mb-8 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                {job.title}
              </h2>
            )}

            {applications.length === 0 ? (
              <div className={`rounded-2xl shadow-sm p-12 mb-12 animate-fade-in ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <p className={`text-center leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Ainda não há candidatos para esta vaga.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className={`p-6 rounded-xl shadow-sm ${darkMode ? "bg-gray-700" : "bg-white"}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {application.profiles?.full_name?.substring(0, 2).toUpperCase() || "??"}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {application.profiles?.full_name || "Nome não disponível"}
                        </h3>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Possui interesse na vaga
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => navigate(`/candidate-profile/${application.candidate_id}`)}
                          className="px-6 py-2 bg-green-300 hover:bg-green-400 text-green-900 font-semibold rounded-full"
                        >
                          PERFIL
                        </Button>
                        <Button
                          className="px-6 py-2 bg-green-300 hover:bg-green-400 text-green-900 font-semibold rounded-full"
                        >
                          CONTATO
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <ChatBot />
    </div>
  );
}
