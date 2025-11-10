import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Star, Edit2, ChevronDown, ChevronUp, Linkedin, HelpCircle, FileText } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Button } from "@/components/ui/button";
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

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Get user data
  const [userName, setUserName] = useState("Usuário");
  const [fullName, setFullName] = useState("Usuário");
  const [rating, setRating] = useState(5.0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string>("");
  const [userLinkedin, setUserLinkedin] = useState<string>("");
  const [userState, setUserState] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");
  const [profileData, setProfileData] = useState<{
    about_me?: string;
    experience?: string;
    education?: string;
    journey?: string;
    resume_url?: string;
    is_pcd?: boolean;
    pcd_type?: string;
    is_lgbt?: boolean;
    specialization_areas?: string[];
    work_area?: string;
    experience_level?: string;
    opportunity_type?: string[];
    github_level?: string;
    remote_preference?: string;
  }>({});

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("photo_url, full_name, social_name, gender, linkedin_url, about_me, experience, education, journey, resume_url, rating, total_ratings, state, city, is_pcd, pcd_type, is_lgbt, specialization_areas, work_area, experience_level, opportunity_type, github_level, remote_preference")
        .eq("id", user.id)
        .maybeSingle();
      
      // Prioriza nome social quando disponível
      const nameToUse = data?.social_name || data?.full_name || "Usuário";
      setFullName(nameToUse);
      setUserName(nameToUse.split(" ")[0]);
      
      setPhotoUrl(data?.photo_url ?? null);
      setUserGender(data?.gender ?? "");
      setUserLinkedin(data?.linkedin_url ?? "");
      setUserState(data?.state ?? "");
      setUserCity(data?.city ?? "");
      setRating(data?.rating ?? 5.0);
      setTotalRatings(data?.total_ratings ?? 0);
      
      // Load actual data from database
      setProfileData({
        about_me: data?.about_me,
        experience: data?.experience,
        education: data?.education,
        journey: data?.journey,
        resume_url: data?.resume_url,
        is_pcd: data?.is_pcd,
        pcd_type: data?.pcd_type,
        is_lgbt: data?.is_lgbt,
        specialization_areas: data?.specialization_areas,
        work_area: data?.work_area,
        experience_level: data?.experience_level,
        opportunity_type: data?.opportunity_type,
        github_level: data?.github_level,
        remote_preference: data?.remote_preference,
      });
    };
    load();
  }, [user?.id]);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      photoUrl, // Foto de perfil
      userGender, // Gênero
      userLinkedin, // LinkedIn
      userState, // Estado
      userCity, // Cidade
      profileData.about_me, // Sobre Mim
      profileData.experience, // Experiência
      profileData.education, // Formação
      profileData.journey, // Minha Jornada
      profileData.resume_url, // Currículo
    ];
    const filledFields = fields.filter(field => field !== undefined && field !== null && field !== "").length;
    const percentage = (filledFields / fields.length) * 100;
    return Math.round(percentage);
  };

  const completionPercentage = calculateCompletion();
  const showProgress = completionPercentage < 100;

  // Render stars with half-star support
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={24} fill="#22c55e" className="text-green-500" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={24} className="text-green-500" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={24} fill="#22c55e" className="text-green-500" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={24} className="text-green-500" />
      );
    }

    return stars;
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = {
    "sobre-mim": {
      title: "Sobre Mim",
      content: profileData.about_me || ""
    },
    "experiencia": {
      title: "Experiência",
      content: profileData.experience || ""
    },
    "formacao": {
      title: "Formação",
      content: profileData.education || ""
    },
    "minha-jornada": {
      title: "Minha Jornada",
      content: profileData.journey || ""
    },
    "curriculo": {
      title: "Currículo",
      content: profileData.resume_url || ""
    }
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
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          {/* Profile Header Background */}
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>

          {/* Profile Content */}
          <div className="relative px-4 sm:px-8 pb-6 sm:pb-8">
            {/* Profile Photo with Progress */}
            <div className="relative -mt-20 mb-6 flex flex-col items-center">
              <div className="relative">
                {showProgress ? (
                  <CircularProgress percentage={completionPercentage} size={160} strokeWidth={8}>
                    <div className="relative">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={`Foto de ${fullName}`}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-xl">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <button 
                        onClick={() => navigate("/edit-candidate-profile")}
                        className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md transition ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"}`}
                      >
                        <Edit2 size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      </button>
                    </div>
                  </CircularProgress>
                ) : (
                  <div className="relative">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`Foto de ${fullName}`}
                        className={`w-32 h-32 rounded-full object-cover border-4 shadow-xl ${darkMode ? "border-gray-700" : "border-white"}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white border-4 shadow-xl ${darkMode ? "border-gray-700" : "border-white"}`}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <button 
                      onClick={() => navigate("/edit-candidate-profile")}
                      className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md transition ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"}`}
                    >
                      <Edit2 size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Completion Text */}
              {showProgress && (
                <p className={`mt-3 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Perfil {completionPercentage}% completo
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center gap-1 mb-4">
              <div className="flex items-center gap-2">
                {renderStars(rating)}
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

            {/* Name and Gender */}
            <div className="text-center mb-4 space-y-1">
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {fullName}
              </h1>
              {userGender && (
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Gênero: {userGender.charAt(0).toUpperCase() + userGender.slice(1)}
                </p>
              )}
              {(userCity || userState) && (
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Localização: {userCity}{userCity && userState ? ", " : ""}{userState}
                </p>
              )}
              
              {/* Inclusão e Diversidade */}
              {(profileData.is_pcd || profileData.is_lgbt) && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {profileData.is_pcd && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                      PcD{profileData.pcd_type ? `: ${profileData.pcd_type}` : ""}
                    </span>
                  )}
                  {profileData.is_lgbt && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800"}`}>
                      LGBTQIA+
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* LinkedIn */}
            {userLinkedin && (
              <div className="text-center mb-6">
                <a
                  href={userLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? "bg-gray-600 hover:bg-gray-500 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <Linkedin size={20} className="text-blue-600" />
                  <span className="font-medium">Ver LinkedIn</span>
                </a>
              </div>
            )}

            {/* Qualificações Profissionais */}
            {(profileData.specialization_areas || profileData.work_area || profileData.experience_level || 
              profileData.opportunity_type || profileData.github_level || profileData.remote_preference) && (
              <div className={`mb-6 p-6 rounded-xl ${darkMode ? "bg-gray-600" : "bg-gradient-to-br from-purple-50 to-pink-50"}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Qualificações Profissionais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.experience_level && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Nível de Experiência
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}>
                        {profileData.experience_level}
                      </span>
                    </div>
                  )}
                  
                  {profileData.work_area && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Área de Atuação
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}>
                        {profileData.work_area}
                      </span>
                    </div>
                  )}
                  
                  {profileData.github_level && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Conhecimento em GitHub
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}>
                        {profileData.github_level}
                      </span>
                    </div>
                  )}
                  
                  {profileData.remote_preference && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Trabalho Remoto
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}>
                        {profileData.remote_preference === "sim" ? "Sim, busco projetos remotos" : 
                         profileData.remote_preference === "talvez" ? 
                           userGender === "feminino" ? "Talvez, estou aberta" :
                           userGender === "masculino" ? "Talvez, estou aberto" :
                           "Talvez, estou aberto(a)" :
                         "Não busco projetos remotos"}
                      </span>
                    </div>
                  )}
                  
                  {profileData.specialization_areas && profileData.specialization_areas.length > 0 && (
                    <div className="md:col-span-2">
                      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Áreas de Especialização
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.specialization_areas.map((area, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profileData.opportunity_type && profileData.opportunity_type.length > 0 && (
                    <div className="md:col-span-2">
                      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Tipos de Oportunidade
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.opportunity_type.map((type, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 max-w-2xl mx-auto px-2 sm:px-4">
              {Object.entries(sections).map(([key, section]) => (
                <div key={key} className="space-y-2">
                  <Button
                    onClick={() => toggleSection(key)}
                    className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-4 sm:py-6 rounded-full text-base sm:text-lg font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{section.title}</span>
                    {expandedSection === key ? <ChevronUp size={20} className="sm:w-6 sm:h-6" /> : <ChevronDown size={20} className="sm:w-6 sm:h-6" />}
                  </Button>
                  
                  {expandedSection === key && (
                    <div className={`relative rounded-2xl p-6 shadow-lg ${darkMode ? "bg-gray-600" : "bg-white"} border border-gray-200`}>
                      <button
                        onClick={() => setExpandedSection(null)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none"
                      >
                        ×
                      </button>
                      <h3 className={`text-xl font-bold mb-4 pr-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {section.title}
                      </h3>
                      {key === "curriculo" && section.content.trim() ? (
                        <div className="text-center">
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = section.content;
                              link.download = `curriculo-${fullName.replace(/\s+/g, '-').toLowerCase()}.html`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          >
                            <FileText size={20} />
                            <span>Baixar Currículo</span>
                          </button>
                        </div>
                      ) : section.content.trim() ? (
                        <div className={`whitespace-pre-line text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {section.content}
                        </div>
                      ) : (
                        <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Nenhuma informação adicionada ainda
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
