import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Star, Edit, ChevronUp, ChevronDown, HelpCircle } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
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
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [rating, setRating] = useState(5.0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [companyData, setCompanyData] = useState({
    about: "",
    seeking: "",
    training: "",
    testimonials: [] as Array<{
      name: string;
      role: string;
      icon: string;
      emoji?: string;
      text: string;
    }>,
    jobs: [] as Array<{
      id: string;
      title: string;
      type: string;
      applicants: number;
    }>,
    description: "",
    sector: "",
    city: "",
    state: "",
    fantasy_name: "",
    cnpj: ""
  });

  const companyName = user?.user_metadata?.company_name || user?.user_metadata?.fantasy_name || "Empresa";

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from("company_profiles")
        .select("logo_url, about, seeking, training, description, sector, city, state, fantasy_name, cnpj, rating, total_ratings")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) {
        setLogoUrl(data.logo_url || null);
        setRating(data.rating ?? 5.0);
        setTotalRatings(data.total_ratings ?? 0);
        setCompanyData({
          about: data.about || "",
          seeking: data.seeking || "",
          training: data.training || "",
          testimonials: [],
          jobs: [],
          description: data.description || "",
          sector: data.sector || "",
          city: data.city || "",
          state: data.state || "",
          fantasy_name: data.fantasy_name || "",
          cnpj: data.cnpj || ""
        });
      }
    };
    
    loadProfile();
  }, [user?.id]);

  useEffect(() => {
    const loadJobs = async () => {
      if (!user?.id) return;
      
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("id, title, job_type, location")
        .eq("company_id", user.id);
      
      if (jobsData) {
        const jobsWithApplicants = await Promise.all(
          jobsData.map(async (job) => {
            const { count } = await supabase
              .from("applications")
              .select("*", { count: "exact", head: true })
              .eq("job_id", job.id);
            
            return {
              id: job.id,
              title: job.title,
              type: job.job_type,
              applicants: count || 0
            };
          })
        );
        
        setCompanyData(prev => ({
          ...prev,
          jobs: jobsWithApplicants
        }));
      }
    };
    
    loadJobs();
  }, [user?.id]);

  useEffect(() => {
    const loadTestimonials = async () => {
      if (!user?.id) return;
      
      const { data: testimonialsData } = await supabase
        .from("testimonials")
        .select("id, candidate_id, comment, job_title")
        .eq("company_id", user.id)
        .eq("status", "approved");
      
      if (testimonialsData && testimonialsData.length > 0) {
        const emojis = ['❤️', '⭐', '🌈', '💜', '🌸', '✨', '🎯', '💎'];
        const testimonialsWithCandidates = await Promise.all(
          testimonialsData.map(async (testimonial, index) => {
            const { data: candidate } = await supabase
              .from("profiles")
              .select("full_name, photo_url")
              .eq("id", testimonial.candidate_id)
              .single();
            
            return {
              name: candidate?.full_name || "Candidato",
              role: testimonial.job_title,
              icon: candidate?.photo_url || "👤",
              emoji: emojis[index % emojis.length],
              text: testimonial.comment
            };
          })
        );
        
        setCompanyData(prev => ({
          ...prev,
          testimonials: testimonialsWithCandidates
        }));
      }
    };
    
    loadTestimonials();
  }, [user?.id]);

  const calculateCompletion = () => {
    const fields = [
      logoUrl,
      companyData.about,
      companyData.seeking,
      companyData.sector,
      companyData.city,
      companyData.state
    ];
    
    const filledFields = fields.filter(field => field && field.toString().trim() !== "").length;
    const totalFields = fields.length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

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

            {/* Company Info */}
            <div className="text-center mb-6 space-y-2">
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {companyData.fantasy_name || companyName}
              </h1>
              
              {/* CNPJ */}
              {companyData.cnpj && (
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  CNPJ: {companyData.cnpj}
                </p>
              )}
              
              {/* Sector */}
              {companyData.sector && (
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Setor: {companyData.sector}
                </p>
              )}
              
              {/* Location */}
              {(companyData.city || companyData.state) && (
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Localização: {companyData.city}{companyData.city && companyData.state ? ", " : ""}{companyData.state}
                </p>
              )}
            </div>

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
                    {companyData.seeking ? (
                      <p className={`leading-relaxed whitespace-pre-line ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {companyData.seeking}
                      </p>
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
                            className="p-4 rounded-xl bg-white shadow-md border border-gray-100"
                          >
                            <div className="flex items-start gap-3">
                              {testimonial.icon.startsWith('http') ? (
                                <img
                                  src={testimonial.icon}
                                  alt={testimonial.name}
                                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center flex-shrink-0 text-2xl">
                                  {testimonial.icon}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {testimonial.role}
                                    </p>
                                  </div>
                                  <span className="text-2xl">{testimonial.emoji || '❤️'}</span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 mt-2">
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

              {/* Formação e Treinamentos */}
              <div>
                <Button
                  onClick={() => toggleSection("training")}
                  className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <span>Formação e Treinamentos</span>
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
                      Formação e Treinamentos Oferecidos
                    </h3>
                    {companyData.training ? (
                      <p className={`leading-relaxed whitespace-pre-line ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {companyData.training}
                      </p>
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
                                onClick={() => navigate(`/company-job-details/${job.id}`)}
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
