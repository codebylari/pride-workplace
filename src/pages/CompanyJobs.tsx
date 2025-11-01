import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Pencil, Trash2 } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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

export default function CompanyJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const companyName = user?.user_metadata?.company_name || "Empresa";

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log("Current user ID:", user?.id);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vagas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobToDelete);

      if (error) throw error;

      toast({
        title: "Vaga excluída",
        description: "A vaga foi excluída com sucesso.",
      });

      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir vaga",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleEditClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-job/${jobId}`);
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
      <main className="container mx-auto px-6 py-16 max-w-6xl">
        <h1 className={`text-4xl font-bold text-center mb-16 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Minhas Vagas
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className={`rounded-2xl shadow-sm p-12 mb-12 animate-fade-in ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <p className={`text-center leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Você ainda não cadastrou nenhuma vaga.
            </p>
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/create-job")}
                className="px-8 py-3 bg-green-300 hover:bg-green-400 text-green-900 font-semibold rounded-full transition"
              >
                Cadastrar Primeira Vaga
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`w-full p-6 rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-between ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="text-left flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {job.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {job.job_type} • {job.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => handleEditClick(job.id, e)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    <Pencil className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button
                    onClick={(e) => handleDeleteClick(job.id, e)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <ChatBot />
    </div>
  );
}
