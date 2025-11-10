import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface Account {
  tipo: string;
  nome: string;
  email: string;
  senha: string;
}

interface HistoricalProfile {
  id: string;
  full_name: string;
  city: string | null;
  state: string | null;
  created_at: string;
  experience_level?: string;
  github_level?: string;
  specialization_areas?: string[];
}

interface HistoricalCompany {
  id: string;
  fantasy_name: string;
  city: string | null;
  state: string | null;
  created_at: string;
}

export default function AdminSeedData() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [historicalCandidates, setHistoricalCandidates] = useState<HistoricalProfile[]>([]);
  const [historicalCompanies, setHistoricalCompanies] = useState<HistoricalCompany[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole && userRole !== "admin") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    if (userRole === "admin") {
      fetchHistoricalData();
    }
  }, [userRole]);

  const fetchHistoricalData = async () => {
    setLoadingHistory(true);
    try {
      // Buscar candidatos
      const { data: candidates, error: candidatesError } = await supabase
        .from("profiles")
        .select("id, full_name, city, state, created_at, experience_level, github_level, specialization_areas")
        .order("created_at", { ascending: false });

      if (candidatesError) throw candidatesError;

      // Buscar empresas
      const { data: companies, error: companiesError } = await supabase
        .from("company_profiles")
        .select("id, fantasy_name, city, state, created_at")
        .order("created_at", { ascending: false });

      if (companiesError) throw companiesError;

      setHistoricalCandidates(candidates || []);
      setHistoricalCompanies(companies || []);
    } catch (error: any) {
      console.error("Error fetching historical data:", error);
      toast.error("Erro ao carregar histórico: " + error.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("seed-test-data", {
        body: {},
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
      } else {
        setAccounts(data.accounts);
        await fetchHistoricalData(); // Atualizar lista
        toast.success(data.message);
      }
    } catch (error: any) {
      console.error("Error seeding data:", error);
      toast.error("Erro ao criar dados de teste: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearTestData = async () => {
    if (!confirm("Tem certeza que deseja deletar TODOS os dados de teste? Esta ação não pode ser desfeita.")) {
      return;
    }

    setLoading(true);
    try {
      // Buscar perfis de teste pelos nomes conhecidos
      const candidateNames = [
        "Ana Silva", "Bruno Costa", "Carla Souza", "Daniel Lima", "Elisa Martins",
        "Felipe Santos", "Gabriela Rocha", "Henrique Alves", "Isabela Ferreira", "João Oliveira"
      ];
      
      const companyNames = [
        "TechNova", "InnovaCorp", "DataSolutions", "WebMasters", "DesignPro",
        "CodeFactory", "CloudServices", "AppCreators", "DigitalHub", "FutureTech"
      ];

      // Buscar candidatos
      const { data: candidates } = await supabase
        .from("profiles")
        .select("id")
        .in("full_name", candidateNames);

      // Buscar empresas
      const { data: companies } = await supabase
        .from("company_profiles")
        .select("user_id")
        .in("fantasy_name", companyNames);

      const candidateIds = candidates?.map(c => c.id) || [];
      const companyIds = companies?.map(c => c.user_id) || [];
      const allUserIds = [...candidateIds, ...companyIds];

      if (allUserIds.length === 0) {
        toast.info("Nenhum dado de teste encontrado para deletar.");
        setLoading(false);
        return;
      }

      // Deletar dados relacionados primeiro (para evitar constraint violations)
      await supabase.from("swipes").delete().in("user_id", allUserIds);
      await supabase.from("applications").delete().in("candidate_id", candidateIds);
      
      if (companyIds.length > 0) {
        await supabase.from("matches").delete().in("company_id", companyIds);
        await supabase.from("jobs").delete().in("company_id", companyIds);
      }
      
      if (candidateIds.length > 0) {
        await supabase.from("matches").delete().in("candidate_id", candidateIds);
      }
      
      await supabase.from("notifications").delete().in("user_id", allUserIds);
      await supabase.from("ratings").delete().in("rater_id", allUserIds);
      await supabase.from("ratings").delete().in("rated_user_id", allUserIds);
      await supabase.from("testimonials").delete().in("candidate_id", candidateIds);

      // Deletar perfis
      await supabase.from("profiles").delete().in("id", candidateIds);
      await supabase.from("company_profiles").delete().in("user_id", companyIds);
      await supabase.from("user_roles").delete().in("user_id", allUserIds);

      toast.success(`${allUserIds.length} contas de teste deletadas com sucesso!`);
      setAccounts([]);
      await fetchHistoricalData();
    } catch (error: any) {
      console.error("Error clearing test data:", error);
      toast.error("Erro ao deletar dados de teste: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerar Dados de Teste</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="ml-auto"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <Card className="p-6 mb-6">
        <p className="mb-4">
          Esta ferramenta criará candidatos e empresas com perfis completos incluindo:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>10 candidatos com qualificações (áreas, experiência, GitHub, preferências)</li>
          <li>10 empresas com perfis completos</li>
          <li>3-5 vagas por empresa com requisitos específicos</li>
          <li>Inscrições automáticas de candidatos em vagas compatíveis</li>
          <li>Sistema de filtragem e alertas de compatibilidade</li>
        </ul>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleSeedData} 
            disabled={loading}
            size="lg"
            className="flex-1"
          >
            {loading ? "Gerando..." : "Gerar Dados de Teste"}
          </Button>
          
          <Button 
            onClick={handleClearTestData} 
            disabled={loading}
            size="lg"
            variant="destructive"
            className="flex-1"
          >
            {loading ? "Deletando..." : "Limpar Dados de Teste"}
          </Button>
        </div>
      </Card>

      {accounts.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Contas Criadas Agora</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Candidatos</h3>
              <div className="grid gap-2">
                {accounts.filter(a => a.tipo === "Candidato").map((account, index) => (
                  <div key={index} className="bg-muted p-3 rounded">
                    <p className="font-medium">{account.nome}</p>
                    <p className="text-sm">Email: {account.email}</p>
                    <p className="text-sm">Senha: {account.senha}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Empresas</h3>
              <div className="grid gap-2">
                {accounts.filter(a => a.tipo === "Empresa").map((account, index) => (
                  <div key={index} className="bg-muted p-3 rounded">
                    <p className="font-medium">{account.nome}</p>
                    <p className="text-sm">Email: {account.email}</p>
                    <p className="text-sm">Senha: {account.senha}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Histórico de Usuários</h2>
        
        {loadingHistory ? (
          <p className="text-muted-foreground">Carregando histórico...</p>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Candidatos ({historicalCandidates.length})
              </h3>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {historicalCandidates.map((candidate) => (
                  <div key={candidate.id} className="bg-muted p-3 rounded">
                    <p className="font-medium">{candidate.full_name}</p>
                    {(candidate.city || candidate.state) && (
                      <p className="text-sm text-muted-foreground">
                        📍 {candidate.city}{candidate.city && candidate.state ? ", " : ""}{candidate.state}
                      </p>
                    )}
                    {candidate.experience_level && (
                      <p className="text-sm text-muted-foreground">
                        💼 {candidate.experience_level} | 🔧 GitHub: {candidate.github_level}
                      </p>
                    )}
                    {candidate.specialization_areas && candidate.specialization_areas.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        🎯 {candidate.specialization_areas.join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Criado em: {new Date(candidate.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                Empresas ({historicalCompanies.length})
              </h3>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {historicalCompanies.map((company) => (
                  <div key={company.id} className="bg-muted p-3 rounded">
                    <p className="font-medium">{company.fantasy_name}</p>
                    {(company.city || company.state) && (
                      <p className="text-sm text-muted-foreground">
                        {company.city}{company.city && company.state ? ", " : ""}{company.state}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Criado em: {new Date(company.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
