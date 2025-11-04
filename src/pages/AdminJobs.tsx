import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
