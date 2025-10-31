import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Bell, Star, MapPin, DollarSign, Briefcase, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

export default function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const fullName = user?.user_metadata?.full_name || "Usuário";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Mock data - será substituído por dados reais do banco
  const job = {
    id: id,
    company: "Mercado Livre",
    logo: "🛒",
    title: "Analista de TI",
    type: "Vaga Temporária",
    location: "Remoto | Freelancer",
    tags: ["Freelancer", "Remoto", "Part-time"],
    salary: "R$ a combinar",
    contractType: "Freelancer",
    publishedDate: "18/09/2025",
    workType: "Trabalho 100% remoto",
    description: `A empresa busca profissional de TI para atuação temporária em suporte e manutenção de sistemas voltados ao comércio eletrônico. O contratado(a) será responsável por auxiliar a equipe de vendas online na resolução de problemas técnicos, garantindo o bom funcionamento das operações digitais e da infraestrutura de TI.`
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
            </nav>

            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
              >
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`rounded-2xl shadow-lg p-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          {/* Company Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center text-6xl shadow-lg">
                {job.logo}
              </div>
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {job.company}
                </h1>
              <Button
                onClick={() => navigate("/company/1/profile")}
                className="bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 rounded-full px-6"
              >
                Ver perfil da Empresa
              </Button>
              </div>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2"
            >
              <Star
                size={32}
                fill={isFavorite ? "#fbbf24" : "none"}
                className={isFavorite ? "text-yellow-400" : "text-gray-400"}
              />
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-pink-500" />
            <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {job.location}
            </span>
          </div>

          {/* Job Title and Type */}
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            {job.type} – {job.title}
          </h2>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {job.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {job.salary}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {job.contractType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Publicado em {job.publishedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Home size={20} className="text-pink-500" />
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {job.workType}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className={`mb-8 p-6 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Descrição da vaga
            </h3>
            <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {job.description}
            </p>
          </div>

          {/* Apply Button */}
          <Button
            onClick={() => navigate(`/job/${id}/apply`)}
            className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-6 rounded-full text-lg font-semibold"
          >
            Candidatar-se a vaga
          </Button>
        </div>
      </main>
    </div>
  );
}
