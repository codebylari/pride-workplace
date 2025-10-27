import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Star, Edit, Briefcase, PlusCircle, User, Settings, Headset, Info, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const companyName = user?.user_metadata?.company_name || "Nome da Empresa";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center">
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

            {/* Menu Items */}
            <nav className="flex-1 py-6 px-4 space-y-2">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Briefcase size={24} />
                <span className="text-lg">Vagas</span>
              </button>
              
              <button className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left">
                <PlusCircle size={24} />
                <span className="text-lg">Cadastrar Vagas</span>
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Logo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {companyName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                  <Edit size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} size={24} className="fill-green-400 text-green-400" />
              ))}
              <Star size={24} className="fill-gray-300 text-gray-300" />
              <span className="ml-2 text-gray-600 font-semibold">4.5</span>
            </div>

            {/* Company Name */}
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
              Nome Empresa: {companyName}
            </h1>

            {/* Action Buttons */}
            <div className="space-y-4 max-w-md mx-auto">
              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Conheça a Empresa
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                O que buscamos
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Relatos
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Formação
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Vagas Disponíveis
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
