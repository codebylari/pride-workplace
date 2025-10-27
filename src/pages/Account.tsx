import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function Account() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { darkMode } = useTheme();

  const isCompany = user?.user_metadata?.user_type === "company";
  const displayName = isCompany 
    ? user?.user_metadata?.company_name || "Nome da Empresa"
    : user?.user_metadata?.full_name || "Nome do Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
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
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {displayName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{displayName}</h2>
                  <p className="text-sm text-white/80">{isCompany ? "empresa" : "candidato"}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate(isCompany ? "/company-dashboard" : "/candidate-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Dashboard</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate(isCompany ? "/company-profile" : "/candidate-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate(isCompany ? "/terms-company" : "/terms-candidate");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Conta
          </h1>

          <div className="space-y-6">
            {/* Alterar senha */}
            <button 
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 text-gray-300 hover:text-white" : "border-gray-200 text-gray-700 hover:text-gray-900"} transition text-left`}
              onClick={() => {
                // TODO: Implementar alteração de senha
                console.log("Alterar senha");
              }}
            >
              <span className="text-lg">Alterar senha</span>
            </button>

            {/* Alterar email */}
            <button 
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 text-gray-300 hover:text-white" : "border-gray-200 text-gray-700 hover:text-gray-900"} transition text-left`}
              onClick={() => {
                // TODO: Implementar alteração de email
                console.log("Alterar email");
              }}
            >
              <span className="text-lg">Alterar email</span>
            </button>

            {/* Desativar conta */}
            <button 
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 text-gray-300 hover:text-white" : "border-gray-200 text-gray-700 hover:text-gray-900"} transition text-left`}
              onClick={() => {
                // TODO: Implementar desativação de conta
                console.log("Desativar conta");
              }}
            >
              <span className="text-lg">Desativar conta</span>
            </button>
          </div>

          {/* Deletar conta */}
          <div className="mt-12 pt-12 border-t border-gray-300">
            <button 
              className="text-red-600 hover:text-red-700 transition font-medium"
              onClick={() => {
                // TODO: Implementar exclusão de conta
                console.log("Deletar conta");
              }}
            >
              Deletar conta
            </button>
          </div>
        </div>
      </main>
      
      <ChatBot />
    </div>
  );
}