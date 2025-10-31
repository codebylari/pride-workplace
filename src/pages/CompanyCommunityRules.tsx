import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Menu, Shield, Users, Heart, AlertCircle, HandshakeIcon, Briefcase } from "lucide-react";
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
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-primary via-primary-dark to-accent"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary-dark backdrop-blur-lg border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-white hover:bg-white/20"
          >
            <Menu size={24} />
          </Button>

          <div className="text-white">
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
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-primary to-primary-dark shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/20">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🏢
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-lg truncate">
                  {user?.user_metadata?.company_name || "Empresa"}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => navigate("/company-dashboard")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/create-job")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Cadastrar Vagas
              </button>
              <button
                onClick={() => navigate("/company-jobs")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Minhas Vagas
              </button>
              <button
                onClick={() => navigate("/company-profile")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Meu Perfil
              </button>
              <button
                onClick={() => navigate("/company-settings")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Configurações
              </button>
              <button
                onClick={() => navigate("/company-support")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Suporte
              </button>
              <button
                onClick={() => navigate("/company-about")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Quem Somos
              </button>
              <button
                onClick={() => navigate("/company-community-rules")}
                className="w-full text-left px-4 py-3 bg-white/20 text-white rounded-lg transition-colors"
              >
                Regras da Comunidade
              </button>
              <button
                onClick={() => navigate("/terms-company")}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                Termos de Uso
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-8 px-4 py-3 bg-red-500/20 text-white hover:bg-red-500/30 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🏢</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Regras da Comunidade para Empresas
            </h1>
            <p className="text-xl text-white/80">
              Compromisso com inclusão e ética profissional
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-success flex-shrink-0">
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {rule.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">
              ⚠️ Consequências de Violações
            </h3>
            <ul className="text-white/80 space-y-2 list-disc list-inside">
              <li>Primeira violação: Aviso formal e revisão das vagas publicadas</li>
              <li>Segunda violação: Suspensão temporária e impossibilidade de publicar novas vagas</li>
              <li>Violações graves ou repetidas: Banimento permanente da plataforma</li>
              <li>Casos de discriminação comprovada: Remoção imediata sem aviso prévio</li>
            </ul>
          </div>

          <div className="bg-success/20 backdrop-blur-sm rounded-2xl p-6 border border-success/30">
            <h3 className="text-xl font-semibold text-white mb-3">
              💼 Boas Práticas para Empresas
            </h3>
            <ul className="text-white/90 space-y-2 list-disc list-inside">
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
