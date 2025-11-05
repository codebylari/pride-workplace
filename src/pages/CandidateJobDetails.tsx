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
      
      // Buscar dados da vaga
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (jobError) throw jobError;

      // Buscar dados da empresa
      const { data: companyData, error: companyError } = await supabase
        .from("company_profiles")
        .select("fantasy_name, logo_url, city, state")
        .eq("user_id", jobData.company_id)
        .single();

      if (companyError) throw companyError;

      setJob({
        ...jobData,
        companyName: companyData?.fantasy_name || "Empresa",
        companyLogo: companyData?.logo_url || "🏢",
        companyCity: companyData?.city,
        companyState: companyData?.state
      });
    } catch (error: any) {
      console.error("Error fetching job details:", error);
      toast({
        title: "Erro ao carregar vaga",
        description: "Não foi possível carregar os detalhes da vaga.",
        variant: "destructive",
      });
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
              {job.companyLogo && job.companyLogo.startsWith('http') ? (
                <img 
                  src={job.companyLogo} 
                  alt={job.companyName}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center text-6xl shadow-lg">
                  {job.companyLogo}
                </div>
              )}
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {job.companyName}
                </h1>
              <Button
                onClick={() => navigate(`/company-public-profile/${job.company_id}`)}
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

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-pink-500" />
            <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {job.location}
              {job.companyCity && job.companyState && ` · ${job.companyCity}, ${job.companyState}`}
            </span>
          </div>

          {/* Job Title and Type */}
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            {job.job_type} – {job.title}
          </h2>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1">
              {job.job_type}
            </Badge>
            {job.location && (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1">
                {job.location}
              </Badge>
            )}
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {job.salary && (
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-pink-500" />
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  R$ {job.salary}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Briefcase size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {job.job_type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Publicado em {new Date(job.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Home size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {job.location}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className={`mb-8 p-6 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Descrição da vaga
            </h3>
            <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {job.description}
            </p>
          </div>

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
