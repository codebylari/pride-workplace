import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Briefcase, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function CandidateAbout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userName = user?.user_metadata?.full_name || "Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
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
            {/* Profile Section */}
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {userName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{userName}</h2>
                  <p className="text-sm text-white/80">candidato (a)</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Dashboard</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => setShowSidebar(false)}
                className="w-full flex items-center gap-4 p-4 bg-white/20 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-candidate");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            {/* Logout Button at Bottom */}
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
      <main className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Page Title */}
        <h1 className={`text-4xl font-bold text-center mb-16 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Quem Somos
        </h1>

        {/* About Section */}
        <div className={`rounded-2xl shadow-sm p-12 mb-12 animate-fade-in ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          <div className="prose prose-lg max-w-none">
            <p className={`leading-relaxed text-justify mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Somos uma plataforma criada com o propósito de fortalecer a presença de mulheres e pessoas da comunidade LGBTIAPN+ no mercado de Tecnologia da Informação.
            </p>
            
            <p className={`leading-relaxed text-justify mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Nosso objetivo é oferecer um espaço seguro, inclusivo e especializado para a divulgação de oportunidades de trabalho temporário, conectando profissionais qualificados a empresas que compartilham dos mesmos valores de respeito e diversidade.
            </p>
            
            <p className={`leading-relaxed text-justify mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Acreditamos que a tecnologia pode e deve ser um instrumento de transformação social.
            </p>
            
            <p className={`leading-relaxed text-justify ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Mais do que uma plataforma de trabalho, somos uma comunidade que apoia, acolhe e incentiva o crescimento profissional de cada pessoa usuária.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className={`rounded-2xl shadow-sm p-12 mb-12 animate-fade-in ${darkMode ? "bg-gray-700" : "bg-white"}`} style={{ animationDelay: '0.1s' }}>
          <h2 className={`text-2xl font-semibold mb-8 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
            Nossa Equipe
          </h2>
          
          <p className={`text-center leading-relaxed max-w-3xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Alunos do terceiro período de Sistemas de Informação, Engenharia de Software e Tecnologia de Análise e Desenvolvimento de Sistemas: Adryel Costa, Bruno Araujo, Larissa Soeiro e Rafaella Costa
          </p>
        </div>

        {/* Partners Section */}
        <div className={`rounded-2xl shadow-sm p-12 mb-12 animate-fade-in ${darkMode ? "bg-gray-700" : "bg-white"}`} style={{ animationDelay: '0.2s' }}>
          <h2 className={`text-2xl font-semibold mb-8 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
            Nossas Parcerias
          </h2>
          
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                <span className="text-red-600">U</span>
                <span className="text-blue-600">niSales</span>
              </div>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Centro Universitário Salesiano</p>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-center py-8">
            <div className="text-7xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                QueerCode
              </span>
            </div>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Diversidade em Tecnologia
            </p>
          </div>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
