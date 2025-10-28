import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function TermsCompany() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const companyName = user?.user_metadata?.company_name || "Empresa";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <Bell size={24} />
          </button>
          
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notificações</h3>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>Sem novas notificações</p>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
            className="absolute left-0 top-0 h-full w-80 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {companyName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{companyName}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => setShowSidebar(false)}
                className="w-full flex items-center gap-4 p-4 bg-white/20 rounded-lg transition text-left"
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
      <main className="container mx-auto px-8 py-12 max-w-5xl">
        <h1 className={`text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
          <span className="text-red-500">📌</span>
          Termos e Condições – Empresas Apoiadoras
        </h1>

        <div className={`rounded-lg shadow-sm p-8 space-y-6 text-justify leading-relaxed ${darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-700"}`}>
          <p>Bem-vindo(a) à nossa plataforma.</p>

          <p>
            O cadastro e participação de empresas aqui representam um compromisso com um ambiente inclusivo, justo e respeitoso. Ao aceitar estes Termos, sua empresa passa a fazer parte de uma rede que valoriza a diversidade e reconhece a importância de oportunidades seguras para mulheres e pessoas da comunidade LGBT+.
          </p>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>1. Compromisso com o Respeito e a Inclusão</h2>
            <p>
              A empresa declara que todas as vagas e interações realizadas dentro da plataforma estarão alinhadas com os princípios de inclusão, igualdade e respeito. É expressamente proibida a divulgação de vagas discriminatórias, linguagem preconceituosa ou restrições que não tenham justificativa técnica ou legal.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>2. Profissionalismo e Cordialidade nas Relações</h2>
            <p>
              A comunicação com os candidatos deve ser conduzida com ética, transparência e profissionalismo em todas as etapas do processo seletivo. Espera-se que a empresa trate cada candidato(a) com a devida consideração, reconhecendo que por trás de cada perfil existe uma história, uma trajetória e um projeto de vida.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>3. Clareza e Honestidade nas Vagas Publicadas</h2>
            <p>
              A empresa se compromete a fornecer descrições de vagas claras, completas e verdadeiras. Devem constar informações como título do cargo, atribuições, requisitos, diferenciais, tipo de contrato, remuneração/faixa salarial e local de trabalho (remoto, híbrido ou presencial). É vedado publicar anúncios enganosos ou utilizar a plataforma apenas para a oferta legítima de oportunidades.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>4. Valorização da Diversidade</h2>
            <p>
              Ao utilizar esta plataforma, a empresa reconhece que está em um espaço dedicado ao fortalecimento de grupos historicamente marginalizados. Assim, compromete-se a não apenas respeitar, mas também a incentivar a presença de mulheres e pessoas LGBT+ em seus processos seletivos, contribuindo para a construção de um mercado de trabalho mais justo e diverso.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>5. Confiabilidade e Responsabilidade</h2>
            <p>
              A empresa deve manter seus dados institucionais atualizados e disponíveis para eventual validação (como CNPJ ativo e informações do responsável). O descumprimento dos princípios estabelecidos poderá resultar em advertência, suspensão temporária ou exclusão definitiva da conta.
            </p>
            <p>
              Ao prosseguir com o cadastro, a empresa declara ter lido, compreendido e aceito todos os termos acima, assumindo o compromisso de manter um ambiente seguro, respeitoso e inclusivo dentro da plataforma.
            </p>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
