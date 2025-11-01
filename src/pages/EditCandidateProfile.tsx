import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Camera, Upload, X, Linkedin } from "lucide-react";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { PhotoEditor } from "@/components/PhotoEditor";
import { supabase } from "@/integrations/supabase/client";

export default function EditCandidateProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [myJourney, setMyJourney] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [genderEdit, setGenderEdit] = useState<"feminino" | "masculino" | "outros" | "">("");
  const [customGenderEdit, setCustomGenderEdit] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Load existing data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      // Set display name from user metadata
      if (user.user_metadata?.full_name) {
        setDisplayName(user.user_metadata.full_name);
      }
      
      const { data } = await supabase
        .from("profiles")
        .select("gender, linkedin_url, about_me, experience, education, journey, resume_url, photo_url")
        .eq("id", user.id)
        .maybeSingle();
      
      if (data) {
        if (data.gender) {
          if (["feminino", "masculino"].includes(data.gender)) {
            setGenderEdit(data.gender as "feminino" | "masculino");
          } else {
            setGenderEdit("outros");
            setCustomGenderEdit(data.gender);
          }
        }
        setLinkedinUrl(data.linkedin_url || "");
        setAboutMe(data.about_me || "");
        setExperience(data.experience || "");
        setEducation(data.education || "");
        setMyJourney(data.journey || "");
        setCurrentPhotoUrl(data.photo_url || null);
      }
    };
    loadProfile();
  }, [user?.id, user?.user_metadata?.full_name]);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setTempPhotoUrl(url);
      setShowPhotoOptions(false);
      setShowPhotoEditor(true);
    }
  };

  const handlePhotoSave = (croppedImage: Blob) => {
    const file = new File([croppedImage], "profile-photo.jpg", { type: "image/jpeg" });
    setProfilePhoto(file);
    setShowPhotoEditor(false);
    if (tempPhotoUrl) {
      URL.revokeObjectURL(tempPhotoUrl);
      setTempPhotoUrl(null);
    }
  };

  const handlePhotoCancel = () => {
    setShowPhotoEditor(false);
    if (tempPhotoUrl) {
      URL.revokeObjectURL(tempPhotoUrl);
      setTempPhotoUrl(null);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verifica se é PDF
      if (file.type !== "application/pdf") {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, envie apenas arquivos em formato PDF.",
          variant: "destructive",
        });
        e.target.value = ""; // Limpa o input
        return;
      }
      
      setResume(file);
    }
  };

  const handleSaveChanges = async () => {
    // Verificar autenticação primeiro
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar alterações.",
        variant: "destructive",
      });
      return;
    }

    const hasGenderChange =
      genderEdit && (genderEdit as string) !== ""
        ? ((genderEdit as string) === "outros" ? customGenderEdit.trim() !== "" : true)
        : false;

    const hasChanges = 
      displayName.trim() !== "" || 
      aboutMe.trim() !== "" || 
      experience.trim() !== "" || 
      education.trim() !== "" || 
      myJourney.trim() !== "" || 
      profilePhoto !== null || 
      resume !== null ||
      hasGenderChange ||
      linkedinUrl.trim() !== "";

    if (!hasChanges) {
      toast({
        title: "Nenhuma alteração feita",
        description: "Preencha pelo menos um campo para atualizar seu perfil.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates: any = {};

      // Save gender
      if (hasGenderChange) {
        updates.gender = genderEdit === "outros" ? customGenderEdit : genderEdit;
      }

      // Save LinkedIn
      if (linkedinUrl.trim() !== "") {
        updates.linkedin_url = linkedinUrl;
      }

      // Save text fields
      if (aboutMe.trim() !== "") {
        updates.about_me = aboutMe;
      }
      if (experience.trim() !== "") {
        updates.experience = experience;
      }
      if (education.trim() !== "") {
        updates.education = education;
      }
      if (myJourney.trim() !== "") {
        updates.journey = myJourney;
      }

      // Handle resume upload
      if (resume) {
        const ext = resume.name.split(".").pop() || "pdf";
        const path = `${user.id}/resume.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(path, resume, { upsert: true, contentType: resume.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
        updates.resume_url = urlData.publicUrl;
      }

      // Handle photo upload
      if (profilePhoto) {
        const ext = profilePhoto.name.split(".").pop() || "jpg";
        const path = `${user.id}/profile.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(path, profilePhoto, { upsert: true, contentType: profilePhoto.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
        // Add timestamp to force browser to reload image
        updates.photo_url = `${urlData.publicUrl}?t=${Date.now()}`;
      }

      // Update profile fields
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Alterações salvas!",
        description: "Seu perfil foi atualizado com sucesso.",
      });
      navigate("/candidate-profile");
    } catch (err: any) {
      console.error("Erro ao salvar alterações:", err);
      toast({
        title: "Erro ao salvar",
        description: err.message || "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
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
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Editar Perfil
        </h1>

        <div className={`rounded-2xl shadow-lg p-4 sm:p-8 space-y-4 sm:space-y-6 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
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

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Gênero
                </label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      onClick={() => setGenderEdit("feminino")}
                      className={`flex-1 py-3 rounded-full ${genderEdit === "feminino" ? "bg-[#FFF8D6] text-gray-800" : darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"}`}
                    >
                      Feminino
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setGenderEdit("masculino")}
                      className={`flex-1 py-3 rounded-full ${genderEdit === "masculino" ? "bg-[#FFF8D6] text-gray-800" : darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"}`}
                    >
                      Masculino
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setGenderEdit("outros")}
                      className={`flex-1 py-3 rounded-full ${genderEdit === "outros" ? "bg-[#FFF8D6] text-gray-800" : darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"}`}
                    >
                      Outros
                    </Button>
                  </div>
                  {genderEdit === "outros" && (
                    <input
                      type="text"
                      value={customGenderEdit}
                      onChange={(e) => setCustomGenderEdit(e.target.value)}
                      placeholder="Especifique seu gênero"
                      className={`w-full p-3 rounded-full border ${
                        darkMode ? "bg-gray-600 text-white border-gray-500 placeholder:text-gray-300" : "bg-gray-100 text-gray-800 border-gray-300 placeholder:text-gray-500"
                      }`}
                    />
                  )}
                </div>
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
                ) : currentPhotoUrl ? (
                  <img
                    src={currentPhotoUrl}
                    alt="Foto atual"
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

          {/* LinkedIn */}
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              LinkedIn (opcional)
            </label>
            <div className="relative">
              <span className={`${darkMode ? "text-gray-400" : "text-gray-500"} absolute left-3 top-1/2 -translate-y-1/2`} aria-hidden="true">
                <Linkedin size={20} />
              </span>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/seu-perfil"
                className={`w-full p-3 pl-12 rounded-lg border ${
                  darkMode ? "bg-gray-600 text-white border-gray-500 placeholder:text-gray-300" : "bg-gray-100 text-gray-800 border-gray-300 placeholder:text-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Currículo (apenas PDF)
            </label>
            <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Envie seu currículo em formato PDF
            </p>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => document.getElementById("resume-upload")?.click()}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              >
                <Upload size={20} />
                Enviar arquivo PDF
              </Button>
              {resume && (
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {resume.name}
                </span>
              )}
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
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

      {/* Photo Editor Modal */}
      {showPhotoEditor && tempPhotoUrl && (
        <PhotoEditor
          image={tempPhotoUrl}
          onSave={handlePhotoSave}
          onCancel={handlePhotoCancel}
        />
      )}
    </div>
  );
}
