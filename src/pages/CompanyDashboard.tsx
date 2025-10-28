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
      {/* Conexões tecnológicas no lado esquerdo */}
      <div className="absolute left-0 top-[72px] bottom-0 w-1/3 overflow-hidden pointer-events-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMinYMid slice">
          {/* Pontos (nós da rede) */}
          <circle cx="50" cy="100" r="4" fill="#6b7280" />
          <circle cx="150" cy="80" r="4" fill="#6b7280" />
          <circle cx="280" cy="120" r="4" fill="#6b7280" />
          <circle cx="100" cy="200" r="4" fill="#6b7280" />
          <circle cx="220" cy="220" r="4" fill="#6b7280" />
          <circle cx="320" cy="180" r="4" fill="#6b7280" />
          <circle cx="80" cy="320" r="4" fill="#6b7280" />
          <circle cx="180" cy="340" r="4" fill="#6b7280" />
          <circle cx="300" cy="300" r="4" fill="#6b7280" />
          <circle cx="120" cy="440" r="4" fill="#6b7280" />
          <circle cx="240" cy="420" r="4" fill="#6b7280" />
          <circle cx="340" cy="460" r="4" fill="#6b7280" />
          <circle cx="60" cy="560" r="4" fill="#6b7280" />
          <circle cx="160" cy="540" r="4" fill="#6b7280" />
          <circle cx="280" cy="580" r="4" fill="#6b7280" />
          <circle cx="140" cy="680" r="4" fill="#6b7280" />
          <circle cx="260" cy="700" r="4" fill="#6b7280" />
          <circle cx="360" cy="660" r="4" fill="#6b7280" />
          
          {/* Linhas conectando os pontos */}
          <line x1="50" y1="100" x2="150" y2="80" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="150" y1="80" x2="280" y2="120" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="50" y1="100" x2="100" y2="200" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="150" y1="80" x2="100" y2="200" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="280" y1="120" x2="220" y2="220" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="280" y1="120" x2="320" y2="180" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="100" y1="200" x2="220" y2="220" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="220" y1="220" x2="320" y2="180" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="100" y1="200" x2="80" y2="320" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="220" y1="220" x2="180" y2="340" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="320" y1="180" x2="300" y2="300" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="80" y1="320" x2="180" y2="340" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="180" y1="340" x2="300" y2="300" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="80" y1="320" x2="120" y2="440" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="180" y1="340" x2="240" y2="420" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="300" y1="300" x2="340" y2="460" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="120" y1="440" x2="240" y2="420" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="240" y1="420" x2="340" y2="460" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="120" y1="440" x2="60" y2="560" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="120" y1="440" x2="160" y2="540" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="240" y1="420" x2="280" y2="580" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="60" y1="560" x2="160" y2="540" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="160" y1="540" x2="280" y2="580" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="160" y1="540" x2="140" y2="680" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="280" y1="580" x2="260" y2="700" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="280" y1="580" x2="360" y2="660" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="140" y1="680" x2="260" y2="700" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="260" y1="700" x2="360" y2="660" stroke="#6b7280" strokeWidth="1.5" />
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
