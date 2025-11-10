import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Camera, Upload, X, Linkedin, Sparkles, FileUp, Lock, AlertCircle } from "lucide-react";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { PhotoEditor } from "@/components/PhotoEditor";
import { AIResumeDialog } from "@/components/AIResumeDialog";
import { supabase } from "@/integrations/supabase/client";

export default function EditCandidateProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [showAIResumeDialog, setShowAIResumeDialog] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [aiGeneratedResumeUrl, setAiGeneratedResumeUrl] = useState<string | null>(null);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [socialName, setSocialName] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [phone, setPhone] = useState("");
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
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<Array<{ sigla: string; nome: string }>>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Display names - prioritizes social name
  const [userName, setUserName] = useState("Usuário");
  const [fullName, setFullName] = useState("Usuário");

  // Load existing data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      // Set display name from user metadata
      if (user.user_metadata?.full_name) {
        setDisplayName(user.user_metadata.full_name);
      }
      
      // Get user metadata for full name
      const fullNameFromMeta = user.user_metadata?.full_name || "";
      const nameParts = fullNameFromMeta.split(" ");
      if (nameParts.length > 0) {
        setDisplayName(nameParts[0]);
        if (nameParts.length > 1) {
          setLastName(nameParts.slice(1).join(" "));
        }
      }

      // Get birth_date, social_name, cpf, rg, phone from user metadata
      setBirthDate(user.user_metadata?.birth_date || "");
      setSocialName(user.user_metadata?.social_name || "");
      setCpf(user.user_metadata?.cpf || "");
      setRg(user.user_metadata?.rg || "");
      setPhone(user.user_metadata?.phone || "");

      const { data } = await supabase
        .from("profiles")
        .select("gender, linkedin_url, about_me, experience, education, journey, resume_url, photo_url, state, city, social_name, full_name")
        .eq("id", user.id)
        .maybeSingle();
      
      if (data) {
        // Prioriza nome social quando disponível
        const nameToUse = data.social_name || data.full_name || user.user_metadata?.full_name || "Usuário";
        setFullName(nameToUse);
        setUserName(nameToUse.split(" ")[0]);
        
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
        
        // Load state and city from database or fallback to user metadata
        setState(data.state || user.user_metadata?.state || "");
        setCity(data.city || user.user_metadata?.city || "");
      } else {
        // If no profile data, load from metadata
        setState(user.user_metadata?.state || "");
        setCity(user.user_metadata?.city || "");
      }
    };
    loadProfile();
  }, [user?.id, user?.user_metadata?.full_name]);

  // Load states from IBGE API
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Erro ao carregar estados:", err));
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (state) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`)
        .then((res) => res.json())
        .then((data) => setCities(data.map((city: any) => city.nome)))
        .catch((err) => console.error("Erro ao carregar cidades:", err));
    } else {
      setCities([]);
    }
  }, [state]);

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

  const handleAIResumeGenerated = (resumeUrl: string) => {
    setAiGeneratedResumeUrl(resumeUrl);
    toast({
      title: "Currículo gerado!",
      description: "Seu currículo foi criado com sucesso. Clique em 'Confirmar Alterações' para salvar.",
    });
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
      lastName.trim() !== "" ||
      socialName.trim() !== "" ||
      rg.trim() !== "" ||
      phone.trim() !== "" ||
      aboutMe.trim() !== "" || 
      experience.trim() !== "" || 
      education.trim() !== "" || 
      myJourney.trim() !== "" || 
      profilePhoto !== null || 
      resume !== null ||
      aiGeneratedResumeUrl !== null ||
      hasGenderChange ||
      linkedinUrl.trim() !== "" ||
      state.trim() !== "" ||
      city.trim() !== "";

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
      const metadataUpdates: any = {};

      // Update full_name in auth metadata
      if (displayName.trim() !== "" || lastName.trim() !== "") {
        const newFullName = `${displayName.trim()} ${lastName.trim()}`.trim();
        metadataUpdates.full_name = newFullName;
      }

      // Update other metadata fields (excluding fixed fields: cpf, birthDate)
      if (socialName.trim() !== "") metadataUpdates.social_name = socialName;
      if (rg.trim() !== "") metadataUpdates.rg = rg;
      if (phone.trim() !== "") metadataUpdates.phone = phone;

      // Update user metadata if there are changes
      if (Object.keys(metadataUpdates).length > 0) {
        const { error: metaError } = await supabase.auth.updateUser({
          data: metadataUpdates
        });
        if (metaError) throw metaError;
      }

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
      if (state.trim() !== "") {
        updates.state = state;
      }
      if (city.trim() !== "") {
        updates.city = city;
      }
      
      // Handle AI-generated resume
      if (aiGeneratedResumeUrl) {
        updates.resume_url = aiGeneratedResumeUrl;
      }
      // Handle manual resume upload
      else if (resume) {
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
              {/* Seção de campos restritos */}
              <div className={`p-4 rounded-lg border-2 ${darkMode ? "bg-gray-800 border-yellow-600" : "bg-yellow-50 border-yellow-400"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="text-yellow-600" size={20} />
                  <span className={`text-sm font-medium ${darkMode ? "text-yellow-400" : "text-yellow-700"}`}>
                    Campos com edição restrita - Requer validação especial
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Nome
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 text-white border-yellow-600" : "bg-white text-gray-800 border-yellow-400"}`}
                      placeholder="Digite seu nome"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 text-white border-yellow-600" : "bg-white text-gray-800 border-yellow-400"}`}
                      placeholder="Digite seu sobrenome"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    RG
                  </label>
                  <input
                    type="text"
                    value={rg}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setRg(value);
                    }}
                    maxLength={15}
                    className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 text-white border-yellow-600" : "bg-white text-gray-800 border-yellow-400"}`}
                    placeholder="000000000"
                  />
                </div>
              </div>

              {/* Seção de campos fixos */}
              <div className={`p-4 rounded-lg border-2 ${darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className={darkMode ? "text-gray-400" : "text-gray-600"} size={20} />
                  <span className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Campos fixos - Não editáveis
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      CPF
                    </label>
                    <input
                      type="text"
                      value={cpf}
                      disabled
                      className={`w-full p-3 rounded-lg border cursor-not-allowed ${darkMode ? "bg-gray-900 text-gray-500 border-gray-700" : "bg-gray-200 text-gray-500 border-gray-400"}`}
                      placeholder="00000000000"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      disabled
                      className={`w-full p-3 rounded-lg border cursor-not-allowed ${darkMode ? "bg-gray-900 text-gray-500 border-gray-700" : "bg-gray-200 text-gray-500 border-gray-400"}`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Nome Social (opcional)
                </label>
                <input
                  type="text"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
                  placeholder="Digite seu nome social"
                />
              </div>


              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Telefone/WhatsApp
                </label>
                <div className="relative">
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-500"} absolute left-3 top-1/2 -translate-y-1/2 font-medium`}>
                    +55
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPhone(value);
                    }}
                    maxLength={11}
                    placeholder="11999999999"
                    className={`w-full p-3 pl-14 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
                  />
                </div>
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

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Estado
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity("");
                  }}
                  className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
                >
                  <option value="">Selecione o estado</option>
                  {states.map((st) => (
                    <option key={st.sigla} value={st.sigla}>
                      {st.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Cidade
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!state}
                  className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-600 text-white border-gray-500" : "bg-gray-100 text-gray-800 border-gray-300"} ${!state ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Selecione a cidade</option>
                  {cities.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
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

          {/* Resume Section */}
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Currículo (apenas PDF)
            </label>
            <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Crie seu currículo com IA ou faça upload do seu arquivo PDF
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() => setShowAIResumeDialog(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Criar com IA
              </Button>
              <Button
                onClick={() => resumeInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <FileUp size={20} />
                Fazer Upload
              </Button>
            </div>
            {(resume || aiGeneratedResumeUrl) && (
              <p className={`text-sm mt-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {resume ? `📄 ${resume.name}` : '✨ Currículo gerado por IA'}
              </p>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="hidden"
            />
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

      {/* AI Resume Dialog */}
      <AIResumeDialog
        open={showAIResumeDialog}
        onOpenChange={setShowAIResumeDialog}
        profileData={{
          fullName: displayName || fullName,
          aboutMe,
          experience,
          education,
          journey: myJourney,
        }}
        onResumeGenerated={handleAIResumeGenerated}
      />
    </div>
  );
}
