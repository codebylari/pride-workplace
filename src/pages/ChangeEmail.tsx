import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function ChangeEmail() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { darkMode } = useTheme();
  const { toast } = useToast();

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isCompany = user?.user_metadata?.user_type === "company";
  const displayName = isCompany 
    ? user?.user_metadata?.company_name || "Nome da Empresa"
    : user?.user_metadata?.full_name || "Nome do Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleChangeEmail = async () => {
    if (!currentEmail || !newEmail || !confirmNewEmail) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (newEmail !== confirmNewEmail) {
      toast({
        title: "Erro",
        description: "Os emails não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (currentEmail !== user?.email) {
      toast({
        title: "Erro",
        description: "O email atual está incorreto",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      setCurrentEmail("");
      setNewEmail("");
      setConfirmNewEmail("");
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar o email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <h1 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Alterar email
          </h1>

          <div className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-2xl p-8 shadow-lg space-y-6`}>
            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Atualize suas credenciais quando precisar.
            </p>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Digite seu email cadastrado
              </label>
              <input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 text-black"
                placeholder="Email atual"
              />
            </div>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Digite o seu novo email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 text-black"
                placeholder="Novo email"
              />
            </div>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Confirme seu novo email
              </label>
              <input
                type="email"
                value={confirmNewEmail}
                onChange={(e) => setConfirmNewEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 text-black"
                placeholder="Confirme o novo email"
              />
            </div>

            <button
              onClick={handleChangeEmail}
              disabled={loading}
              className="w-full py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50 font-medium"
            >
              {loading ? "Alterando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </main>

      {/* Dialog de Sucesso */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">SUCESSO!</h2>
            <p className="text-center text-gray-600">Seu email foi alterado com Sucesso!</p>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/account");
              }}
              className="w-full max-w-xs py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-lg transition"
            >
              Ok
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      <ChatBot />
    </div>
  );
}
