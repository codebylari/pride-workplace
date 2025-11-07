import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface Account {
  tipo: string;
  nome: string;
  email: string;
  senha: string;
}

export default function AdminSeedData() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole && userRole !== "admin") {
      navigate("/");
    }
  }, [userRole, navigate]);

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
        toast.success(data.message);
      }
    } catch (error: any) {
      console.error("Error seeding data:", error);
      toast.error("Erro ao criar dados de teste: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerar Dados de Teste</h1>
      
      <Card className="p-6 mb-6">
        <p className="mb-4">
          Esta ferramenta criará:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>10 candidatos com perfis completos</li>
          <li>10 empresas com perfis completos</li>
          <li>3-5 vagas por empresa</li>
          <li>Inscrições automáticas de candidatos em vagas compatíveis</li>
        </ul>
        
        <Button 
          onClick={handleSeedData} 
          disabled={loading}
          size="lg"
        >
          {loading ? "Gerando..." : "Gerar Dados de Teste"}
        </Button>
      </Card>

      {accounts.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Contas Criadas</h2>
          
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
    </div>
  );
}
