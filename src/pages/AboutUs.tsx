import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AboutUs() {
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.company_name || "Usuário";
  const isCompany = userRole === "company";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Bell size={24} />
        </button>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 shadow-xl text-white flex flex-col"
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
                  <p className="text-sm text-white/80">{isCompany ? "empresa" : "candidato (a)"}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate(isCompany ? "/company-dashboard" : "/candidate-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              
              {isCompany && (
                <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                  <PlusCircle size={24} />
                  <span className="text-lg">Cadastrar Vagas</span>
                </button>
              )}
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate(isCompany ? "/company-profile" : "/candidate-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
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
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            {/* Logout Button at Bottom */}
            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <LogOut size={24} />
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-12">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Quem Somos
          </h1>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Text Card */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-8 shadow-lg animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Quem somos
              </h2>
              
              <div className="space-y-4 text-gray-700 text-justify leading-relaxed">
                <p>
                  Somos uma plataforma criada com o propósito de fortalecer a presença de mulheres e pessoas da comunidade LGBTIAPN+ no mercado de Tecnologia da Informação.
                </p>
                
                <p>
                  Nosso objetivo é oferecer um espaço seguro, inclusivo e especializado para a divulgação de oportunidades de trabalho temporário, conectando profissionais qualificados a empresas que compartilham dos mesmos valores de respeito e diversidade.
                </p>
                
                <p>
                  Acreditamos que a tecnologia pode e deve ser um instrumento de transformação social.
                </p>
                
                <p>
                  Mais do que uma plataforma de trabalho, somos uma comunidade que apoia, acolhe e incentiva o crescimento profissional de cada pessoa usuária.
                </p>
              </div>
            </div>

            {/* Team & Partners Section */}
            <div className="space-y-8">
              {/* Team Card */}
              <div className="bg-white rounded-3xl p-8 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  Nossa Equipe
                </h2>
                
                <p className="text-gray-700 text-center leading-relaxed">
                  Alunos do terceiro período de Sistemas de Informação, Engenharia de Software e Tecnologia de Análise e Desenvolvimento de Sistemas: <strong>Adryel Costa, Bruno Araujo, Larissa Soeiro e Rafaella Costa</strong>
                </p>
              </div>

              {/* Partners Card */}
              <div className="bg-white rounded-3xl p-8 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Nossas Parcerias
                </h2>
                
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="text-center space-y-2">
                      <div className="text-5xl font-bold">
                        <span className="text-red-600">U</span>
                        <span className="text-blue-600">niSales</span>
                      </div>
                      <p className="text-sm text-gray-600">Centro Universitário Salesiano</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex justify-center mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="inline-block bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 rounded-3xl shadow-xl">
                <div className="bg-white rounded-3xl px-12 py-6">
                  <div className="text-6xl font-bold">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      QueerCode
                    </span>
                  </div>
                  <div className="text-lg text-gray-600 mt-2">
                    Diversidade em Tecnologia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
