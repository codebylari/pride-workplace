import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Extrai o nome da empresa dos metadados do usuário
  const companyName = user?.user_metadata?.company_name || "Empresa";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Conexões tecnológicas com brilho em todo o fundo */}
      <div className="absolute left-0 top-[72px] right-0 bottom-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Filtro de brilho para os pontos */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Pontos com brilho */}
          <circle cx="10%" cy="15%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="25%" cy="12%" r="2" fill="#9ca3af" />
          <circle cx="40%" cy="18%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="55%" cy="10%" r="2" fill="#9ca3af" />
          <circle cx="70%" cy="20%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="85%" cy="15%" r="2" fill="#9ca3af" />
          
          <circle cx="15%" cy="30%" r="2" fill="#9ca3af" />
          <circle cx="32%" cy="35%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="48%" cy="28%" r="2" fill="#9ca3af" />
          <circle cx="62%" cy="38%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="78%" cy="32%" r="2" fill="#9ca3af" />
          <circle cx="90%" cy="35%" r="4" fill="#6b7280" filter="url(#glow)" />
          
          <circle cx="8%" cy="50%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="22%" cy="48%" r="2" fill="#9ca3af" />
          <circle cx="38%" cy="52%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="52%" cy="45%" r="2" fill="#9ca3af" />
          <circle cx="68%" cy="55%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="82%" cy="48%" r="2" fill="#9ca3af" />
          
          <circle cx="12%" cy="68%" r="2" fill="#9ca3af" />
          <circle cx="28%" cy="65%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="45%" cy="70%" r="2" fill="#9ca3af" />
          <circle cx="60%" cy="68%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="75%" cy="72%" r="2" fill="#9ca3af" />
          <circle cx="88%" cy="65%" r="4" fill="#6b7280" filter="url(#glow)" />
          
          <circle cx="18%" cy="85%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="35%" cy="88%" r="2" fill="#9ca3af" />
          <circle cx="50%" cy="82%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="65%" cy="90%" r="2" fill="#9ca3af" />
          <circle cx="80%" cy="85%" r="3" fill="#6b7280" filter="url(#glow)" />
          
          {/* Linhas de conexão */}
          <line x1="10%" y1="15%" x2="25%" y2="12%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="25%" y1="12%" x2="40%" y2="18%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="40%" y1="18%" x2="55%" y2="10%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="55%" y1="10%" x2="70%" y2="20%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="70%" y1="20%" x2="85%" y2="15%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="10%" y1="15%" x2="15%" y2="30%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="25%" y1="12%" x2="32%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="40%" y1="18%" x2="48%" y2="28%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="55%" y1="10%" x2="62%" y2="38%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="70%" y1="20%" x2="78%" y2="32%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="85%" y1="15%" x2="90%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="15%" y1="30%" x2="32%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="32%" y1="35%" x2="48%" y2="28%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="48%" y1="28%" x2="62%" y2="38%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="62%" y1="38%" x2="78%" y2="32%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="78%" y1="32%" x2="90%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="15%" y1="30%" x2="8%" y2="50%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="32%" y1="35%" x2="22%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="48%" y1="28%" x2="38%" y2="52%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="62%" y1="38%" x2="52%" y2="45%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="78%" y1="32%" x2="68%" y2="55%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="90%" y1="35%" x2="82%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="8%" y1="50%" x2="22%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="22%" y1="48%" x2="38%" y2="52%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="38%" y1="52%" x2="52%" y2="45%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="52%" y1="45%" x2="68%" y2="55%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="68%" y1="55%" x2="82%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="8%" y1="50%" x2="12%" y2="68%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="22%" y1="48%" x2="28%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="38%" y1="52%" x2="45%" y2="70%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="52%" y1="45%" x2="60%" y2="68%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="68%" y1="55%" x2="75%" y2="72%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="82%" y1="48%" x2="88%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="12%" y1="68%" x2="28%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="28%" y1="65%" x2="45%" y2="70%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="45%" y1="70%" x2="60%" y2="68%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="60%" y1="68%" x2="75%" y2="72%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="75%" y1="72%" x2="88%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="12%" y1="68%" x2="18%" y2="85%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="28%" y1="65%" x2="35%" y2="88%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="45%" y1="70%" x2="50%" y2="82%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="60%" y1="68%" x2="65%" y2="90%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="75%" y1="72%" x2="80%" y2="85%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="18%" y1="85%" x2="35%" y2="88%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="35%" y1="88%" x2="50%" y2="82%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="50%" y1="82%" x2="65%" y2="90%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="65%" y1="90%" x2="80%" y2="85%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
        </svg>
      </div>

      {/* Cabeçalho */}
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

      {/* Menu Lateral */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
            className="absolute left-0 top-0 h-full w-80 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Seção de Perfil */}
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">ML</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{companyName}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            {/* Itens do Menu */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              
              <button 
                onClick={() => navigate("/create-job")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-jobs");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <List size={24} />
                <span className="text-lg">Minhas Vagas</span>
              </button>
              
              <button 
                onClick={() => navigate("/company-profile")}
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
                  navigate("/company-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-company");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            {/* Botão de Sair no Final */}
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

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Card de Boas-vindas */}
          <div className={`rounded-2xl p-12 shadow-lg mb-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <div className="text-center space-y-8">
              <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Bem-vindo, {companyName}!
              </h1>
              
              <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                "Gerencie suas oportunidades de forma simples e rápida."
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
                <Button
                  onClick={() => navigate("/create-job")}
                  className="bg-[#C1E1C1] hover:bg-[#B0D5B0] text-gray-900 px-12 py-6 rounded-xl text-lg font-semibold"
                >
                  Cadastre sua vaga
                </Button>
                
                <Button
                  onClick={() => navigate("/company-jobs")}
                  className="bg-[#C1E1C1] hover:bg-[#B0D5B0] text-gray-900 px-12 py-6 rounded-xl text-lg font-semibold"
                >
                  Acesse suas vagas
                </Button>
              </div>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-xl p-6 shadow-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Vagas Ativas</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
            
            <div className={`rounded-xl p-6 shadow-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Candidaturas</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            
            <div className={`rounded-xl p-6 shadow-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Em Análise</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
