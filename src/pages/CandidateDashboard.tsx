import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, MapPin, Users, Briefcase, User, Settings, Headset, Info, FileText, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

// Mock data - será substituído por dados reais do banco
const mockJobs = [
  {
    id: 1,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 2,
    company: "Mercado Livre",
    title: "Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 3,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 4,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 5,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 6,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 7,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 8,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
  {
    id: 9,
    company: "Mercado Livre",
    title: "Vaga Temporária - Analista de TI / Suporte Técnico",
    type: "Freelancer · Remoto · Part-time",
    applicants: "Fila à contratar",
    remote: true,
  },
];

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Get user name from metadata
  const userName = user?.user_metadata?.full_name || "Usuário";

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = mockJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(mockJobs.length / jobsPerPage);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
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
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-lg shadow-xl z-50 animate-fade-in">
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
            className="absolute left-0 top-0 h-full w-[min(80vw,320px)] shadow-xl text-white flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Section */}
            <div className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 border-b border-white/20 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30 flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold truncate">{userName}</h2>
                <p className="text-xs sm:text-sm text-white/80">candidato (a)</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-4 sm:py-6 px-3 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
              <button className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left">
                <Briefcase size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Vagas</span>
              </button>

              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/my-applications");
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <ClipboardList size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Minhas Candidaturas</span>
              </button>
              
              <button
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-profile");
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <User size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-settings");
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Settings size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-support");
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Headset size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/candidate-about");
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <Info size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-candidate");
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <FileText size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Termos de Uso</span>
              </button>
            </nav>

            {/* Logout Button at Bottom */}
            <div className="p-3 sm:p-4 border-t border-white/20 flex-shrink-0">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
              >
                <LogOut size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-base sm:text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className={`shadow-sm p-3 sm:p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
        <div className="container mx-auto max-w-6xl px-2 sm:px-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full sm:w-64 ml-auto rounded-lg ${darkMode ? "bg-gray-600 border-gray-500 text-white placeholder:text-gray-300" : "bg-green-100 border-green-300"}`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className={`rounded-xl shadow-md hover:shadow-lg transition p-4 sm:p-6 space-y-3 sm:space-y-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}
            >
              {/* Company Logo */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">ML</span>
                </div>
                {job.remote && (
                  <div className="flex items-center gap-1 text-orange-500 text-xs sm:text-sm">
                    <MapPin size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Remoto</span>
                    <span className="sm:hidden">R</span>
                  </div>
                )}
              </div>

              {/* Company Name */}
              <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{job.company}</h3>

              {/* Job Title */}
              <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{job.title}</p>

              {/* Job Type */}
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{job.type}</p>

              {/* Applicants */}
              <div className={`flex items-center gap-2 text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                <Users size={14} className="sm:w-4 sm:h-4" />
                <span>{job.applicants}</span>
              </div>

              {/* View Details Button */}
              <Button
                onClick={() => navigate(`/job/${job.id}`)}
                variant="link"
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-xs sm:text-sm"
              >
                → Ver detalhes
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1 rounded disabled:opacity-50 text-sm sm:text-base ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-100"}`}
          >
            ‹
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${
                currentPage === index + 1
                  ? "bg-gray-800 text-white"
                  : darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-3 py-1 rounded disabled:opacity-50 text-sm sm:text-base ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-100"}`}
          >
            ›
          </button>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
