import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";

export default function CandidateAccount() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const { darkMode } = useTheme();
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

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
              Você tem certeza que deseja desativar sua conta?
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