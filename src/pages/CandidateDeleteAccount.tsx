import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { CompanySidebar } from "@/components/CompanySidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export default function CandidateDeleteAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const { darkMode } = useTheme();
  const { toast } = useToast();
  
  // Detecta se é empresa pela rota
  const isCompany = location.pathname.includes('company');

  const [showFarewellDialog, setShowFarewellDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
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

      // Delete the auth user and all related data using edge function
      const { data: { session } } = await supabase.auth.getSession();
      const { error: deleteError } = await supabase.functions.invoke('delete-user-account', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (deleteError) throw deleteError;

      setPassword("");
      setConfirmPassword("");
      setShowFarewellDialog(true);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível deletar a conta",
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
            Deletar conta
          </h1>

          <div className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-2xl p-8 shadow-lg space-y-6`}>
            <div className={`${darkMode ? "bg-red-400/10 border-red-400/20" : "bg-red-50 border-red-200"} border rounded-lg p-4 mb-4`}>
              <p className={`text-center ${darkMode ? "text-red-300" : "text-red-800"} font-medium`}>
                ⚠️ ATENÇÃO: Esta ação deletará PERMANENTEMENTE sua conta e todos os seus dados do banco de dados!
              </p>
            </div>
            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Todos os seus dados serão apagados permanentemente. Esta ação não pode ser desfeita! Você poderá criar uma nova conta usando o mesmo email no futuro, mas seus dados atuais serão perdidos.
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
                onClick={() => navigate(isCompany ? "/company-account" : "/candidate-account")}
                className="flex-1 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 font-medium"
              >
                {loading ? "Deletando..." : "Deletar Permanentemente"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Dialog de Despedida */}
      <Dialog open={showFarewellDialog} onOpenChange={setShowFarewellDialog}>
        <DialogContent className="sm:max-w-2xl">
          <div className="flex flex-col items-center justify-center space-y-6 py-8 px-4">
            <h2 className="text-3xl font-bold text-gray-900">Deletar conta</h2>
            <div className="text-center space-y-4 text-gray-700">
              <p>Sua conta foi excluída permanentemente. 😔</p>
              <p>
                Sinto muito em saber que você decidiu nos deixar. Sua presença aqui fez diferença, 
                e vamos sentir sua falta.
              </p>
              <p>
                Se mudar de ideia, você pode se cadastrar novamente a qualquer momento usando o mesmo email ou outro.
              </p>
              <p>Desejamos tudo de bom nos seus próximos passos! 💛</p>
            </div>
            <button
              onClick={async () => {
                setShowFarewellDialog(false);
                await signOut();
                navigate("/");
              }}
              className="w-full max-w-xs py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition font-medium"
            >
              Voltar ao inicio
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      <ChatBot />
    </div>
  );
}
