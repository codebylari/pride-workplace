import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronRight, Trash2, Briefcase, User, Settings, Headset, Info, FileText, LogOut, ClipboardList, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RatingDialog } from "@/components/RatingDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyApplications() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    applicationId: string;
    companyId: string;
    companyName: string;
  } | null>(null);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          jobs (
            id,
            title,
            job_type,
            location,
            company_id,
            company_profiles (
              fantasy_name,
              rating
            )
          ),
          ratings!ratings_application_id_fkey (
            id,
            rating,
            rater_id
          )
        `)
        .eq("candidate_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar candidaturas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "outline" },
      active: { label: "Ativo", variant: "default" },
      completed: { label: "Concluído", variant: "secondary" },
      cancelled: { label: "Cancelado", variant: "destructive" },
    };
    const config = statusMap[status] || statusMap.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const hasRated = (application: any) => {
    return application.ratings?.some((r: any) => r.rater_id === user?.id);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setApplications(applications.filter(app => app.id !== id));
      setApplicationToDelete(null);
      toast({
        title: "Candidatura excluída",
        description: "Sua candidatura foi removida com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir candidatura",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
            className="absolute left-0 top-0 h-full w-64 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Section */}
            <div className="p-6 flex items-center gap-4 border-b border-white/20">
              <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-white/80">candidato (a)</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>

              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/my-applications");
                }}
                className="w-full flex items-center gap-4 p-4 bg-white/20 rounded-lg transition text-left"
              >
                <ClipboardList size={24} />
                <span className="text-lg">Minhas Candidaturas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-candidate");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            {/* Logout Button at Bottom */}
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
          Minhas Candidaturas
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Carregando...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            <ClipboardList size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">Você ainda não se candidatou a nenhuma vaga</p>
            <Button
              onClick={() => navigate("/candidate-dashboard")}
              className="mt-6 bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800"
            >
              Ver Vagas Disponíveis
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`rounded-xl shadow-md p-6 ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {app.jobs?.title || "Vaga não disponível"}
                      </h3>
                      {getStatusBadge(app.contract_status || 'pending')}
                    </div>
                    <p className={`text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {app.jobs?.company_profiles?.fantasy_name || "Empresa"}
                    </p>
                    
                    {app.jobs?.company_profiles?.rating && (
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < Math.floor(app.jobs.company_profiles.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {app.jobs.company_profiles.rating}
                        </span>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Candidatou-se em: {new Date(app.created_at).toLocaleDateString('pt-BR')}
                    </p>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Button
                        onClick={() => navigate(`/job-details/${app.jobs?.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        Ver Vaga
                      </Button>
                      
                      {app.contract_status === 'completed' && !hasRated(app) && (
                        <Button
                          onClick={() => setRatingDialog({
                            open: true,
                            applicationId: app.id,
                            companyId: app.jobs?.company_id,
                            companyName: app.jobs?.company_profiles?.fantasy_name || "Empresa"
                          })}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                          size="sm"
                        >
                          <Star size={16} className="mr-1" />
                          Avaliar Empresa
                        </Button>
                      )}
                      
                      {app.contract_status === 'completed' && hasRated(app) && (
                        <Badge variant="secondary">✓ Avaliado</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/job-details/${app.jobs?.id}`)}
                      className={`p-2 hover:bg-gray-100 rounded-lg transition ${
                        darkMode ? "hover:bg-gray-600" : ""
                      }`}
                    >
                      <ChevronRight size={24} className={darkMode ? "text-white" : "text-gray-600"} />
                    </button>
                    {app.contract_status === 'pending' && (
                      <button
                        onClick={() => setApplicationToDelete(app.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={24} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rating Dialog */}
      {ratingDialog && (
        <RatingDialog
          open={ratingDialog.open}
          onOpenChange={(open) => !open && setRatingDialog(null)}
          applicationId={ratingDialog.applicationId}
          ratedUserId={ratingDialog.companyId}
          ratedUserName={ratingDialog.companyName}
          isRatingCandidate={false}
          onSuccess={() => {
            fetchApplications();
            setRatingDialog(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={applicationToDelete !== null} onOpenChange={() => setApplicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir candidatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta candidatura? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => applicationToDelete && handleDeleteApplication(applicationToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
