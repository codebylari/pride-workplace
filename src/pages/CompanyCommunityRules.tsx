import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Menu, Shield, Users, Heart, AlertCircle, HandshakeIcon, Briefcase, UserCheck, PlusCircle, List, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
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
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>

        <div className="[&_svg]:text-white [&_button]:hover:bg-white/10">
          <NotificationsPanel />
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowSidebar(false)}
        >
          <div
            style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
            className="fixed left-0 top-0 h-full w-64 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {user?.user_metadata?.company_name?.substring(0, 2).toUpperCase() || "ML"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{user?.user_metadata?.company_name || "Empresa"}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2">
              <button
                onClick={() => navigate("/company-dashboard")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              <button
                onClick={() => navigate("/create-job")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              <button
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-jobs");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <List size={24} />
                <span className="text-lg">Minhas Vagas</span>
              </button>
              <button
                onClick={() => navigate("/company-profile")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              <button
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              <button
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              <button
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              <button
                onClick={() => navigate("/company-community-rules")}
                className="w-full flex items-center gap-4 p-4 bg-white/20 rounded-lg transition text-left text-white"
              >
                <Shield size={24} />
                <span className="text-lg">Regras da Comunidade</span>
              </button>
              <button
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-company");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            <div className="p-4 border-t border-white/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
              >
                <LogOut size={24} />
                <span className="text-lg">Sair</span>
              </button>
            </div>
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
