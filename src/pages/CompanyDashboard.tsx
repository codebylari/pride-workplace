import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Bot, Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Extract company name from user metadata
  const companyName = user?.user_metadata?.company_name || "Empresa";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center">
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
            className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Section */}
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

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              
              <button 
                onClick={() => navigate("/company-profile")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
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
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            {/* Logout Button at Bottom */}
            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <LogOut size={24} />
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white border-4 border-blue-500 rounded-2xl p-12 shadow-lg mb-8 relative">
            <div className="text-center space-y-8">
              <h1 className="text-4xl font-bold text-gray-800">
                Bem-vindo, {companyName}!
              </h1>
              
              <p className="text-xl text-gray-600">
                "Gerencie suas oportunidades de forma simples e rápida."
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-green-300/80 hover:bg-green-400/80 text-green-900 px-12 py-6 rounded-xl text-lg font-semibold"
                >
                  Cadastre sua vaga
                </Button>
                
                <Button
                  onClick={() => navigate("/")}
                  className="bg-green-200/80 hover:bg-green-300/80 text-green-900 px-12 py-6 rounded-xl text-lg font-semibold"
                >
                  Acesse suas vagas
                </Button>
              </div>
            </div>

            {/* Chatbot Icon */}
            <div className="absolute bottom-4 right-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition">
                <Bot size={40} className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Vagas Ativas</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Candidaturas</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Em Análise</h3>
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
