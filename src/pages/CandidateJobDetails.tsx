import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Star, MapPin, DollarSign, Briefcase, Calendar, Home } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

export default function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

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
