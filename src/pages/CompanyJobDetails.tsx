import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Pencil, Trash2, Users } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function CompanyJobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    if (id && user) {
      fetchJob();
      fetchApplicationsCount();
    }
  }, [id, user]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .eq("company_id", user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Vaga não encontrada",
          description: "Esta vaga não existe ou você não tem permissão para visualizá-la.",
          variant: "destructive",
        });
        navigate("/company-jobs");
        return;
      }
      
      setJob(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vaga",
        description: error.message,
        variant: "destructive",
      });
      navigate("/company-jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsCount = async () => {
    try {
      const { count, error } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", id);

      if (error) throw error;
      setApplicationsCount(count || 0);
    } catch (error: any) {
      console.error("Erro ao carregar contagem de candidaturas:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id)
        .eq("company_id", user?.id);

      if (error) throw error;

      toast({
        title: "Vaga excluída!",
        description: "A vaga foi excluída com sucesso.",
      });
      navigate("/company-jobs");
    } catch (error: any) {
      toast({
        title: "Erro ao excluir vaga",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
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
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Detalhes da Vaga
          </h1>
          <Button
            onClick={() => navigate("/company-jobs")}
            variant="outline"
            className="text-sm"
          >
            ← Voltar
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : job ? (
          <div className={`rounded-2xl shadow-sm p-8 mb-12 animate-fade-in ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              {job.title}
            </h2>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Descrição da Vaga</h3>
                <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{job.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Tipo: </span>
                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{job.job_type}</span>
                </div>
                <div>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Localização: </span>
                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{job.location}</span>
                </div>
                {job.salary && (
                  <div>
                    <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Salário: </span>
                    <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{job.salary}</span>
                  </div>
                )}
              </div>

              {job.requirements && (
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Requisitos</h3>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{job.requirements}</p>
                </div>
              )}

              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-blue-50"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Candidaturas: </span>
                    <span className={`text-2xl font-bold ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                      {applicationsCount}
                    </span>
                  </div>
                  {applicationsCount > 0 && (
                    <Users className={darkMode ? "text-blue-300" : "text-blue-600"} size={32} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate(`/edit-company-job/${job.id}`)}
                className="px-8 py-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-full flex items-center gap-2"
              >
                <Pencil size={20} />
                Editar Vaga
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                className="px-8 py-6 bg-red-500 hover:bg-red-600 text-white font-semibold text-lg rounded-full flex items-center gap-2"
              >
                <Trash2 size={20} />
                Excluir Vaga
              </Button>
              <Button
                onClick={() => navigate(`/company-job-candidates/${job.id}`)}
                className="px-8 py-6 bg-green-300 hover:bg-green-400 text-green-900 font-semibold text-lg rounded-full flex items-center gap-2"
              >
                <Users size={20} />
                Ver Candidatos ({applicationsCount})
              </Button>
            </div>
          </div>
        ) : null}
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AVISOS</AlertDialogTitle>
            <AlertDialogDescription>
              Realmente deseja excluir essa vaga?
              <br />
              Ao clicar em prosseguir, excluira a vaga permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? "Excluindo..." : "Prosseguir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <ChatBot />
    </div>
  );
}
