import { useState } from "react";
import { Menu } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import logo from "@/assets/logo-linkar.png";

export default function CompanyAbout() {
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
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

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
            <img src={logo} alt="Linka+ Logo" className="w-64 sm:w-80 h-auto mx-auto mb-3" />
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
