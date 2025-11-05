import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Bell, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export default function CompanyPublicProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchCompanyData();
      fetchTestimonials();
      fetchCompanyJobs();
    }
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCompanyData(data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados da empresa:", error);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCompanyJobs(data || []);
    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("company_id", id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar dados dos candidatos
      const testimonialsWithCandidates = await Promise.all(
        (data || []).map(async (testimonial) => {
          const { data: candidateData } = await supabase
            .from("profiles")
            .select("full_name, photo_url")
            .eq("id", testimonial.candidate_id)
            .single();

          return {
            ...testimonial,
            candidate: candidateData || { full_name: "Candidato", photo_url: null },
          };
        })
      );

      setTestimonials(testimonialsWithCandidates);
    } catch (error) {
      console.error("Erro ao carregar depoimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading || !companyData) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-center`}>
        <p className={darkMode ? "text-white" : "text-gray-800"}>Carregando...</p>
      </div>
    );
  }

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

      {/* Sidebar do Candidato */}
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className={`rounded-3xl shadow-lg p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            {/* Logo Section - Visão pública sem edição */}
            <div className="flex justify-center mb-6">
              {companyData.logo_url ? (
                <img
                  src={companyData.logo_url}
                  alt={`Logo de ${companyData.fantasy_name}`}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {companyData.fantasy_name?.substring(0, 2).toUpperCase() || "EM"}
                  </span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = companyData.rating || 5.0;
                const isFullStar = star <= Math.floor(rating);
                const isHalfStar = star === Math.ceil(rating) && rating % 1 !== 0;
                
                if (isFullStar) {
                  return <Star key={star} size={24} className="fill-green-500 text-green-500" />;
                } else if (isHalfStar) {
                  return (
                    <div key={star} className="relative">
                      <Star size={24} className="text-green-500" />
                      <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star size={24} className="fill-green-500 text-green-500" />
                      </div>
                    </div>
                  );
                } else {
                  return <Star key={star} size={24} className="text-gray-300" />;
                }
              })}
              <span className={`ml-2 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {companyData.rating || 5.0}
              </span>
            </div>

            {/* Company Name */}
            <h1 className={`text-2xl font-semibold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {companyData.fantasy_name}
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
                      {companyData.about || companyData.description || "Informações não disponíveis"}
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
                    <div className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {companyData.seeking ? (
                        <ul className="list-disc pl-6 space-y-2">
                          {(typeof companyData.seeking === 'string' 
                            ? companyData.seeking.split('\n') 
                            : companyData.seeking
                          ).map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>Informações não disponíveis</p>
                      )}
                    </div>
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
                    {loading ? (
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Carregando depoimentos...</p>
                    ) : testimonials.length === 0 ? (
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Nenhum depoimento ainda.</p>
                    ) : (
                      <div className="space-y-4">
                        {testimonials.map((testimonial) => (
                          <div
                            key={testimonial.id}
                            className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                          >
                            <div className="flex items-start gap-3 mb-2">
                              {testimonial.candidate?.photo_url ? (
                                <img
                                  src={testimonial.candidate.photo_url}
                                  alt={testimonial.candidate.full_name}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0 text-white font-bold">
                                  {testimonial.candidate?.full_name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1">
                                <div>
                                  <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                                    {testimonial.candidate?.full_name}
                                  </p>
                                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {testimonial.job_title}
                                  </p>
                                </div>
                                <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  {testimonial.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                      Informações da Empresa
                    </h3>
                    <div className={`space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <p><strong>CNPJ:</strong> {companyData.cnpj}</p>
                      <p><strong>Nome Fantasia:</strong> {companyData.fantasy_name}</p>
                      {companyData.city && companyData.state && (
                        <p><strong>Localização:</strong> {companyData.city}, {companyData.state}</p>
                      )}
                      {companyData.sector && (
                        <p><strong>Setor:</strong> {companyData.sector}</p>
                      )}
                      {companyData.training && (
                        <p><strong>Formação:</strong> {companyData.training}</p>
                      )}
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
                    {companyJobs.length === 0 ? (
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        Nenhuma vaga disponível no momento.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {companyJobs.map((job) => (
                          <div
                            key={job.id}
                            className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                          >
                            <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                              {job.title}
                            </h4>
                            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {job.job_type} · {job.location}
                            </p>
                            <div className="flex items-center justify-between">
                              {job.salary && (
                                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  R$ {job.salary}
                                </span>
                              )}
                              <Button
                                onClick={() => navigate(`/job/${job.id}`)}
                                variant="link"
                                className="text-blue-600 hover:text-blue-700 p-0 h-auto ml-auto"
                              >
                                Ver detalhes →
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
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
