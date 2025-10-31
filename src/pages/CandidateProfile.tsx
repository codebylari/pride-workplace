import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Star, Edit2, Briefcase, User, Settings, Headset, Info, FileText, LogOut, ChevronDown, ChevronUp, ClipboardList, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { CircularProgress } from "@/components/CircularProgress";

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Get user data
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";
  const rating = 4.5;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string>("");
  const [userLinkedin, setUserLinkedin] = useState<string>("");
  const [profileData, setProfileData] = useState<{
    about_me?: string;
    experience?: string;
    education?: string;
    journey?: string;
    resume_url?: string;
  }>({});

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("photo_url, full_name, gender, linkedin_url")
        .eq("id", user.id)
        .maybeSingle();
      
      setPhotoUrl(data?.photo_url ?? null);
      setUserGender(data?.gender ?? "");
      setUserLinkedin(data?.linkedin_url ?? "");
      
      // Mock data for now - replace with actual fields when they exist in DB
      setProfileData({
        about_me: sections["sobre-mim"].content.trim() ? sections["sobre-mim"].content : undefined,
        experience: sections["experiencia"].content.trim() ? sections["experiencia"].content : undefined,
        education: sections["formacao"].content.trim() ? sections["formacao"].content : undefined,
        journey: sections["minha-jornada"].content.trim() ? sections["minha-jornada"].content : undefined,
        resume_url: sections["curriculo"].content.trim() ? "has_resume" : undefined,
      });
    };
    load();
  }, [user?.id]);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      profileData.about_me,
      profileData.experience,
      profileData.education,
      profileData.journey,
      profileData.resume_url,
    ];
    const filledFields = fields.filter(field => field !== undefined && field !== "").length;
    return (filledFields / 5) * 100;
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
  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = {
    "sobre-mim": {
      title: "Sobre Mim",
      content: ""
    },
    "experiencia": {
      title: "Experiência",
      content: ""
    },
    "formacao": {
      title: "Formação",
      content: ""
    },
    "minha-jornada": {
      title: "Minha Jornada",
      content: ""
    },
    "curriculo": {
      title: "Currículo",
      content: ""
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
            className="absolute left-0 top-0 h-full w-80 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Section */}
            <div className="p-6 flex items-center gap-4 border-b border-white/20">
              <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30">
                {photoUrl ? (
                  <img src={photoUrl} alt={`Foto de ${fullName}`} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-white/80">candidato (a)</p>
              </div>
            </div>

            {/* Menu Items */}
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
                  navigate("/candidate-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-about");
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          {/* Profile Header Background */}
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Photo with Progress */}
            <div className="relative -mt-20 mb-6 flex justify-center">
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
                        className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition shadow-lg"
                      >
                        <Edit2 size={18} />
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
                      className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition shadow-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {renderStars(rating)}
              <span className={`ml-2 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{rating}</span>
            </div>

            {/* Name and Gender */}
            <div className="text-center mb-4 space-y-1">
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Nome: {fullName}
              </h1>
              {userGender && (
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Gênero: {userGender.charAt(0).toUpperCase() + userGender.slice(1)}
                </p>
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

            {/* Action Buttons */}
            <div className="space-y-3 max-w-2xl mx-auto px-4">
              {Object.entries(sections).map(([key, section]) => (
                <div key={key} className="space-y-2">
                  <Button
                    onClick={() => toggleSection(key)}
                    className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{section.title}</span>
                    {expandedSection === key ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
                      {section.content.trim() ? (
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
