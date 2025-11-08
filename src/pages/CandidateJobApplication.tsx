import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, MapPin, Upload, FileText, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { supabase } from "@/integrations/supabase/client";

export default function CandidateJobApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResume, setCustomResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";
  const userEmail = user?.email || "email@exemplo.com";
  const userPhone = "(27) 99999-9999"; // Mock - will be from profile

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;
      
      try {
        // Buscar dados da vaga
        const { data: jobData, error: jobError } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (jobError) throw jobError;
        
        if (!jobData) {
          setJob(null);
          setLoading(false);
          return;
        }

        // Buscar dados da empresa
        const { data: companyData, error: companyError } = await supabase
          .from("company_profiles")
          .select("fantasy_name, logo_url, city, state")
          .eq("user_id", jobData.company_id)
          .maybeSingle();

        if (companyError) {
          console.error("Erro ao buscar empresa:", companyError);
        }

        setJob({
          ...jobData,
          company_profiles: companyData || { fantasy_name: "Empresa", logo_url: null, city: "", state: "" }
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          title: "Erro ao carregar vaga",
          description: "Não foi possível carregar os dados da vaga.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== "application/pdf") {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, envie apenas arquivos em formato PDF.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      
      setCustomResume(file);
      setUseProfileResume(false);
    }
  };

  const handleSubmit = async () => {
    if (!useProfileResume && !customResume) {
      toast({
        title: "Currículo obrigatório",
        description: "Por favor, selecione um currículo antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id || !id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado ou vaga não encontrada.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verificar se já existe uma candidatura para esta vaga
      const { data: existingApplication } = await supabase
        .from("applications")
        .select("id")
        .eq("candidate_id", user.id)
        .eq("job_id", id)
        .maybeSingle();

      if (existingApplication) {
        toast({
          title: "Candidatura já existente",
          description: "Você já se candidatou para esta vaga.",
          variant: "destructive",
        });
        return;
      }

      // Upload do currículo customizado se fornecido
      let resumeUrl = null;
      if (customResume) {
        const fileExt = customResume.name.split('.').pop();
        const fileName = `${user.id}/${id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, customResume);

        if (uploadError) {
          console.error("Erro ao fazer upload do currículo:", uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(fileName);
          resumeUrl = urlData.publicUrl;
        }
      }

      // Criar candidatura no banco
      const { error: applicationError } = await supabase
        .from("applications")
        .insert({
          candidate_id: user.id,
          job_id: id,
          status: "pending",
          contract_status: "pending"
        });

      if (applicationError) {
        console.error("Erro ao criar candidatura:", applicationError);
        throw applicationError;
      }

      toast({
        title: "Candidatura enviada com sucesso!",
        description: "Sua candidatura foi enviada para a empresa. Boa sorte!",
      });

      setTimeout(() => {
        navigate("/my-applications");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao enviar candidatura:", error);
      toast({
        title: "Erro ao enviar candidatura",
        description: error.message || "Ocorreu um erro ao processar sua candidatura.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Vaga não encontrada</p>
          <Button onClick={() => navigate("/candidate-dashboard")} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
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
          <div className="flex items-center gap-6 mb-6">
            {job.company_profiles?.logo_url ? (
              <img 
                src={job.company_profiles.logo_url} 
                alt={job.company_profiles.fantasy_name}
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {job.company_profiles?.fantasy_name?.charAt(0) || "E"}
              </div>
            )}
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                {job.company_profiles?.fantasy_name || "Empresa"}
              </h1>
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-pink-500" />
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {job.location || `${job.company_profiles?.city || ""}, ${job.company_profiles?.state || ""}`}
                </span>
              </div>
            </div>
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Candidatar-se à vaga
          </h2>

          {/* Resume Section */}
          <div className="mb-6">
            <label className={`block mb-3 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Currículo
            </label>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setUseProfileResume(true);
                  setCustomResume(null);
                }}
                variant={useProfileResume ? "default" : "outline"}
                className={`w-full justify-start gap-2 ${
                  useProfileResume 
                    ? "bg-gray-300 text-gray-800" 
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                <FileText size={20} />
                Usar currículo do perfil
              </Button>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2"
                >
                  <Upload size={20} />
                  Enviar outro arquivo
                </Button>
                {customResume && (
                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Arquivo selecionado: {customResume.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-6">
            <label className={`block mb-3 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Carta de apresentação
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              placeholder="Escreva uma breve apresentação sobre você e por que é o candidato ideal para esta vaga..."
              className={`w-full p-4 rounded-lg border resize-none ${
                darkMode 
                  ? "bg-gray-600 text-white border-gray-500" 
                  : "bg-gray-50 text-gray-800 border-gray-300"
              }`}
            />
          </div>

          {/* LinkedIn URL (Optional) */}
          <div className="mb-6">
            <label className={`block mb-3 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              LinkedIn (opcional)
            </label>
            <div className="relative">
              <span className={`${darkMode ? "text-gray-300" : "text-gray-500"} absolute left-3 top-1/2 -translate-y-1/2`} aria-hidden="true">
                <Linkedin size={20} />
              </span>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/seu-perfil"
                className={`w-full p-4 pl-12 rounded-lg border ${
                  darkMode 
                    ? "bg-gray-600 text-white border-gray-500 placeholder:text-gray-400" 
                    : "bg-gray-50 text-gray-800 border-gray-300 placeholder:text-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <label className={`block mb-3 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Contato:
            </label>
            <div className={`space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <p>{userEmail}</p>
              <p>{userPhone}</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-semibold"
          >
            Enviar Candidatura
          </Button>
        </div>
      </main>
    </div>
  );
}
