import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Menu, Shield, Users, Heart, AlertCircle, HandshakeIcon, Briefcase, UserCheck } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export default function CompanyCommunityRules() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const rules = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Quem Pode Participar",
      description: "A comunidade é destinada apenas a mulheres e pessoas LGBT+. É necessário ter interesse ou atuação na área de TI (trabalhos, freelances ou projetos). Perfis que não se encaixarem nesses critérios não serão aceitos na plataforma."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Respeito e Inclusão",
      description: "Tratamos todos os candidatos com respeito, independentemente de gênero, orientação sexual, raça, religião ou origem. Discriminação não é tolerada."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Compromisso com a Diversidade",
      description: "Empresas na nossa plataforma devem demonstrar compromisso genuíno com a diversidade e inclusão no ambiente de trabalho."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Ambiente de Trabalho Seguro",
      description: "As vagas oferecidas devem garantir um ambiente de trabalho seguro, acolhedor e livre de qualquer forma de discriminação ou assédio."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Vagas Transparentes",
      description: "Todas as informações sobre vagas devem ser verdadeiras e completas: salário, benefícios, requisitos e descrição das atividades."
    },
    {
      icon: <HandshakeIcon className="w-8 h-8" />,
      title: "Processo Seletivo Justo",
      description: "Conduza processos seletivos de forma justa, respeitosa e com feedback aos candidatos. A transparência é essencial."
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Denúncias e Compliance",
      description: "Empresas que violarem as regras da comunidade estarão sujeitas a investigação e possível remoção da plataforma."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-background" : "bg-gradient-primary"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary backdrop-blur-lg border-b border-border shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Menu size={24} />
          </Button>

          <div className="text-primary-foreground">
            <NotificationsPanel />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="fixed left-0 top-0 h-full w-80 bg-primary shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl">
                🏢
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary-foreground text-lg truncate">
                  {user?.user_metadata?.company_name || "Empresa"}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => navigate("/company-dashboard")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/create-job")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Cadastrar Vagas
              </button>
              <button
                onClick={() => navigate("/company-jobs")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Minhas Vagas
              </button>
              <button
                onClick={() => navigate("/company-profile")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Meu Perfil
              </button>
              <button
                onClick={() => navigate("/company-settings")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Configurações
              </button>
              <button
                onClick={() => navigate("/company-support")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Suporte
              </button>
              <button
                onClick={() => navigate("/company-about")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Quem Somos
              </button>
              <button
                onClick={() => navigate("/company-community-rules")}
                className="w-full text-left px-4 py-3 bg-primary-foreground/20 text-primary-foreground rounded-lg transition-smooth"
              >
                Regras da Comunidade
              </button>
              <button
                onClick={() => navigate("/terms-company")}
                className="w-full text-left px-4 py-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg transition-smooth"
              >
                Termos de Uso
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-8 px-4 py-3 bg-destructive/20 text-primary-foreground hover:bg-destructive/30 rounded-lg transition-smooth"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-card/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-card">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🏢</div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Regras da Comunidade para Empresas
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Compromisso com inclusão e ética profissional
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-card/20 transition-smooth border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="text-success flex-shrink-0">
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                      {rule.title}
                    </h3>
                    <p className="text-primary-foreground/80 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-border">
            <h3 className="text-xl font-semibold text-primary-foreground mb-3">
              ⚠️ Consequências de Violações
            </h3>
            <ul className="text-primary-foreground/80 space-y-2 list-disc list-inside">
              <li>Primeira violação: Aviso formal e revisão das vagas publicadas</li>
              <li>Segunda violação: Suspensão temporária e impossibilidade de publicar novas vagas</li>
              <li>Violações graves ou repetidas: Banimento permanente da plataforma</li>
              <li>Casos de discriminação comprovada: Remoção imediata sem aviso prévio</li>
            </ul>
          </div>

          <div className="bg-success/20 backdrop-blur-sm rounded-2xl p-6 border border-success/30">
            <h3 className="text-xl font-semibold text-primary-foreground mb-3">
              💼 Boas Práticas para Empresas
            </h3>
            <ul className="text-primary-foreground/90 space-y-2 list-disc list-inside">
              <li>Seja transparente sobre a cultura organizacional e valores da empresa</li>
              <li>Ofereça feedback construtivo aos candidatos após entrevistas</li>
              <li>Mantenha as informações das vagas sempre atualizadas</li>
              <li>Respeite os prazos e compromissos estabelecidos com candidatos</li>
              <li>Promova ativamente a diversidade dentro da sua organização</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
