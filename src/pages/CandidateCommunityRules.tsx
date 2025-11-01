import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Menu, Shield, Users, Heart, AlertCircle, HandshakeIcon, CheckCircle, UserCheck } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";

export default function CandidateCommunityRules() {
  const navigate = useNavigate();
  
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);


  const rules = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Quem Pode Participar",
      description: "A comunidade é destinada apenas a mulheres e pessoas LGBT+. É necessário ter interesse ou atuação na área de TI (trabalhos, freelances ou projetos). Perfis que não se encaixarem nesses critérios não serão aceitos na plataforma."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Respeito e Inclusão",
      description: "Tratamos todos com respeito, independentemente de gênero, orientação sexual, raça, religião ou origem. Discriminação não é tolerada."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Diversidade e Igualdade",
      description: "Nossa plataforma é dedicada a promover oportunidades para mulheres e a comunidade LGBTQIA+ no mercado de tecnologia."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Ambiente Seguro",
      description: "Mantemos um espaço seguro e acolhedor. Assédio, bullying ou comportamento abusivo resultarão em suspensão imediata."
    },
    {
      icon: <HandshakeIcon className="w-8 h-8" />,
      title: "Honestidade no Perfil",
      description: "Mantenha suas informações de perfil e currículo atualizadas e verdadeiras. Falsificação de informações pode resultar em banimento."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Profissionalismo",
      description: "Mantenha uma postura profissional em candidaturas e comunicações com empresas. Representamos uma comunidade de excelência."
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Denúncias",
      description: "Se você presenciar comportamento inadequado de empresas ou outros candidatos, denuncie imediatamente através do suporte."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-white hover:bg-white/10 p-2"
        >
          <Menu size={24} />
        </Button>

        <div className="[&_svg]:text-white [&_button]:hover:bg-white/10">
          <NotificationsPanel />
        </div>
      </header>

      {/* Sidebar */}
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gradient-primary/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-card">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🌈</div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Regras da Comunidade
            </h1>
            <p className="text-xl text-muted-foreground">
              Juntos construímos um espaço inclusivo e respeitoso
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-smooth"
              >
                <div className="flex items-start gap-4">
                  <div className="text-success flex-shrink-0">
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {rule.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              ⚠️ Consequências de Violações
            </h3>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>Primeira violação: Aviso formal</li>
              <li>Segunda violação: Suspensão temporária da conta</li>
              <li>Violações graves ou repetidas: Banimento permanente</li>
            </ul>
          </div>

          <div className="bg-success/20 backdrop-blur-sm rounded-2xl p-6 border border-success/30">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              💡 Dica para Candidatos
            </h3>
            <p className="text-foreground/90">
              Mantenha seu perfil atualizado, seja proativo nas candidaturas e sempre 
              mantenha uma comunicação profissional. Sua reputação na plataforma é valiosa!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
