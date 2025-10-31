import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Camera, PlusCircle, List, Briefcase, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { PhotoEditor } from "@/components/PhotoEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function EditCompanyProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const companyName = user?.user_metadata?.company_name || "Mercado Livre";

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [about, setAbout] = useState("");
  const [seeking, setSeeking] = useState("");
  const [training, setTraining] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  // Original values to track changes
  const [originalValues, setOriginalValues] = useState({
    displayName: "",
    about: "",
    seeking: "",
    training: "",
    logo: null as string | null
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from("company_profiles")
        .select("logo_url, about, seeking, training")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const initialData = {
        displayName: companyName,
        about: data?.about || "",
        seeking: data?.seeking || "",
        training: data?.training || "",
        logo: data?.logo_url || null
      };

      setDisplayName(initialData.displayName);
      setAbout(initialData.about);
      setSeeking(initialData.seeking);
      setTraining(initialData.training);
      setLogo(initialData.logo);
      setOriginalValues(initialData);
    };
    
    loadProfile();
  }, [companyName, user?.id]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

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
      if (training !== originalValues.training) {
        updates.training = training;
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
        updates.logo_url = urlData.publicUrl;
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
        training,
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
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {companyName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{companyName}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Dashboard</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/create-job");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-jobs");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <List size={24} />
                <span className="text-lg">Minhas Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-company");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

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
                  Formações
                </label>
                <Textarea
                  value={training}
                  onChange={(e) => setTraining(e.target.value)}
                  rows={5}
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
