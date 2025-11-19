import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const SeedMyData = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const seedMyProfile = async () => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setLoading(true);
    setSuccess(false);
    
    try {
      if (userRole === 'candidate') {
        // Popular perfil de candidato
        const { error } = await supabase
          .from('profiles')
          .update({
            city: 'Vitória',
            state: 'ES',
            gender: 'Masculino',
            about_me: 'Desenvolvedor Full Stack apaixonado por tecnologia e inovação.',
            experience: 'Experiência em React, TypeScript, Node.js e Supabase.',
            education: 'Bacharelado em Ciência da Computação',
            journey: 'Iniciei minha jornada na programação há 3 anos.',
            work_area: 'Tecnologia da Informação',
            experience_level: 'Pleno',
            specialization_areas: ['Desenvolvimento de Software', 'Full Stack'],
            github_level: 'Intermediário',
            remote_preference: 'sim',
            opportunity_type: ['CLT', 'PJ'],
            linkedin_url: 'https://linkedin.com/in/usuario'
          })
          .eq('id', user.id);

        if (error) throw error;
        toast.success('Perfil de candidato populado com sucesso!');
        setSuccess(true);

      } else if (userRole === 'company') {
        // Popular perfil de empresa
        const { error: companyError } = await supabase
          .from('company_profiles')
          .update({
            fantasy_name: 'Tech Solutions Ltda',
            cnpj: '12.345.678/0001-90',
            description: 'Empresa de tecnologia focada em soluções inovadoras.',
            sector: 'Tecnologia',
            state: 'ES',
            city: 'Vitória',
            about: 'Empresa com 10 anos de mercado, focada em desenvolvimento de software.',
            seeking: 'Profissionais apaixonados por tecnologia.',
            training: 'Treinamentos constantes e plano de carreira.',
            essential_skills: ['React', 'TypeScript', 'Node.js']
          })
          .eq('user_id', user.id);

        if (companyError) throw companyError;

        // Criar 3 vagas de exemplo
        const jobs = [
          {
            company_id: user.id,
            title: 'Desenvolvedor Frontend React',
            description: 'Vaga para desenvolvedor frontend com experiência em React.',
            job_type: 'CLT',
            location: 'Vitória - ES',
            is_remote: true,
            salary: 'R$ 5.000 - R$ 8.000',
            requirements: 'React, TypeScript, Git',
            required_experience_level: 'Pleno',
            required_github_level: 'Intermediário',
            required_specialization_areas: ['Desenvolvimento de Software']
          },
          {
            company_id: user.id,
            title: 'Desenvolvedor Backend Node.js',
            description: 'Vaga para desenvolvedor backend com Node.js.',
            job_type: 'PJ',
            location: 'Remoto',
            is_remote: true,
            salary: 'R$ 6.000 - R$ 10.000',
            requirements: 'Node.js, Express, PostgreSQL',
            required_experience_level: 'Sênior',
            required_github_level: 'Avançado',
            required_specialization_areas: ['Desenvolvimento de Software']
          },
          {
            company_id: user.id,
            title: 'Full Stack Developer',
            description: 'Vaga para desenvolvedor full stack.',
            job_type: 'CLT',
            location: 'Vitória - ES',
            is_remote: false,
            salary: 'R$ 7.000 - R$ 12.000',
            requirements: 'React, Node.js, PostgreSQL',
            required_experience_level: 'Sênior',
            required_github_level: 'Avançado',
            required_specialization_areas: ['Desenvolvimento de Software']
          }
        ];

        for (const job of jobs) {
          const { error: jobError } = await supabase
            .from('jobs')
            .insert(job);

          if (jobError) throw jobError;
        }

        toast.success('Perfil de empresa e vagas criadas com sucesso!');
        setSuccess(true);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Erro ao popular dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-8">
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Popular Meu Perfil</h1>
            <p className="text-muted-foreground">
              Adiciona dados de exemplo ao seu perfil atual
            </p>
          </div>

          <div className="space-y-4">
            {user && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Seu usuário:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Email: {user.email}</li>
                  <li>• Tipo: {userRole === 'candidate' ? 'Candidato' : userRole === 'company' ? 'Empresa' : 'Admin'}</li>
                </ul>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">O que será criado:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {userRole === 'candidate' && (
                  <li>• Perfil completo com experiência, educação e habilidades</li>
                )}
                {userRole === 'company' && (
                  <>
                    <li>• Perfil completo da empresa</li>
                    <li>• 3 vagas de exemplo (Frontend, Backend e Full Stack)</li>
                  </>
                )}
              </ul>
            </div>

            <Button
              onClick={seedMyProfile}
              disabled={loading || !user || success}
              size="lg"
              className="w-full"
            >
              {loading ? 'Populando...' : success ? 'Dados criados!' : 'Popular Meus Dados'}
            </Button>

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                <Check className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-600">
                  Dados populados com sucesso! Você pode acessar seu perfil agora.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SeedMyData;
