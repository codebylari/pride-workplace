import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { PhotoEditor } from "@/components/PhotoEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function EditCompanyProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const companyName = user?.user_metadata?.company_name || "Mercado Livre";

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [about, setAbout] = useState("");
  const [seeking, setSeeking] = useState("");
  const [training, setTraining] = useState("");
  const [sector, setSector] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [essentialSkills, setEssentialSkills] = useState<string[]>([]);

  // Estados e cidades
  const [states, setStates] = useState<Array<{ id: number; sigla: string; nome: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: number; nome: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Original values to track changes
  const [originalValues, setOriginalValues] = useState({
    displayName: "",
    about: "",
    seeking: "",
    training: "",
    sector: "",
    state: "",
    city: "",
    logo: null as string | null,
    essentialSkills: [] as string[]
  });

  // Carregar estados da API do IBGE
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Erro ao carregar estados:", err));
  }, []);

  // Carregar cidades quando estado muda
  useEffect(() => {
    if (!state) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`
        );
        const data = await response.json();
        setCities(data);
      } catch (err) {
        console.error("Erro ao carregar cidades:", err);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [state]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("company_profiles")
        .select("logo_url, about, seeking, training, sector, state, city, essential_skills")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao carregar perfil:", error);
        return;
      }
      
      const initialData = {
        displayName: user.user_metadata?.company_name || companyName,
        about: data?.about || "",
        seeking: data?.seeking || "",
        training: data?.training || "",
        sector: data?.sector || "",
        state: data?.state || "",
        city: data?.city || "",
        logo: data?.logo_url || null,
        essentialSkills: data?.essential_skills || []
      };

      // Set all form values
      setDisplayName(initialData.displayName);
      setAbout(initialData.about);
      setSeeking(initialData.seeking);
      setTraining(initialData.training);
      setSector(initialData.sector);
      setEssentialSkills(initialData.essentialSkills);
      
      // Set state first, which will trigger the cities useEffect
      if (initialData.state) {
        setState(initialData.state);
      }
      
      // Set city after state is set
      if (initialData.city) {
        setCity(initialData.city);
      }
      
      setCurrentLogoUrl(data?.logo_url || null);
      setOriginalValues(initialData);
    };
    
    loadProfile();
  }, [companyName, user?.id, user?.user_metadata?.company_name]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowPhotoEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (croppedImage: Blob) => {
    const url = URL.createObjectURL(croppedImage);
    setLogo(url);
    setShowPhotoEditor(false);
    setSelectedImage(null);
  };

  const hasChanges = () => {
    return (
      displayName !== originalValues.displayName ||
      about !== originalValues.about ||
      seeking !== originalValues.seeking ||
      training !== originalValues.training ||
      sector !== originalValues.sector ||
      state !== originalValues.state ||
      city !== originalValues.city ||
      logo !== originalValues.logo ||
      JSON.stringify(essentialSkills) !== JSON.stringify(originalValues.essentialSkills)
    );
  };

  const handleConfirm = async () => {
    // Verificar autenticação primeiro
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar alterações.",
        variant: "destructive",
      });
      return;
    }

    if (!hasChanges()) {
      toast({
        title: "Nenhuma alteração",
        description: "Nada foi modificado no perfil.",
        variant: "default",
      });
      return;
    }

    try {
      const updates: any = {
        fantasy_name: displayName.trim(),
        about: about.trim(),
        seeking: seeking.trim(),
        training: training.trim(),
        sector: sector.trim(),
        state: state,
        city: city,
        essential_skills: essentialSkills
      };

      // Handle logo upload if there's a new one
      if (logo && logo !== originalValues.logo) {
        // Convert blob URL to actual blob
        const response = await fetch(logo);
        const blob = await response.blob();
        const file = new File([blob], "logo.jpg", { type: "image/jpeg" });

        const ext = "jpg";
        const path = `${user.id}/logo.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(path, file, { upsert: true, contentType: file.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
        // Add timestamp to force browser to reload image
        updates.logo_url = `${urlData.publicUrl}?t=${Date.now()}`;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("company_profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("company_profiles")
          .update(updates)
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Erro ao atualizar perfil:", updateError);
          throw updateError;
        }
      } else {
        // Create new profile - need CNPJ from user metadata
        const cnpj = user.user_metadata?.cnpj;
        if (!cnpj) {
          toast({
            title: "Erro",
            description: "CNPJ não encontrado. Por favor, faça login novamente.",
            variant: "destructive",
          });
          return;
        }

        const { error: insertError } = await supabase
          .from("company_profiles")
          .insert({
            user_id: user.id,
            cnpj: cnpj,
            ...updates
          });

        if (insertError) {
          console.error("Erro ao criar perfil:", insertError);
          throw insertError;
        }
      }

      toast({
        title: "Sucesso!",
        description: "Suas alterações foram salvas com sucesso.",
        variant: "default",
      });

      // Update original values
      setOriginalValues({
        displayName,
        about,
        seeking,
        training,
        sector,
        state,
        city,
        logo: updates.logo_url || logo,
        essentialSkills
      });

      navigate("/company-profile");
    } catch (err: any) {
      console.error("Erro ao salvar alterações:", err);
      
      let errorMessage = "Não foi possível salvar as alterações.";
      
      if (err.message?.includes("permission denied")) {
        errorMessage = "Você não tem permissão para editar este perfil.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Edite seu perfil
          </h1>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Nome exibido
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={darkMode ? "bg-gray-700 text-white" : ""}
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Sobre a Empresa
                </label>
                <Textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={5}
                  className={darkMode ? "bg-gray-700 text-white" : ""}
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  O que a empresa busca?
                </label>
                <Textarea
                  value={seeking}
                  onChange={(e) => setSeeking(e.target.value)}
                  rows={5}
                  className={darkMode ? "bg-gray-700 text-white" : ""}
                  placeholder="Digite cada item em uma nova linha"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Formação e Treinamentos Oferecidos
                </label>
                <Textarea
                  value={training}
                  onChange={(e) => setTraining(e.target.value)}
                  rows={5}
                  className={darkMode ? "bg-gray-700 text-white" : ""}
                  placeholder="Descreva os treinamentos, capacitações e programas de formação que a empresa oferece aos colaboradores"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Setor da Empresa
                </label>
                <Input
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Ex: Tecnologia, Educação, Saúde"
                  className={darkMode ? "bg-gray-700 text-white" : ""}
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Estado (UF)
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity("");
                  }}
                  className={`w-full p-3 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring`}
                >
                  <option value="">Selecione o estado</option>
                  {states.map((st) => (
                    <option key={st.id} value={st.sigla}>
                      {st.nome} ({st.sigla})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Cidade
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!state || loadingCities}
                  className={`w-full p-3 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50`}
                >
                  <option value="">
                    {loadingCities ? "Carregando..." : !state ? "Selecione o estado primeiro" : "Selecione a cidade"}
                  </option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Competências Essenciais
                </label>
                <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Selecione uma ou mais competências que você busca em candidatos
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Ciência de Dados",
                    "Testes",
                    "Cibersegurança",
                    "Infraestrutura",
                    "Desenvolvimento de Software",
                    "Blockchain",
                    "Inteligência Artificial",
                    "Arquitetura",
                    "Engenharia de Dados",
                    "Suporte Técnico",
                    "Design",
                    "Análise de Dados",
                    "Nuvem",
                    "Outros",
                  ].map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        setEssentialSkills(prev =>
                          prev.includes(skill)
                            ? prev.filter(s => s !== skill)
                            : [...prev, skill]
                        );
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        essentialSkills.includes(skill)
                          ? darkMode
                            ? "bg-green-600 text-white"
                            : "bg-green-500 text-white"
                          : darkMode
                          ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Photo */}
            <div className="flex flex-col items-center">
              <div className="mb-6">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo da empresa"
                    className="w-48 h-48 rounded-full object-cover shadow-lg"
                  />
                ) : currentLogoUrl ? (
                  <img
                    src={currentLogoUrl}
                    alt="Logo atual"
                    className="w-48 h-48 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-48 h-48 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-6xl font-bold text-white">
                      {companyName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <label htmlFor="photo-upload">
                <Button
                  type="button"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                  className="bg-green-300 hover:bg-green-400 text-green-900 font-semibold"
                >
                  <Camera className="mr-2" size={20} />
                  Alterar foto
                </Button>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleConfirm}
              className="px-12 py-6 bg-green-300 hover:bg-green-400 text-green-900 font-semibold text-lg rounded-full"
            >
              CONFIRMAR ALTERAÇÕES
            </Button>
          </div>
        </div>
      </main>

      {/* Photo Editor */}
      {showPhotoEditor && selectedImage && (
        <PhotoEditor
          image={selectedImage}
          onSave={handleSavePhoto}
          onCancel={() => {
            setShowPhotoEditor(false);
            setSelectedImage(null);
          }}
        />
      )}

      <ChatBot />
    </div>
  );
}
