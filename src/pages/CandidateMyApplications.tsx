import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ChevronRight, Trash2, ClipboardList, Star } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
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
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    applicationId: string;
    companyId: string;
    companyName: string;
  } | null>(null);


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
          jobs!inner (
            id,
            title,
            job_type,
            location,
            company_id
          )
        `)
        .eq("candidate_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar informações das empresas separadamente
      if (data && data.length > 0) {
        const companyIds = [...new Set(data.map(app => app.jobs?.company_id).filter(Boolean))];
        
        const { data: companiesData } = await supabase
          .from("company_profiles")
          .select("user_id, fantasy_name, rating")
          .in("user_id", companyIds);

        // Buscar ratings
        const applicationIds = data.map(app => app.id);
        const { data: ratingsData } = await supabase
          .from("ratings")
          .select("id, rating, rater_id, application_id")
          .in("application_id", applicationIds)
          .eq("rater_id", user?.id);

        // Combinar dados
        const applicationsWithData = data.map(app => ({
          ...app,
          jobs: {
            ...app.jobs,
            company_profiles: companiesData?.find(c => c.user_id === app.jobs?.company_id)
          },
          ratings: ratingsData?.filter(r => r.application_id === app.id) || []
        }));

        setApplications(applicationsWithData);
      } else {
        setApplications([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar candidaturas:", error);
      toast({
        title: "Erro ao carregar candidaturas",
        description: error.message,
        variant: "destructive",
      });
      setApplications([]);
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
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

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
                          {app.jobs.company_profiles.rating.toFixed(1)}
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
                        Ver Detalhes da Vaga
                      </Button>
                      
                      {app.contract_status === 'pending' && (
                        <Button
                          onClick={() => setApplicationToDelete(app.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Cancelar Candidatura
                        </Button>
                      )}
                      
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
