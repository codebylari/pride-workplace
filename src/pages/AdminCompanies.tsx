import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Mail, MapPin, Star, Building } from "lucide-react";

interface CompanyData {
  id: string;
  user_id: string;
  fantasy_name: string;
  cnpj: string;
  city: string | null;
  state: string | null;
  sector: string | null;
  rating: number;
  total_ratings: number;
  created_at: string;
  email?: string;
}

export default function AdminCompanies() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || userRole !== "admin") {
      navigate("/auth");
      return;
    }
    fetchCompanies();
  }, [user, userRole, navigate]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from("company_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar emails dos usuários
      const companiesWithEmail = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
          return {
            ...profile,
            email: user?.email
          };
        })
      );

      setCompanies(companiesWithEmail);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2 mb-4">
            <ArrowLeft size={18} />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Empresas Cadastradas</h1>
          <p className="text-muted-foreground">Total: {companies.length}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Fantasia</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building size={16} className="text-muted-foreground" />
                          {company.fantasy_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-muted-foreground" />
                          {company.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>{company.cnpj}</TableCell>
                      <TableCell>{company.sector || "Não informado"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-muted-foreground" />
                          {company.city && company.state 
                            ? `${company.city}, ${company.state}` 
                            : "Não informado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          {company.rating?.toFixed(1) || "5.0"} ({company.total_ratings || 0})
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(company.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
