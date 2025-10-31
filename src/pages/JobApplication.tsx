import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Bell, MapPin, Upload, FileText, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export default function JobApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResume, setCustomResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";
  const userEmail = user?.email || "email@exemplo.com";
  const userPhone = "(27) 99999-9999"; // Mock - will be from profile

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

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

  const handleSubmit = () => {
    if (!useProfileResume && !customResume) {
      toast({
        title: "Currículo obrigatório",
        description: "Por favor, selecione um currículo antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Candidatura enviada com sucesso!",
      description: "Sua candidatura foi enviada para a empresa. Boa sorte!",
    });

    setTimeout(() => {
      navigate("/candidate-dashboard");
    }, 2000);
  };

  // Mock data
  const job = {
    company: "Mercado Livre",
    logo: "🛒",
    location: "Remoto | Freelancer",
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

      {/* Sidebar - same as JobDetails */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
            className="absolute left-0 top-0 h-full w-80 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center gap-4 border-b border-white/20">
              <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-white/80">candidato (a)</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/20 mt-auto">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
              >
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`rounded-2xl shadow-lg p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          {/* Company Header */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center text-6xl shadow-lg">
              {job.logo}
            </div>
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                {job.company}
              </h1>
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-pink-500" />
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {job.location}
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
            className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-semibold"
          >
            Enviar Candidatura
          </Button>
        </div>
      </main>
    </div>
  );
}
