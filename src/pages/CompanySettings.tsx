import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Briefcase, PlusCircle, User, Settings as SettingsIcon, Headset, Info, FileText, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function CompanySettings() {
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { darkMode, setDarkMode } = useTheme();

  const isCompany = (userRole ? userRole === "company" : Boolean(user?.user_metadata?.company_name || user?.user_metadata?.user_type === "company"));
  const displayName = isCompany 
    ? user?.user_metadata?.company_name || "Nome da Empresa"
    : user?.user_metadata?.full_name || "Nome do Usuário";

  // Toggle dark mode via global ThemeContext
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
  };
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
                    {displayName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{displayName}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Dashboard</span>
              </button>
              
              {isCompany && (
                <button 
                  onClick={() => {
                    setShowSidebar(false);
                    navigate("/create-job");
                  }}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
                >
                  <PlusCircle size={24} />
                  <span className="text-lg">Cadastrar Vagas</span>
                </button>
              )}
              
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
                className="w-full flex items-center gap-4 p-4 bg-white/10 rounded-lg transition text-left"
              >
                <SettingsIcon size={24} />
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Configurações
          </h1>

          <div className="space-y-6">
            {/* Notificações */}
            <div className={`flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Notificações
              </span>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            {/* Notificações Email */}
            <div className={`flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Notificações Email
              </span>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {/* Dark Mode */}
            <div className={`flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Dark mode
              </span>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>

            {/* Conta */}
            <button 
              onClick={() => navigate("/account")}
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"} transition text-left`}
            >
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Conta
              </span>
            </button>
          </div>
        </div>
      </main>
      
      <ChatBot />
    </div>
  );
}
