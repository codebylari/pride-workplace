import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function CandidateAccount() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { darkMode } = useTheme();
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isCompany = user?.user_metadata?.user_type === "company";
  const displayName = isCompany 
    ? user?.user_metadata?.company_name || "Nome da Empresa"
    : user?.user_metadata?.full_name || "Nome do Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
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
            className="absolute left-0 top-0 h-full w-64 shadow-xl text-white flex flex-col"
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
                  navigate(isCompany ? "/company-settings" : "/candidate-settings");
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
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
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
          <div className="text-center mb-12 animate-fade-in">
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Conta
            </h1>
            <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }}></div>
          </div>

          <div className="space-y-6">
            {/* Alterar senha */}
            <button 
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 text-gray-300 hover:text-white" : "border-gray-200 text-gray-700 hover:text-gray-900"} transition text-left`}
              onClick={() => navigate("/candidate-change-password")}
            >
              <span className="text-lg">Alterar senha</span>
            </button>

            {/* Alterar email */}
            <button 
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 text-gray-300 hover:text-white" : "border-gray-200 text-gray-700 hover:text-gray-900"} transition text-left`}
              onClick={() => navigate("/candidate-change-email")}
            >
              <span className="text-lg">Alterar email</span>
            </button>

            {/* Desativar conta */}
            <button 
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 text-gray-300 hover:text-white" : "border-gray-200 text-gray-700 hover:text-gray-900"} transition text-left`}
              onClick={() => setShowDeactivateDialog(true)}
            >
              <span className="text-lg">Desativar conta</span>
            </button>
          </div>

          {/* Deletar conta */}
          <div className="mt-12 pt-12">
            <button 
              className="text-red-600 hover:text-red-700 transition font-medium"
              onClick={() => setShowDeleteDialog(true)}
            >
              Deletar conta
            </button>
          </div>
        </div>
      </main>

      {/* Dialog de Confirmação de Desativação */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center space-y-6 py-6">
            <h2 className="text-2xl font-bold text-gray-900">Desativar conta</h2>
            <p className="text-center text-gray-600">
              Você tem certeza que deseja deletar sua conta?
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowDeactivateDialog(false)}
                className="flex-1 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition font-medium"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setShowDeactivateDialog(false);
                  navigate("/candidate-deactivate-account");
                }}
                className="flex-1 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition font-medium"
              >
                Continuar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Deletar */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center space-y-6 py-6">
            <h2 className="text-2xl font-bold text-gray-900">Deletar conta</h2>
            <p className="text-center text-gray-600">
              Tem certeza que deseja deletar sua conta?
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition font-medium"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  navigate("/candidate-delete-account");
                }}
                className="flex-1 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition font-medium"
              >
                Continuar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <ChatBot />
    </div>
  );
}