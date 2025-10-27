import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Star, Edit2, Briefcase, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get user data
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";
  const rating = 4.5;

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center sticky top-0 z-40">
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
            className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Section */}
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

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={24} />
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <Settings size={24} />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <Headset size={24} />
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={24} />
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <FileText size={24} />
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            {/* Logout Button at Bottom */}
            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <LogOut size={24} />
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header Background */}
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Photo */}
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition shadow-lg">
                  <Edit2 size={18} />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} size={24} fill="#22c55e" className="text-green-500" />
              ))}
              <Star size={24} fill="#22c55e" className="text-green-500" fillOpacity={0.5} />
              <span className="ml-2 text-gray-600 font-semibold">{rating}</span>
            </div>

            {/* Name and Gender */}
            <div className="text-center mb-8 space-y-1">
              <h1 className="text-2xl font-bold text-gray-800">
                Nome: {userName}
              </h1>
              <p className="text-lg text-gray-600">
                Gênero: Feminino
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 max-w-md mx-auto">
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Sobre mim
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Experiências
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Formação
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Minha Jornada
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Currículo
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
