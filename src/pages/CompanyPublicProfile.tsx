import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Bell, Star, Briefcase, User, Settings, Headset, Info, FileText, LogOut, ChevronUp, ChevronDown, ClipboardList, PlusCircle, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function CompanyPublicProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Mock data - será substituído por dados reais do banco baseado no ID
  const companyData = {
    name: "Mercado Livre",
    logo: "🛒",
    rating: 4.5,
    about: `O Mercado Livre Tech é uma unidade fictícia de tecnologia do Mercado Livre, liderada por uma empresária visionária. Aqui, não há distinção de gênero: valorizamos talento, comprometimento e criatividade de cada pessoa.`,
    seeking: [
      "Pessoas apaixonadas por tecnologia",
      "Vontade de aprender e crescer junto",
      "Gosto por assumir responsabilidade nas entregas",
      "Trabalho em equipe e boa comunicação",
      "Criatividade para resolver problemas de forma prática"
    ],
    training: {
      name: "Razão Social: Mercado Livre Tech Soluções em Tecnologia LTDA",
      fantasyName: "Nome Fantasia: Mercado Livre Tech",
      foundingDate: "Data de Fundação: 15/03/2018",
      location: "Sede: São Paulo – SP, Brasil",
      founder: "Fundadora/Diretora: Maria Fernanda Silva"
    },
    testimonials: [
      {
        name: "Camila R.",
        role: "Designer Júnior",
        icon: "🖤",
        text: "Foi minha primeira experiência de freelance e fiquei com receio, mas a equipe me tratou com respeito."
      },
      {
        name: "Mariana L.",
        role: "Programadora Back-end (trans)",
        icon: "💖",
        text: "O processo foi super organizado e transparente. A empresa me passou confiança desde o início e respeitou meus pronomes e nome social."
      },
      {
        name: "Felipe T.",
        role: "Estudante de Sistemas (gay)",
        icon: "🌈",
        text: "Me senti seguro durante todo o projeto. Nunca houve comentários preconceituosos e o time me ajudou com as dificuldades."
      },
      {
        name: "Bianca S.",
        role: "Analista de Dados Júnior",
        icon: "💜",
        text: "Foi incrível trabalhar em um ambiente onde minha opinião foi ouvida. Senti que realmente importava para o resultado final."
      },
      {
        name: "Rafa M.",
        role: "Designer Gráfico (não-binário)",
        icon: "⭐",
        text: "Foi minha primeira experiência de freelance e fiquei com receio, mas a equipe me tratou com respeito."
      },
      {
        name: "Carla V.",
        role: "QA Tester Freelancer (lésbica)",
        icon: "🌈",
        text: "Foi minha primeira experiência de freelance e fiquei com receio, mas a equipe me tratou com respeito."
      }
    ],
    jobs: [
      {
        id: 1,
        title: "Vaga Temporária - Analista de TI",
        type: "Freelancer · Remoto · Part-time",
        applicants: 15
      },
      {
        id: 2,
        title: "Desenvolvedor Full Stack",
        type: "CLT · Híbrido · Full-time",
        applicants: 23
      },
      {
        id: 3,
        title: "Designer UX/UI",
        type: "Freelancer · Remoto · Part-time",
        applicants: 8
      }
    ]
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

      {/* Sidebar - Menu do Candidato */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
            className="absolute left-0 top-0 h-full w-64 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center gap-4 border-b border-white/20">
              <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-white/80">candidato (a)</p>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>

              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/my-applications");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <ClipboardList size={24} />
                <span className="text-lg">Minhas Candidaturas</span>
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
                  navigate("/company-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className={`rounded-3xl shadow-lg p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            {/* Logo Section - SEM botão de editar */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg text-6xl">
                {companyData.logo}
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFullStar = star <= Math.floor(companyData.rating);
                const isHalfStar = star === Math.ceil(companyData.rating) && companyData.rating % 1 !== 0;
                
                if (isFullStar) {
                  return <Star key={star} size={24} className="fill-yellow-400 text-yellow-400" />;
                } else if (isHalfStar) {
                  return (
                    <div key={star} className="relative">
                      <Star size={24} className="text-yellow-400" />
                      <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star size={24} className="fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                  );
                } else {
                  return <Star key={star} size={24} className="text-gray-300" />;
                }
              })}
              <span className={`ml-2 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {companyData.rating}
              </span>
            </div>

            {/* Company Name */}
            <h1 className={`text-2xl font-semibold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Nome Empresa: {companyData.name}
            </h1>

            {/* Expandable Sections */}
            <div className="space-y-3 max-w-2xl mx-auto">
              {/* Conheça a Empresa */}
              <div>
                <Button
                  onClick={() => toggleSection("about")}
                  className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <span>Conheça a Empresa</span>
                  {expandedSection === "about" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                {expandedSection === "about" && (
                  <div className={`mt-3 p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-600" : "bg-white"} border border-gray-200`}>
                    <button
                      onClick={() => setExpandedSection(null)}
                      className="float-right text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                      ×
                    </button>
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Conheça a Empresa
                    </h3>
                    <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {companyData.about}
                    </p>
                  </div>
                )}
              </div>

              {/* O que buscamos */}
              <div>
                <Button
                  onClick={() => toggleSection("seeking")}
                  className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <span>O que buscamos</span>
                  {expandedSection === "seeking" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                {expandedSection === "seeking" && (
                  <div className={`mt-3 p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-600" : "bg-white"} border border-gray-200`}>
                    <button
                      onClick={() => setExpandedSection(null)}
                      className="float-right text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                      ×
                    </button>
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      O que buscamos
                    </h3>
                    <ul className={`list-disc pl-6 space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {companyData.seeking.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Relatos */}
              <div>
                <Button
                  onClick={() => toggleSection("testimonials")}
                  className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <span>Relatos</span>
                  {expandedSection === "testimonials" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                {expandedSection === "testimonials" && (
                  <div className={`mt-3 p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-600" : "bg-white"} border border-gray-200`}>
                    <button
                      onClick={() => setExpandedSection(null)}
                      className="float-right text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                      ×
                    </button>
                    <h3 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Relatos de pessoas que trabalharam na empresa
                    </h3>
                    <div className="space-y-4">
                      {companyData.testimonials.map((testimonial, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">{testimonial.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                                    {testimonial.name}
                                  </p>
                                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {testimonial.role}
                                  </p>
                                </div>
                                <span className="text-xl">{testimonial.icon}</span>
                              </div>
                              <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {testimonial.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Formação */}
              <div>
                <Button
                  onClick={() => toggleSection("training")}
                  className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <span>Formação</span>
                  {expandedSection === "training" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                {expandedSection === "training" && (
                  <div className={`mt-3 p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-600" : "bg-white"} border border-gray-200`}>
                    <button
                      onClick={() => setExpandedSection(null)}
                      className="float-right text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                      ×
                    </button>
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Formação
                    </h3>
                    <div className={`space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <p>{companyData.training.name}</p>
                      <p>{companyData.training.fantasyName}</p>
                      <p>{companyData.training.foundingDate}</p>
                      <p>{companyData.training.location}</p>
                      <p>{companyData.training.founder}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vagas Disponíveis */}
              <div>
                <Button
                  onClick={() => toggleSection("jobs")}
                  className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <span>Vagas Disponíveis</span>
                  {expandedSection === "jobs" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                {expandedSection === "jobs" && (
                  <div className={`mt-3 p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-600" : "bg-white"} border border-gray-200`}>
                    <button
                      onClick={() => setExpandedSection(null)}
                      className="float-right text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                      ×
                    </button>
                    <h3 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Vagas Disponíveis
                    </h3>
                    <div className="space-y-4">
                      {companyData.jobs.map((job) => (
                        <div
                          key={job.id}
                          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                        >
                          <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {job.title}
                          </h4>
                          <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {job.type}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {job.applicants} candidatos
                            </span>
                            <Button
                              onClick={() => navigate(`/job/${job.id}`)}
                              variant="link"
                              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                            >
                              Ver detalhes →
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
