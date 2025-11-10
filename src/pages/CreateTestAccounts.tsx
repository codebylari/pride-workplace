import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

export default function CreateTestAccounts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [candidateCreated, setCandidateCreated] = useState(false);
  const [companyCreated, setCompanyCreated] = useState(false);

  const createCandidateAccount = async () => {
    setLoading(true);
    try {
      // Check if already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: "candidato@teste.com",
        password: "Teste123",
      });

      if (existingUser.user) {
        await supabase.auth.signOut();
        toast({
          title: "Conta já existe",
          description: "A conta candidato@teste.com já foi criada anteriormente.",
        });
        setCandidateCreated(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      // User doesn't exist, continue with creation
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: "candidato@teste.com",
        password: "Teste123",
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: "Frederico Silva Teste",
            social_name: "Frederico Teste",
            role: "candidate",
            state: "SP",
            city: "São Paulo",
            birth_date: "1995-01-01",
            cpf: "123.456.789-00",
            rg: "12.345.678-9",
            phone: "(11) 99999-9999",
            is_pcd: false,
            is_lgbt: true,
          },
        },
      });

      if (error) throw error;

      // Update profile with qualifications
      if (data.user) {
        await supabase.from("profiles").update({
          specialization_areas: ["Desenvolvimento de Software", "Inteligência Artificial"],
          work_area: "Desenvolvimento de Software",
          experience_level: "Júnior",
          opportunity_type: ["CLT", "Freelancer"],
          github_level: "Básico",
          remote_preference: "sim",
          gender: "masculino",
          about_me: "Desenvolvedor júnior apaixonado por tecnologia e inovação.",
        }).eq("id", data.user.id);

        await supabase.auth.signOut();
      }

      toast({
        title: "Conta criada!",
        description: "candidato@teste.com / Teste123",
      });
      setCandidateCreated(true);
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a conta de teste",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCompanyAccount = async () => {
    setLoading(true);
    try {
      // Check if already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: "empresa@teste.com",
        password: "Teste123",
      });

      if (existingUser.user) {
        await supabase.auth.signOut();
        toast({
          title: "Conta já existe",
          description: "A conta empresa@teste.com já foi criada anteriormente.",
        });
        setCompanyCreated(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      // User doesn't exist, continue with creation
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: "empresa@teste.com",
        password: "Teste123",
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: "João Silva",
            role: "company",
            state: "SP",
            city: "São Paulo",
            company_name: "Tech Solutions Ltda",
            cnpj: "12.345.678/0001-90",
            phone: "(11) 98888-8888",
            position: "CEO",
            diversity: "sim",
          },
        },
      });

      if (error) throw error;

      // Create company profile
      if (data.user) {
        await supabase.from("company_profiles").insert({
          user_id: data.user.id,
          fantasy_name: "Tech Solutions",
          cnpj: "12.345.678/0001-90",
          sector: "Tecnologia",
          description: "Empresa de tecnologia focada em soluções inovadoras",
          about: "Somos uma empresa que valoriza a diversidade e inovação",
          state: "SP",
          city: "São Paulo",
        });

        await supabase.auth.signOut();
      }

      toast({
        title: "Conta criada!",
        description: "empresa@teste.com / Teste123",
      });
      setCompanyCreated(true);
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a conta de teste",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/95 backdrop-blur">
        <button
          onClick={() => navigate("/auth")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar para Login</span>
        </button>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Criar Contas de Teste
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Crie contas pré-configuradas para testar a aplicação rapidamente
        </p>

        <div className="space-y-6">
          {/* Candidato */}
          <div className="p-6 border-2 border-purple-200 rounded-xl bg-purple-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">👤 Conta de Candidato</h2>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Email:</strong> candidato@teste.com</p>
                  <p><strong>Senha:</strong> Teste123</p>
                  <p><strong>Nome:</strong> Frederico Teste (nome social)</p>
                  <p><strong>Qualificações:</strong> Júnior, GitHub Básico, Remoto</p>
                </div>
              </div>
              {candidateCreated && (
                <Check size={32} className="text-green-600" />
              )}
            </div>
            <Button
              onClick={createCandidateAccount}
              disabled={loading || candidateCreated}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : candidateCreated ? (
                "✓ Conta Criada"
              ) : (
                "Criar Conta de Candidato"
              )}
            </Button>
          </div>

          {/* Empresa */}
          <div className="p-6 border-2 border-pink-200 rounded-xl bg-pink-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">🏢 Conta de Empresa</h2>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Email:</strong> empresa@teste.com</p>
                  <p><strong>Senha:</strong> Teste123</p>
                  <p><strong>Empresa:</strong> Tech Solutions</p>
                  <p><strong>Contato:</strong> João Silva</p>
                </div>
              </div>
              {companyCreated && (
                <Check size={32} className="text-green-600" />
              )}
            </div>
            <Button
              onClick={createCompanyAccount}
              disabled={loading || companyCreated}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : companyCreated ? (
                "✓ Conta Criada"
              ) : (
                "Criar Conta de Empresa"
              )}
            </Button>
          </div>
        </div>

        {(candidateCreated || companyCreated) && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              ✓ Contas criadas com sucesso! Use as credenciais acima para fazer login.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="w-full"
          >
            Ir para Login
          </Button>
        </div>
      </Card>
    </div>
  );
}