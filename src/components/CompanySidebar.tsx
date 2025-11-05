import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut, List, Heart, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface CompanySidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export function CompanySidebar({ showSidebar, setShowSidebar }: CompanySidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const companyName = user?.user_metadata?.company_name || "Empresa";
  
  // Formatar nome: primeira letra maiúscula + abreviação
  const formatName = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return "Empresa";
    
    // Capitalizar apenas primeira letra de cada palavra
    const capitalize = (word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    
    if (parts.length === 1) {
      return capitalize(parts[0]);
    }
    
    // Primeiro nome + inicial do último
    const firstName = capitalize(parts[0]);
    const lastNameInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstName} ${lastNameInitial}.`;
  };
  
  const displayName = formatName(companyName);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("company_profiles")
        .select("logo_url")
        .eq("user_id", user.id)
        .maybeSingle();
      
      setLogoUrl(data?.logo_url || null);
    };
    fetchCompanyData();
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: Briefcase, label: "Dashboard", path: "/company-dashboard" },
    { icon: PlusCircle, label: "Cadastrar Vagas", path: "/create-job" },
    { icon: List, label: "Minhas Vagas", path: "/company-jobs" },
    { icon: Heart, label: "Match de Talentos", path: "/company-swipe" },
    { icon: Heart, label: "Meus Matches", path: "/matches-company" },
    { icon: MessageSquare, label: "Depoimentos", path: "/company-testimonials" },
    { icon: User, label: "Meu Perfil", path: "/company-profile" },
    { icon: Settings, label: "Configurações", path: "/company-settings" },
    { icon: Headset, label: "Suporte", path: "/company-support" },
    { icon: Info, label: "Quem Somos", path: "/company-about" },
    { icon: FileText, label: "Termos de Uso", path: "/terms-company" },
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
        <div className="p-5 flex items-center gap-3 border-b border-white/20 flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden border-3 border-white/30 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={`Logo ${companyName}`} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl font-bold text-white">
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">{displayName}</h2>
            <p className="text-sm text-white/80">empresa</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-3 px-3 space-y-1">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-[15px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button at Bottom */}
        <div className="p-3 border-t border-white/20 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-lg transition text-left text-red-400"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="text-[15px]">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
