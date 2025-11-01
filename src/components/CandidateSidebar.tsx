import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, User, Settings, Headset, Info, FileText, LogOut, ClipboardList } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface CandidateSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export function CandidateSidebar({ showSidebar, setShowSidebar }: CandidateSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string>("");

  const fullName = user?.user_metadata?.full_name || "Usuário";
  const userName = fullName.split(" ")[0];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("photo_url, gender")
        .eq("id", user.id)
        .maybeSingle();
      
      setPhotoUrl(data?.photo_url || null);
      setUserGender(data?.gender || "");
    };
    fetchUserData();
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const genderText = userGender === "masculino" ? "candidato" : userGender === "feminino" ? "candidata" : "candidato(a)";

  const menuItems = [
    { icon: Briefcase, label: "Vagas", path: "/candidate-dashboard" },
    { icon: ClipboardList, label: "Minhas Candidaturas", path: "/my-applications" },
    { icon: User, label: "Meu Perfil", path: "/candidate-profile" },
    { icon: Settings, label: "Configurações", path: "/candidate-settings" },
    { icon: Headset, label: "Suporte", path: "/candidate-support" },
    { icon: Info, label: "Quem Somos", path: "/candidate-about" },
    { icon: FileText, label: "Termos de Uso", path: "/terms-candidate" },
  ];

  if (!showSidebar) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
      <div 
        style={{ background: 'linear-gradient(to bottom, hsl(315, 35%, 55%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}
        className="absolute left-0 top-0 h-full w-[min(80vw,320px)] shadow-xl text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Section */}
        <div className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 border-b border-white/20 flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30 flex-shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt={`Foto de ${fullName}`} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold truncate">{fullName}</h2>
            <p className="text-xs sm:text-sm text-white/80">{genderText}</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 sm:py-6 px-3 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  setShowSidebar(false);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition text-left ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <Icon size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button at Bottom */}
        <div className="p-3 sm:p-4 border-t border-white/20 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-red-400"
          >
            <LogOut size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="text-base sm:text-lg">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
