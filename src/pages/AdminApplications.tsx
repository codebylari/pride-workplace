import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  status: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
}

interface Job {
  id: string;
  title: string;
  company_id: string;
}

interface CompanyProfile {
  user_id: string;
  fantasy_name: string;
}

export default function AdminApplications() {
  const navigate = useNavigate();
  const { userRole, loading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [jobs, setJobs] = useState<Record<string, { title: string; company_id: string }>>({});
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      navigate("/");
      return;
    }

    if (userRole === "admin") {
      fetchApplications();
    }
  }, [userRole, loading, navigate]);

  const fetchApplications = async () => {
    try {
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (applicationsError) throw applicationsError;

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profilesError) throw profilesError;

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, company_id");

      if (jobsError) throw jobsError;

      const { data: companiesData, error: companiesError } = await supabase
        .from("company_profiles")
        .select("user_id, fantasy_name");

      if (companiesError) throw companiesError;

      const profilesMap: Record<string, string> = {};
      profilesData?.forEach((profile: Profile) => {
        profilesMap[profile.id] = profile.full_name;
      });

      const jobsMap: Record<string, { title: string; company_id: string }> = {};
      jobsData?.forEach((job: Job) => {
        jobsMap[job.id] = { title: job.title, company_id: job.company_id };
      });

      const companiesMap: Record<string, string> = {};
      companiesData?.forEach((company: CompanyProfile) => {
        companiesMap[company.user_id] = company.fantasy_name;
      });

      setApplications(applicationsData || []);
      setProfiles(profilesMap);
      setJobs(jobsMap);
      setCompanies(companiesMap);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleEdit = (application: Application) => {
    setEditingId(application.id);
    setEditStatus(application.status);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: editStatus })
        .eq("id", editingId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status da candidatura foi atualizado com sucesso.",
      });

      setEditingId(null);
      fetchApplications();
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;

      toast({
        title: "Candidatura deletada",
        description: "A candidatura foi removida com sucesso.",
      });

      setDeletingId(null);
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a candidatura.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      accepted: "default",
      rejected: "destructive",
      contact_requested: "outline",
    };

    const labels: Record<string, string> = {
      pending: "Pendente",
      accepted: "Aceita",
      rejected: "Rejeitada",
      contact_requested: "Contato Solicitado",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
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
            <CardTitle>Candidaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data da Candidatura</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => {
                  const job = jobs[application.job_id];
                  const companyName = job ? companies[job.company_id] : "N/A";
                  
                  return (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {profiles[application.candidate_id] || "N/A"}
                      </TableCell>
                      <TableCell>{job?.title || "N/A"}</TableCell>
                      <TableCell>{companyName}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        {new Date(application.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(application)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeletingId(application.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertDialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar Status da Candidatura</AlertDialogTitle>
              <AlertDialogDescription>
                Selecione o novo status para esta candidatura.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="accepted">Aceita</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                  <SelectItem value="contact_requested">Contato Solicitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveEdit}>Salvar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar esta candidatura? Esta ação não pode ser desfeita.
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
