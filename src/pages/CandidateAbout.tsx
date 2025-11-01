import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import logo from "@/assets/logo-linkar.png";
import logoUnisales from "@/assets/logo-unisales.svg";

export default function CandidateAbout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);

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
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className={`text-5xl sm:text-6xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Quem Somos
          </h1>
          <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }}></div>
        </div>

        {/* Mission Section */}
        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 mb-8 animate-fade-in border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
              Nossa Missão
            </h2>
            <div className={`space-y-6 text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <p className="text-center">
                Somos uma plataforma criada com o propósito de fortalecer a presença de mulheres e pessoas da comunidade LGBTIAPN+ no mercado de Tecnologia da Informação.
              </p>
              
              <p className="text-center">
                Nosso objetivo é oferecer um espaço seguro, inclusivo e especializado para a divulgação de oportunidades de trabalho temporário, conectando profissionais qualificados a empresas que compartilham dos mesmos valores de respeito e diversidade.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 mb-8 animate-fade-in border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`} style={{ animationDelay: '0.1s' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
              Nossa Visão
            </h2>
            <div className={`space-y-6 text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <p className="text-center">
                Acreditamos que a tecnologia pode e deve ser um instrumento de transformação social.
              </p>
              
              <p className="text-center">
                Mais do que uma plataforma de trabalho, somos uma comunidade que apoia, acolhe e incentiva o crescimento profissional de cada pessoa usuária.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 mb-8 animate-fade-in border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`} style={{ animationDelay: '0.2s' }}>
          <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
            Equipe de Desenvolvimento
          </h2>
          
          <div className={`text-center leading-relaxed max-w-3xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <p className="text-lg mb-4">
              Projeto desenvolvido por alunos do terceiro período dos cursos de Sistemas de Informação, Engenharia de Software e Tecnologia de Análise e Desenvolvimento de Sistemas.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-100 text-gray-700"}`}>Adryel Costa</span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-100 text-gray-700"}`}>Bruno Araujo</span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-100 text-gray-700"}`}>Larissa Soeiro</span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-100 text-gray-700"}`}>Rafaella Costa</span>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 mb-8 animate-fade-in border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`} style={{ animationDelay: '0.3s' }}>
          <h2 className={`text-3xl font-bold mb-10 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
            Parcerias Institucionais
          </h2>
          
          <div className="flex justify-center">
            <div className="text-center">
              <img src={logoUnisales} alt="UniSales - Centro Universitário Salesiano" className="w-64 h-auto mx-auto mb-4" />
              <p className={`text-base font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Centro Universitário Salesiano</p>
            </div>
          </div>
        </div>

        {/* Brand Section */}
        <div className="flex justify-center animate-fade-in mt-16" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <img 
              src={logo} 
              alt="Linka+ - Plataforma de Diversidade em Tecnologia" 
              className="w-72 sm:w-96 h-auto mx-auto mb-4"
              style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(18%) saturate(1453%) hue-rotate(268deg) brightness(93%) contrast(90%)' }}
            />
            <p className={`text-lg font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
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
