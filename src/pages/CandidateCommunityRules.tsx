import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Menu, Shield, Users, Heart, AlertCircle, HandshakeIcon, CheckCircle, UserCheck, Briefcase, User, Settings, Headset, Info, FileText, ClipboardList, LogOut } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export default function CandidateCommunityRules() {
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
    <div className={`min-h-screen ${darkMode ? "bg-background" : "bg-gradient-primary"}`}>
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

        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowSidebar(false)}
        >
          <div
            style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
            className="fixed left-0 top-0 h-full w-[min(80vw,320px)] shadow-xl text-white flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 border-b border-white/20 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30 flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                  {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "C"}
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold truncate text-white">
                  {user?.user_metadata?.full_name || "Candidato"}
                </h2>
                <p className="text-xs sm:text-sm text-white/80">candidato (a)</p>
              </div>
            </div>

            <nav className="flex-1 py-4 sm:py-6 px-3 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
              <button
                onClick={() => navigate("/candidate-dashboard")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Briefcase size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Vagas</span>
              </button>
              <button
                onClick={() => navigate("/my-applications")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <ClipboardList size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Minhas Candidaturas</span>
              </button>
              <button
                onClick={() => navigate("/candidate-profile")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <User size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Meu Perfil</span>
              </button>
              <button
                onClick={() => navigate("/candidate-settings")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Settings size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Configurações</span>
              </button>
              <button
                onClick={() => navigate("/candidate-support")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Headset size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Suporte</span>
              </button>
              <button
                onClick={() => navigate("/candidate-about")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <Info size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Quem Somos</span>
              </button>
              <button
                onClick={() => navigate("/candidate-community-rules")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/20 rounded-lg transition text-left text-white"
              >
                <Shield size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Regras da Comunidade</span>
              </button>
              <button
                onClick={() => navigate("/terms-candidate")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-white"
              >
                <FileText size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Termos de Uso</span>
              </button>
            </nav>

            <div className="p-3 sm:p-4 border-t border-white/20 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
              >
                <LogOut size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-card/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-card">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🌈</div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Regras da Comunidade
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Juntos construímos um espaço inclusivo e respeitoso
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
              <li>Primeira violação: Aviso formal</li>
              <li>Segunda violação: Suspensão temporária da conta</li>
              <li>Violações graves ou repetidas: Banimento permanente</li>
            </ul>
          </div>

          <div className="bg-success/20 backdrop-blur-sm rounded-2xl p-6 border border-success/30">
            <h3 className="text-xl font-semibold text-primary-foreground mb-3">
              💡 Dica para Candidatos
            </h3>
            <p className="text-primary-foreground/90">
              Mantenha seu perfil atualizado, seja proativo nas candidaturas e sempre 
              mantenha uma comunicação profissional. Sua reputação na plataforma é valiosa!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
