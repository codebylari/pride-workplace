import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Star, Edit, Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut, ChevronUp, ChevronDown, Heart, List, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { CircularProgress } from "@/components/CircularProgress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CompanyProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [rating, setRating] = useState(5.0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [companyData, setCompanyData] = useState({
    about: "",
    seeking: [] as string[],
    training: {
      name: "",
      fantasyName: "",
      foundingDate: "",
      location: "",
      founder: ""
    },
    testimonials: [] as Array<{
      name: string;
      role: string;
      icon: string;
      text: string;
    }>,
    jobs: [] as Array<{
      id: number;
      title: string;
      type: string;
      applicants: number;
    }>,
    description: "",
    sector: "",
    city: "",
    fantasy_name: "",
    cnpj: ""
  });

  const companyName = user?.user_metadata?.company_name || user?.user_metadata?.fantasy_name || "Empresa";

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from("company_profiles")
        .select("logo_url, about, seeking, training, description, sector, city, fantasy_name, cnpj, rating, total_ratings")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) {
        setLogoUrl(data.logo_url || null);
        setRating(data.rating ?? 5.0);
        setTotalRatings(data.total_ratings ?? 0);
        setCompanyData({
          about: data.about || "",
          seeking: data.seeking ? data.seeking.split('\n').filter(s => s.trim()) : [],
          training: {
            name: "",
            fantasyName: "",
            foundingDate: "",
            location: "",
            founder: ""
          },
          testimonials: [],
          jobs: [],
          description: data.description || "",
          sector: data.sector || "",
          city: data.city || "",
          fantasy_name: data.fantasy_name || "",
          cnpj: data.cnpj || ""
        });
      }
    };
    
    loadProfile();
  }, [user?.id]);

  const calculateCompletion = () => {
    const fields = [
      logoUrl,
      companyData.about,
      companyData.seeking.length > 0 ? "has_seeking" : null,
      companyData.description,
      companyData.sector,
      companyData.city,
      companyData.fantasy_name,
      companyData.cnpj
    ];
    
    const filledFields = fields.filter(field => field && field.toString().trim() !== "").length;
    const totalFields = fields.length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
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
            className="absolute left-0 top-0 h-full w-64 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Section */}
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {companyName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{companyName}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/create-job");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-jobs");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <List size={24} />
                <span className="text-lg">Minhas Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-profile");
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
                  navigate("/company-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-company");
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
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className={`rounded-3xl shadow-lg p-4 sm:p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            {/* Logo Section */}
            <div className={`flex justify-center ${completionPercentage < 100 ? 'mb-16' : 'mb-6'}`}>
              <div className="relative">
                {completionPercentage < 100 ? (
                  <>
                    <CircularProgress percentage={completionPercentage}>
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={`Logo de ${companyName}`}
                          className="w-24 h-24 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {companyName.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </CircularProgress>
                    <button 
                      onClick={() => navigate("/edit-company-profile")}
                      className={`absolute -bottom-2 -right-2 p-2 rounded-full shadow-md transition ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"} z-20`}
                    >
                      <Edit size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
                    </button>
                  </>
                ) : (
                  <>
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`Logo de ${companyName}`}
                        className="w-32 h-32 rounded-full object-cover shadow-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-4xl font-bold text-white">
                          {companyName.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <button 
                      onClick={() => navigate("/edit-company-profile")}
                      className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md transition ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"}`}
                    >
                      <Edit size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {completionPercentage < 100 && (
              <div className="text-center mb-6">
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Perfil {completionPercentage}% completo
                </p>
                <button
                  onClick={() => navigate("/edit-company-profile")}
                  className="mt-2 text-pink-500 hover:text-pink-600 text-sm font-medium"
                >
                  Completar perfil
                </button>
              </div>
            )}

            {/* Rating */}
            <div className="flex flex-col items-center gap-1 mb-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={24} 
                    className={star <= Math.floor(rating) ? "fill-green-400 text-green-400" : "fill-gray-300 text-gray-300"}
                  />
                ))}
                <span className={`ml-2 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {rating.toFixed(1)}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className={`ml-1 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}>
                        <HelpCircle size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        A avaliação inicial é de 5.0 estrelas. Após a conclusão de cada projeto, candidatos ou empresas avaliam seu desempenho, atualizando sua pontuação geral.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {totalRatings > 0 && (
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {totalRatings} {totalRatings === 1 ? "avaliação" : "avaliações"}
                </span>
              )}
            </div>

            {/* Company Name */}
            <h1 className={`text-2xl font-semibold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Nome Empresa: {companyName}
            </h1>

            {/* Action Buttons and Expandable Sections */}
            <div className="space-y-3 max-w-2xl mx-auto px-2 sm:px-4">
              {/* Conheça a Empresa */}
              <div>
                <Button
                  onClick={() => toggleSection("about")}
                  className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <span>Conheça a Empresa</span>
                  {expandedSection === "about" ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
                    {companyData.about ? (
                      <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {companyData.about}
                      </p>
                    ) : (
                      <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Nenhuma informação adicionada ainda
                      </p>
                    )}
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
                  {expandedSection === "seeking" ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
                    {companyData.seeking.length > 0 ? (
                      <ul className={`list-disc pl-6 space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {companyData.seeking.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Nenhuma informação adicionada ainda
                      </p>
                    )}
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
                  {expandedSection === "testimonials" ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
                    {companyData.testimonials.length > 0 ? (
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
                    ) : (
                      <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Nenhum relato adicionado ainda
                      </p>
                    )}
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
                  {expandedSection === "training" ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
                    {(companyData.training.name || companyData.training.fantasyName || 
                      companyData.training.foundingDate || companyData.training.location || 
                      companyData.training.founder) ? (
                      <div className={`space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {companyData.training.name && <p>{companyData.training.name}</p>}
                        {companyData.training.fantasyName && <p>{companyData.training.fantasyName}</p>}
                        {companyData.training.foundingDate && <p>{companyData.training.foundingDate}</p>}
                        {companyData.training.location && <p>{companyData.training.location}</p>}
                        {companyData.training.founder && <p>{companyData.training.founder}</p>}
                      </div>
                    ) : (
                      <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Nenhuma informação adicionada ainda
                      </p>
                    )}
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
                  {expandedSection === "jobs" ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
                    {companyData.jobs.length > 0 ? (
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
                    ) : (
                      <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Nenhuma vaga disponível
                      </p>
                    )}
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
