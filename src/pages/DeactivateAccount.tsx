import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function DeactivateAccount() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { darkMode } = useTheme();
  const { toast } = useToast();

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCompany = user?.user_metadata?.user_type === "company";
  const displayName = isCompany 
    ? user?.user_metadata?.company_name || "Nome da Empresa"
    : user?.user_metadata?.full_name || "Nome do Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeactivate = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Sign in to verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: password,
      });

      if (signInError) {
        throw new Error("Senha incorreta");
      }

      // Deactivate account by updating is_active flag
      if (isCompany) {
        const { error: deactivateError } = await supabase
          .from('company_profiles')
          .update({ is_active: false })
          .eq('user_id', user?.id);

        if (deactivateError) throw deactivateError;
      } else {
        const { error: deactivateError } = await supabase
          .from('profiles')
          .update({ is_active: false })
          .eq('id', user?.id);

        if (deactivateError) throw deactivateError;
      }

      setPassword("");
      setConfirmPassword("");
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível desativar a conta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                  navigate(isCompany ? "/company-support" : "/candidate-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate(isCompany ? "/company-about" : "/candidate-about");
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
          <h1 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Desativar conta
          </h1>

          <div className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-2xl p-8 shadow-lg space-y-6`}>
            <div className={`${darkMode ? "bg-yellow-400/10 border-yellow-400/20" : "bg-yellow-50 border-yellow-200"} border rounded-lg p-4 mb-4`}>
              <p className={`text-center ${darkMode ? "text-yellow-300" : "text-yellow-800"} font-medium`}>
                ℹ️ Sua conta será temporariamente desativada. Você pode reativá-la a qualquer momento fazendo login novamente!
              </p>
            </div>
            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Para desativar sua conta, basta confirmar sua senha.
            </p>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Confirme sua senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 text-black"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Confirme sua senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 text-black"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate("/account")}
                className="flex-1 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className="flex-1 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50 font-medium"
              >
                {loading ? "Desativando..." : "Continuar"}
              </button>
            </div>
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
            <h2 className="text-2xl font-bold text-gray-900">Conta Desativada!</h2>
            <p className="text-center text-gray-600">
              Sua conta foi desativada com sucesso.
            </p>
            <p className="text-center text-gray-600 text-sm">
              Para reativar, basta fazer login novamente quando desejar retornar.
            </p>
            <button
              onClick={async () => {
                setShowSuccessDialog(false);
                await signOut();
                navigate("/");
              }}
              className="w-full max-w-xs py-3 bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 rounded-lg transition"
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
