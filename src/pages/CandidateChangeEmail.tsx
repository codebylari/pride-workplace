import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { CompanySidebar } from "@/components/CompanySidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export default function ChangeEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const { darkMode } = useTheme();
  const { toast } = useToast();
  
  // Detecta se é empresa pela rota
  const isCompany = location.pathname.includes('company');

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

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
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center sticky top-0 z-40">
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
