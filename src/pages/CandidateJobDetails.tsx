import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Star, MapPin, DollarSign, Briefcase, Calendar, Home } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching job with ID:", id);
      
      // Buscar dados da vaga
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      console.log("Job data:", jobData);
      console.log("Job error:", jobError);

      if (jobError) {
        console.error("Error fetching job:", jobError);
        throw jobError;
      }

      if (!jobData) {
        console.log("No job found with ID:", id);
        setJob(null);
        return;
      }

      // Buscar dados da empresa
      const { data: companyData, error: companyError } = await supabase
        .from("company_profiles")
        .select("user_id, fantasy_name, logo_url, city, state, about, rating")
        .eq("user_id", jobData.company_id)
        .maybeSingle();

      console.log("Company data:", companyData);
      console.log("Company error:", companyError);
      console.log("Job company_id:", jobData.company_id);

      if (companyError) {
        console.error("Error fetching company:", companyError);
      }

      // Parse description to extract structured fields
      const lines = jobData.description.split("\n");
      let descriptionText = "";
      let area = "";
      let benefits = "";
      let experience = "";
      let period = "";
      
      lines.forEach((line: string) => {
        if (line.startsWith("Área: ")) {
          area = line.replace("Área: ", "").trim();
        } else if (line.startsWith("Benefícios: ")) {
          benefits = line.replace("Benefícios: ", "").trim();
        } else if (line.startsWith("Experiência: ")) {
          experience = line.replace("Experiência: ", "").trim();
        } else if (line.startsWith("Período: ")) {
          period = line.replace("Período: ", "").trim();
        } else if (!line.startsWith("Área: ") && !line.startsWith("Benefícios: ") && !line.startsWith("Experiência: ") && !line.startsWith("Período: ")) {
          if (line.trim()) {
            descriptionText += (descriptionText ? "\n" : "") + line;
          }
        }
      });

      setJob({
        ...jobData,
        company_id: jobData.company_id,
        companyName: companyData?.fantasy_name || "Empresa",
        companyLogo: companyData?.logo_url || null,
        companyCity: companyData?.city || null,
        companyState: companyData?.state || null,
        parsedDescription: descriptionText.trim(),
        parsedArea: area,
        parsedBenefits: benefits,
        parsedExperience: experience,
        parsedPeriod: period
      });
    } catch (error: any) {
      console.error("Error fetching job details:", error);
      toast({
        title: "Erro ao carregar vaga",
        description: error.message || "Não foi possível carregar os detalhes da vaga.",
        variant: "destructive",
      });
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-center`}>
        <p className={darkMode ? "text-white" : "text-gray-800"}>Carregando...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-center`}>
        <p className={darkMode ? "text-white" : "text-gray-800"}>Vaga não encontrada</p>
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

      {/* Sidebar */}
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`rounded-2xl shadow-lg p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          {/* Company Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={job.companyName}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                  onError={(e) => {
                    console.error("Error loading company logo:", job.companyLogo);
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center shadow-lg" style={{ display: job.companyLogo ? 'none' : 'flex' }}>
                <div className="text-4xl text-muted-foreground">🏢</div>
              </div>
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {job.companyName}
                </h1>
              <Button
                onClick={() => {
                  console.log("Navigating to company profile:", job.company_id);
                  navigate(`/company-public-profile/${job.company_id}`);
                }}
                className="bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 rounded-full px-6"
              >
                Ver perfil da Empresa
              </Button>
              </div>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2"
            >
              <Star
                size={32}
                fill={isFavorite ? "#fbbf24" : "none"}
                className={isFavorite ? "text-yellow-400" : "text-gray-400"}
              />
            </button>
          </div>

          {/* Job Title */}
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            {job.title}
          </h2>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Briefcase size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {job.job_type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {job.location}
              </span>
            </div>
            {(job.companyCity || job.companyState) && (
              <div className="flex items-center gap-2">
                <Home size={20} className="text-pink-500" />
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Sede: {job.companyCity}{job.companyCity && job.companyState ? ", " : ""}{job.companyState}
                </span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-pink-500" />
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  R$ {job.salary}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Publicado em {new Date(job.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className={`mb-6 p-6 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Descrição da vaga
            </h3>
            <p className={`leading-relaxed whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {job.parsedDescription || job.description}
            </p>
          </div>

          {/* Área */}
          {job.parsedArea && (
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Área
              </h3>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {job.parsedArea}
              </p>
            </div>
          )}

          {/* Benefícios */}
          {job.parsedBenefits && (
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Benefícios
              </h3>
              <p className={`leading-relaxed whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {job.parsedBenefits}
              </p>
            </div>
          )}

          {/* Experiência */}
          {job.parsedExperience && (
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Experiência Necessária
              </h3>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {job.parsedExperience}
              </p>
            </div>
          )}

          {/* Tipo de Contratação */}
          {job.parsedPeriod && (
            <div className={`mb-8 p-6 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Tipo de Contratação
              </h3>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {job.parsedPeriod}
              </p>
            </div>
          )}

          {/* Apply Button */}
          <Button
            onClick={() => navigate(`/job/${id}/apply`)}
            className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-semibold"
          >
            Candidatar-se a vaga
          </Button>
        </div>
      </main>
    </div>
  );
}
