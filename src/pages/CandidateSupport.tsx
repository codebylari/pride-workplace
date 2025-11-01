import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MessageCircle, BookOpen, Mail, HelpCircle, FileText } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function CandidateSupport() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || "Usuário";


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
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Central de Suporte
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Estamos aqui para ajudar você
          </p>
          <div className="w-24 h-1 mx-auto mt-6" style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }}></div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <button 
            onClick={() => setChatOpen(true)}
            className={`group rounded-3xl shadow-lg p-8 text-left transition-all hover:scale-[1.02] border ${darkMode ? "bg-gray-700 border-gray-600 hover:border-purple-500" : "bg-white border-gray-100 hover:border-purple-400"}`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Chat de Suporte
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Converse com nossa assistente virtual para tirar dúvidas rápidas
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate("/candidate-community-rules")}
            className={`group rounded-3xl shadow-lg p-8 text-left transition-all hover:scale-[1.02] border ${darkMode ? "bg-gray-700 border-gray-600 hover:border-purple-500" : "bg-white border-gray-100 hover:border-purple-400"}`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Regras da Comunidade
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Conheça as diretrizes e boas práticas da plataforma
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* FAQ Section */}
        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 mb-8 border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className={darkMode ? "text-purple-400" : "text-purple-600"} size={32} />
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-600/50" : "bg-gray-50"}`}>
              <h3 className={`font-bold mb-2 text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                Como atualizar meu perfil?
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Acesse o menu lateral e clique em "Perfil". Lá você poderá editar suas informações profissionais, foto, currículo e outras informações.
              </p>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-600/50" : "bg-gray-50"}`}>
              <h3 className={`font-bold mb-2 text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                Como me candidatar a uma vaga?
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                No painel de vagas, clique na oportunidade de interesse e depois no botão "Candidatar-se". Certifique-se de que seu perfil está completo antes de se candidatar.
              </p>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-600/50" : "bg-gray-50"}`}>
              <h3 className={`font-bold mb-2 text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                Como acompanhar minhas candidaturas?
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Acesse "Minhas Candidaturas" no menu lateral para visualizar o status de todas as vagas para as quais você se candidatou.
              </p>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-600/50" : "bg-gray-50"}`}>
              <h3 className={`font-bold mb-2 text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                Meus dados estão seguros?
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Sim! Seus dados pessoais sensíveis não são exibidos publicamente. Todas as informações são tratadas com confidencialidade conforme nossa política de privacidade.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className="flex items-center gap-3 mb-8">
            <Mail className={darkMode ? "text-purple-400" : "text-purple-600"} size={32} />
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Entre em Contato
            </h2>
          </div>

          <div className={`space-y-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <p className="text-lg">
              Não encontrou a resposta que procurava? Entre em contato conosco:
            </p>
            
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-600/50" : "bg-gray-50"}`}>
              <p className="font-medium mb-2">Email de Suporte:</p>
              <a href="mailto:suporte@linkamais.com" className="text-purple-600 hover:text-purple-700 font-semibold">
                suporte@linkamais.com
              </a>
            </div>

            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Respondemos normalmente em até 24 horas úteis.
            </p>
          </div>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
