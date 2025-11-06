import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Mail, ArrowLeft, Star, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CompanyViewCandidateProfile() {
  const { id: candidateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (candidateId) {
      fetchCandidateProfile();
    }
  }, [candidateId]);

  const fetchCandidateProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", candidateId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error("Perfil não encontrado");
      }

      // Get contact info using the secure function
      const { data: contactData, error: contactError } = await supabase
        .rpc("get_candidate_contact_info", { _candidate_id: candidateId });

      if (contactError) {
        console.error("Error fetching contact info:", contactError);
      }
      
      setProfile({
        ...data,
        email: contactData?.[0]?.email,
        linkedin_url: contactData?.[0]?.linkedin_url || data.linkedin_url
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestContact = () => {
    setShowContactDialog(true);
  };

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
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : profile ? (
          <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            {/* Profile Header Background */}
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>

            {/* Profile Content */}
            <div className="relative px-4 sm:px-8 pb-6 sm:pb-8">
              {/* Profile Photo */}
              <div className="relative -mt-20 mb-6 flex flex-col items-center">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className={`w-32 h-32 rounded-full object-cover border-4 shadow-xl ${darkMode ? "border-gray-700" : "border-white"}`}
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white border-4 shadow-xl ${darkMode ? "border-gray-700" : "border-white"}`}>
                    {profile.full_name?.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex flex-col items-center gap-1 mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={24} 
                      fill={i < Math.floor(profile.rating || 5) ? "#22c55e" : "none"}
                      className={i < Math.floor(profile.rating || 5) ? "text-green-500" : "text-green-500"}
                    />
                  ))}
                  <span className={`ml-2 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {(profile.rating || 5.0).toFixed(1)}
                  </span>
                </div>
                {profile.total_ratings > 0 && (
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {profile.total_ratings} {profile.total_ratings === 1 ? "avaliação" : "avaliações"}
                  </span>
                )}
              </div>

              {/* Name and Location */}
              <div className="text-center mb-4 space-y-1">
                <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {profile.full_name}
                </h1>
                {profile.gender && (
                  <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Gênero: {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                  </p>
                )}
                {(profile.city || profile.state) && (
                  <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Localização: {profile.city}{profile.city && profile.state ? ", " : ""}{profile.state}
                  </p>
                )}
              </div>

              {/* LinkedIn */}
              {profile.linkedin_url && (
                <div className="text-center mb-6">
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      darkMode 
                        ? "bg-gray-600 hover:bg-gray-500 text-white" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    <Mail size={20} className="text-blue-600" />
                    <span className="font-medium">Ver LinkedIn</span>
                  </a>
                </div>
              )}

              {/* Contact Button */}
              <div className="text-center mb-8">
                <Button
                  onClick={handleRequestContact}
                  className="px-8 py-6 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-full"
                >
                  <Mail size={20} className="mr-2" />
                  Solicitar Contato
                </Button>
              </div>

              {/* Expandable Sections */}
              <div className="space-y-3">
                {/* About Me */}
                {profile.about_me && (
                  <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}>
                    <button
                      onClick={() => toggleSection("sobre-mim")}
                      className={`w-full px-6 py-4 flex justify-between items-center transition ${
                        darkMode ? "hover:bg-gray-500" : "hover:bg-gray-100"
                      }`}
                    >
                      <span className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Sobre Mim
                      </span>
                      {expandedSection === "sobre-mim" ? (
                        <ChevronUp className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      ) : (
                        <ChevronDown className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      )}
                    </button>
                    {expandedSection === "sobre-mim" && (
                      <div className={`px-6 py-4 border-t ${darkMode ? "border-gray-500" : "border-gray-200"}`}>
                        <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {profile.about_me}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Experience */}
                {profile.experience && (
                  <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}>
                    <button
                      onClick={() => toggleSection("experiencia")}
                      className={`w-full px-6 py-4 flex justify-between items-center transition ${
                        darkMode ? "hover:bg-gray-500" : "hover:bg-gray-100"
                      }`}
                    >
                      <span className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Experiência
                      </span>
                      {expandedSection === "experiencia" ? (
                        <ChevronUp className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      ) : (
                        <ChevronDown className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      )}
                    </button>
                    {expandedSection === "experiencia" && (
                      <div className={`px-6 py-4 border-t ${darkMode ? "border-gray-500" : "border-gray-200"}`}>
                        <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {profile.experience}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Education */}
                {profile.education && (
                  <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}>
                    <button
                      onClick={() => toggleSection("formacao")}
                      className={`w-full px-6 py-4 flex justify-between items-center transition ${
                        darkMode ? "hover:bg-gray-500" : "hover:bg-gray-100"
                      }`}
                    >
                      <span className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Formação
                      </span>
                      {expandedSection === "formacao" ? (
                        <ChevronUp className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      ) : (
                        <ChevronDown className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      )}
                    </button>
                    {expandedSection === "formacao" && (
                      <div className={`px-6 py-4 border-t ${darkMode ? "border-gray-500" : "border-gray-200"}`}>
                        <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {profile.education}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Journey */}
                {profile.journey && (
                  <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}>
                    <button
                      onClick={() => toggleSection("jornada")}
                      className={`w-full px-6 py-4 flex justify-between items-center transition ${
                        darkMode ? "hover:bg-gray-500" : "hover:bg-gray-100"
                      }`}
                    >
                      <span className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Minha Jornada
                      </span>
                      {expandedSection === "jornada" ? (
                        <ChevronUp className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      ) : (
                        <ChevronDown className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      )}
                    </button>
                    {expandedSection === "jornada" && (
                      <div className={`px-6 py-4 border-t ${darkMode ? "border-gray-500" : "border-gray-200"}`}>
                        <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {profile.journey}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Resume */}
                {profile.resume_url && (
                  <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}>
                    <button
                      onClick={() => toggleSection("curriculo")}
                      className={`w-full px-6 py-4 flex justify-between items-center transition ${
                        darkMode ? "hover:bg-gray-500" : "hover:bg-gray-100"
                      }`}
                    >
                      <span className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Currículo
                      </span>
                      {expandedSection === "curriculo" ? (
                        <ChevronUp className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      ) : (
                        <ChevronDown className={darkMode ? "text-gray-300" : "text-gray-600"} />
                      )}
                    </button>
                    {expandedSection === "curriculo" && (
                      <div className={`px-6 py-4 border-t ${darkMode ? "border-gray-500" : "border-gray-200"}`}>
                        <a 
                          href={profile.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FileText size={20} />
                          Baixar Currículo
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações de Contato</DialogTitle>
            <DialogDescription>
              Aqui estão as informações de contato do candidato:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {profile?.email && (
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{profile.email}</p>
                </div>
              </div>
            )}
            {profile?.linkedin_url && (
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">LinkedIn</p>
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Ver perfil no LinkedIn
                  </a>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <ChatBot />
    </div>
  );
}
