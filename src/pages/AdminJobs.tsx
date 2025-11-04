import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company_id: string;
  location: string;
  job_type: string;
  salary: string;
  created_at: string;
}

interface CompanyProfile {
  user_id: string;
  fantasy_name: string;
}

export default function AdminJobs() {
  const navigate = useNavigate();
  const { userRole, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      navigate("/");
      return;
    }

    if (userRole === "admin") {
      fetchJobs();
    }
  }, [userRole, loading, navigate]);

  const fetchJobs = async () => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;

      const { data: companiesData, error: companiesError } = await supabase
        .from("company_profiles")
        .select("user_id, fantasy_name");

      if (companiesError) throw companiesError;

      const companiesMap: Record<string, string> = {};
      companiesData?.forEach((company: CompanyProfile) => {
        companiesMap[company.user_id] = company.fantasy_name;
      });

      setJobs(jobsData || []);
      setCompanies(companiesMap);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;

      toast({
        title: "Vaga deletada",
        description: "A vaga foi removida com sucesso.",
      });

      setDeletingId(null);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a vaga.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin-dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Vagas Publicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Salário</TableHead>
                  <TableHead>Data de Publicação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{companies[job.company_id] || "N/A"}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>{job.salary || "Não informado"}</TableCell>
                    <TableCell>
                      {new Date(job.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeletingId(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar esta vaga? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
