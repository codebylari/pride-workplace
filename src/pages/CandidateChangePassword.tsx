import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { CompanySidebar } from "@/components/CompanySidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const { darkMode } = useTheme();
  const { toast } = useToast();
  
  // Detecta se é empresa pela rota
  const isCompany = location.pathname.includes('company');

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const passwordValidation = {
    minLength: newPassword.length >= 6,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!passwordValidation.hasUpperCase || !passwordValidation.hasLowerCase || !passwordValidation.hasNumber) {
      toast({
        title: "Erro",
        description: "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula e 1 número",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar a senha",
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
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      {isCompany ? (
        <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      ) : (
        <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Alterar senha
          </h1>

          <div className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-2xl p-8 shadow-lg space-y-6`}>
            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Atualize suas credenciais quando precisar.
            </p>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Digite sua senha atual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 text-black"
                  placeholder="Senha atual"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCurrentPassword(!showCurrentPassword);
                  }}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Digite sua nova senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 text-black"
                  placeholder="Nova senha"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowNewPassword(!showNewPassword);
                  }}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className={`mt-3 space-y-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                <p className="font-medium">Sua senha deve conter:</p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 ${passwordValidation.minLength ? "text-green-600" : ""}`}>
                    <span>{passwordValidation.minLength ? "✓" : "○"}</span>
                    <span>Mínimo de 6 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? "text-green-600" : ""}`}>
                    <span>{passwordValidation.hasUpperCase ? "✓" : "○"}</span>
                    <span>Pelo menos 1 letra maiúscula</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasLowerCase ? "text-green-600" : ""}`}>
                    <span>{passwordValidation.hasLowerCase ? "✓" : "○"}</span>
                    <span>Pelo menos 1 letra minúscula</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? "text-green-600" : ""}`}>
                    <span>{passwordValidation.hasNumber ? "✓" : "○"}</span>
                    <span>Pelo menos 1 número</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Confirme sua nova senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 text-black"
                  placeholder="Confirme a nova senha"
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

            <button
              onClick={handleChangePassword}
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
            <p className="text-center text-gray-600">Sua senha foi alterada com Sucesso!</p>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate(isCompany ? "/company-account" : "/account");
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
