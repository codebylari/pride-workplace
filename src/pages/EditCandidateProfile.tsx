import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export default function EditCandidateProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [myJourney, setMyJourney] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
      setShowPhotoOptions(false);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    // Verifica se alguma alteração foi feita
    const hasChanges = 
      displayName.trim() !== "" || 
      aboutMe.trim() !== "" || 
      experience.trim() !== "" || 
      education.trim() !== "" || 
      myJourney.trim() !== "" || 
      profilePhoto !== null || 
      resume !== null;

    if (!hasChanges) {
      toast({
        title: "Nenhuma alteração foi modificada",
        description: "Preencha pelo menos um campo para atualizar seu perfil.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alterações salvas!",
      description: "Seu perfil foi atualizado com sucesso.",
    });
    navigate("/candidate-profile");
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

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <button 
                onClick={() => navigate("/candidate-dashboard")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Vagas</span>
              </button>
              
              <button 
                onClick={() => navigate("/candidate-profile")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Perfil</span>
              </button>
            </nav>

            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Edite seu perfil
        </h1>

        <div className={`rounded-2xl shadow-lg p-8 space-y-6 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          {/* Photo Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Nome exibido
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Sobre Mim
                </label>
                <textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  rows={4}
                  className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
                  placeholder="Conte um pouco sobre você"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {profilePhoto ? (
                  <img
                    src={URL.createObjectURL(profilePhoto)}
                    alt="Preview"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                className="bg-green-300 hover:bg-green-400 text-green-900 px-6 py-2 rounded-lg font-medium"
              >
                Alterar foto
              </Button>

              {showPhotoOptions && (
                <div className={`absolute mt-16 rounded-lg shadow-xl p-4 space-y-2 ${darkMode ? "bg-gray-600" : "bg-white"} border border-gray-200 z-10`}>
                  <button
                    onClick={() => setShowPhotoOptions(false)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                  
                  <h4 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Foto de Perfil
                  </h4>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 ${darkMode ? "text-white hover:bg-gray-500" : "text-gray-800"}`}
                  >
                    <Camera size={20} />
                    <span>Tirar foto</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 ${darkMode ? "text-white hover:bg-gray-500" : "text-gray-800"}`}
                  >
                    <Upload size={20} className="text-yellow-500" />
                    <span>Escolher da galeria</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Experiências
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={5}
              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
              placeholder="Descreva suas experiências profissionais"
            />
          </div>

          {/* Education */}
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Formações
            </label>
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              rows={5}
              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
              placeholder="Descreva sua formação acadêmica"
            />
          </div>

          {/* My Journey */}
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Minha Jornada
            </label>
            <textarea
              value={myJourney}
              onChange={(e) => setMyJourney(e.target.value)}
              rows={5}
              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
              placeholder="Conte sua trajetória na tecnologia"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Currículo
            </label>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => document.getElementById("resume-upload")?.click()}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              >
                <Upload size={20} />
                Enviar outro arquivo
              </Button>
              {resume && (
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {resume.name}
                </span>
              )}
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <Button
              onClick={handleSaveChanges}
              className="w-full bg-green-300 hover:bg-green-400 text-green-900 py-4 rounded-full text-lg font-semibold"
            >
              CONFIRMAR ALTERAÇÕES
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
