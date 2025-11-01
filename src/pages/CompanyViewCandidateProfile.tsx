import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Mail, Phone, MapPin, Briefcase, GraduationCap, Star, ArrowLeft } from "lucide-react";
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
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContactDialog, setShowContactDialog] = useState(false);

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
        .single();

      if (error) throw error;

      // Get user email from auth metadata
      const { data: userData } = await supabase.auth.admin.getUserById(candidateId);
      
      setProfile({
        ...data,
        email: userData?.user?.email
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
    // Aqui você pode adicionar lógica para enviar notificação ao candidato
    // ou atualizar status da candidatura para "contact_requested"
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
      <main className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
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
          <div className="space-y-6">
            {/* Profile Header */}
            <div className={`rounded-2xl shadow-sm p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Profile Picture */}
                <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {profile.photo_url ? (
                    <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {profile.full_name?.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className={`text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {profile.full_name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={24} 
                        className={i < Math.floor(profile.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {(profile.rating || 5.0).toFixed(1)}
                    </span>
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      ({profile.total_ratings || 0} avaliações)
                    </span>
                  </div>

                  {/* Location */}
                  {(profile.city || profile.state) && (
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className={darkMode ? "text-gray-400" : "text-gray-600"} size={20} />
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        {profile.city}{profile.city && profile.state && ", "}{profile.state}
                      </span>
                    </div>
                  )}

                  {/* Contact Button */}
                  <Button
                    onClick={handleRequestContact}
                    className="px-8 py-6 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-full flex items-center gap-2"
                  >
                    <Mail size={20} />
                    Solicitar Contato
                  </Button>
                </div>
              </div>
            </div>

            {/* About Me */}
            {profile.about_me && (
              <div className={`rounded-2xl shadow-sm p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Sobre Mim
                </h2>
                <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {profile.about_me}
                </p>
              </div>
            )}

            {/* Experience */}
            {profile.experience && (
              <div className={`rounded-2xl shadow-sm p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className={darkMode ? "text-purple-400" : "text-purple-600"} size={28} />
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Experiência
                  </h2>
                </div>
                <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {profile.experience}
                </p>
              </div>
            )}

            {/* Education */}
            {profile.education && (
              <div className={`rounded-2xl shadow-sm p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className={darkMode ? "text-blue-400" : "text-blue-600"} size={28} />
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Formação Acadêmica
                  </h2>
                </div>
                <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {profile.education}
                </p>
              </div>
            )}

            {/* Journey */}
            {profile.journey && (
              <div className={`rounded-2xl shadow-sm p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Minha Jornada
                </h2>
                <p className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {profile.journey}
                </p>
              </div>
            )}
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
                <Phone className="text-gray-500" size={20} />
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
