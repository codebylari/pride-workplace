import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Company {
  id: string;
  fantasy_name: string;
  cnpj: string;
  city: string;
  state: string;
  sector: string;
  rating: number;
  total_ratings: number;
  created_at: string;
}

export default function AdminCompanies() {
  const navigate = useNavigate();
  const { userRole, loading } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      navigate("/");
      return;
    }

    if (userRole === "admin") {
      fetchCompanies();
    }
  }, [userRole, loading, navigate]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
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
            <CardTitle>Empresas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Fantasia</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.fantasy_name}</TableCell>
                    <TableCell>{company.cnpj}</TableCell>
                    <TableCell>
                      {company.city && company.state
                        ? `${company.city} - ${company.state}`
                        : "Não informado"}
                    </TableCell>
                    <TableCell>{company.sector || "Não informado"}</TableCell>
                    <TableCell>
                      {company.rating?.toFixed(1)} ({company.total_ratings} avaliações)
                    </TableCell>
                    <TableCell>
                      {new Date(company.created_at).toLocaleDateString("pt-BR")}
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
