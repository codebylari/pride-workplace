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
  const [sector, setSector] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);

  // Original values to track changes
  const [originalValues, setOriginalValues] = useState({
    displayName: "",
    about: "",
    seeking: "",
    sector: "",
    logo: null as string | null
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      // Set display name from user metadata
      if (user.user_metadata?.company_name) {
        setDisplayName(user.user_metadata.company_name);
      }
      
      const { data } = await supabase
        .from("company_profiles")
        .select("logo_url, about, seeking, sector")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const initialData = {
        displayName: user.user_metadata?.company_name || companyName,
        about: data?.about || "",
        seeking: data?.seeking || "",
        sector: data?.sector || "",
        logo: data?.logo_url || null
      };

      setDisplayName(initialData.displayName);
      setAbout(initialData.about);
      setSeeking(initialData.seeking);
      setSector(initialData.sector);
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
      sector !== originalValues.sector ||
      logo !== originalValues.logo
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
      const updates: any = {};

      if (about !== originalValues.about) {
        updates.about = about;
      }
      if (seeking !== originalValues.seeking) {
        updates.seeking = seeking;
      }
      if (sector !== originalValues.sector) {
        updates.sector = sector;
      }

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

      // Update company profile
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("company_profiles")
          .update(updates)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
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
        sector,
        logo
      });

      navigate("/company-profile");
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
                  Setor da Empresa
                </label>
                <Input
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Ex: Tecnologia, Educação, Saúde"
                  className={darkMode ? "bg-gray-700 text-white" : ""}
                />
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
