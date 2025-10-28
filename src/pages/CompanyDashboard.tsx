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
      {/* Formas tecnológicas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {/* Círculo superior esquerdo */}
        <div className="absolute -top-20 -left-20 w-64 h-64 border-4 border-gray-400 rounded-full" />
        
        {/* Hexágono superior direito */}
        <svg className="absolute top-10 right-32 w-48 h-48" viewBox="0 0 100 100">
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="rgb(156, 163, 175)" strokeWidth="2" />
        </svg>
        
        {/* Triângulo inferior esquerdo */}
        <svg className="absolute bottom-32 left-40 w-40 h-40" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="rgb(156, 163, 175)" strokeWidth="2" />
        </svg>
        
        {/* Retângulo rotacionado inferior direito */}
        <div className="absolute bottom-20 right-20 w-56 h-56 border-4 border-gray-400 transform rotate-45" />
        
        {/* Pequenos círculos decorativos */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-gray-300 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 border-2 border-gray-300 rounded-full" />
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
                  className="bg-green-300 hover:bg-green-400 text-green-900 px-12 py-6 rounded-xl text-lg font-semibold"
                >
                  Cadastre sua vaga
                </Button>
                
                <Button
                  onClick={() => navigate("/company-jobs")}
                  className="bg-green-300 hover:bg-green-400 text-green-900 px-12 py-6 rounded-xl text-lg font-semibold"
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
