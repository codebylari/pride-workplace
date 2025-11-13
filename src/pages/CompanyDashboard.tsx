import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  const companyName = user?.user_metadata?.company_name || "Empresa";

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      // Buscar vagas ativas
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', user.id);

      // Buscar total de candidaturas
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('company_id', user.id);

      const jobIds = jobs?.map(j => j.id) || [];

      let applicationsCount = 0;
      let pendingCount = 0;

      if (jobIds.length > 0) {
        const { count: totalApps } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds);

        const { count: pendingApps } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds)
          .eq('status', 'pending');

        applicationsCount = totalApps || 0;
        pendingCount = pendingApps || 0;
      }

      setStats({
        activeJobs: jobsCount || 0,
        totalApplications: applicationsCount,
        pendingApplications: pendingCount
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Conexões tecnológicas com brilho em todo o fundo */}
      <div className="absolute left-0 top-[72px] right-0 bottom-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Filtro de brilho para os pontos */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Pontos com brilho */}
          <circle cx="10%" cy="15%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="25%" cy="12%" r="2" fill="#9ca3af" />
          <circle cx="40%" cy="18%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="55%" cy="10%" r="2" fill="#9ca3af" />
          <circle cx="70%" cy="20%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="85%" cy="15%" r="2" fill="#9ca3af" />
          
          <circle cx="15%" cy="30%" r="2" fill="#9ca3af" />
          <circle cx="32%" cy="35%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="48%" cy="28%" r="2" fill="#9ca3af" />
          <circle cx="62%" cy="38%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="78%" cy="32%" r="2" fill="#9ca3af" />
          <circle cx="90%" cy="35%" r="4" fill="#6b7280" filter="url(#glow)" />
          
          <circle cx="8%" cy="50%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="22%" cy="48%" r="2" fill="#9ca3af" />
          <circle cx="38%" cy="52%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="52%" cy="45%" r="2" fill="#9ca3af" />
          <circle cx="68%" cy="55%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="82%" cy="48%" r="2" fill="#9ca3af" />
          
          <circle cx="12%" cy="68%" r="2" fill="#9ca3af" />
          <circle cx="28%" cy="65%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="45%" cy="70%" r="2" fill="#9ca3af" />
          <circle cx="60%" cy="68%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="75%" cy="72%" r="2" fill="#9ca3af" />
          <circle cx="88%" cy="65%" r="4" fill="#6b7280" filter="url(#glow)" />
          
          <circle cx="18%" cy="85%" r="3" fill="#6b7280" filter="url(#glow)" />
          <circle cx="35%" cy="88%" r="2" fill="#9ca3af" />
          <circle cx="50%" cy="82%" r="4" fill="#6b7280" filter="url(#glow)" />
          <circle cx="65%" cy="90%" r="2" fill="#9ca3af" />
          <circle cx="80%" cy="85%" r="3" fill="#6b7280" filter="url(#glow)" />
          
          {/* Linhas de conexão */}
          <line x1="10%" y1="15%" x2="25%" y2="12%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="25%" y1="12%" x2="40%" y2="18%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="40%" y1="18%" x2="55%" y2="10%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="55%" y1="10%" x2="70%" y2="20%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="70%" y1="20%" x2="85%" y2="15%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="10%" y1="15%" x2="15%" y2="30%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="25%" y1="12%" x2="32%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="40%" y1="18%" x2="48%" y2="28%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="55%" y1="10%" x2="62%" y2="38%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="70%" y1="20%" x2="78%" y2="32%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="85%" y1="15%" x2="90%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="15%" y1="30%" x2="32%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="32%" y1="35%" x2="48%" y2="28%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="48%" y1="28%" x2="62%" y2="38%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="62%" y1="38%" x2="78%" y2="32%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="78%" y1="32%" x2="90%" y2="35%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="15%" y1="30%" x2="8%" y2="50%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="32%" y1="35%" x2="22%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="48%" y1="28%" x2="38%" y2="52%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="62%" y1="38%" x2="52%" y2="45%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="78%" y1="32%" x2="68%" y2="55%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="90%" y1="35%" x2="82%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="8%" y1="50%" x2="22%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="22%" y1="48%" x2="38%" y2="52%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="38%" y1="52%" x2="52%" y2="45%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="52%" y1="45%" x2="68%" y2="55%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="68%" y1="55%" x2="82%" y2="48%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="8%" y1="50%" x2="12%" y2="68%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="22%" y1="48%" x2="28%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="38%" y1="52%" x2="45%" y2="70%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="52%" y1="45%" x2="60%" y2="68%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="68%" y1="55%" x2="75%" y2="72%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="82%" y1="48%" x2="88%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="12%" y1="68%" x2="28%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="28%" y1="65%" x2="45%" y2="70%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="45%" y1="70%" x2="60%" y2="68%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="60%" y1="68%" x2="75%" y2="72%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="75%" y1="72%" x2="88%" y2="65%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="12%" y1="68%" x2="18%" y2="85%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="28%" y1="65%" x2="35%" y2="88%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="45%" y1="70%" x2="50%" y2="82%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="60%" y1="68%" x2="65%" y2="90%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="75%" y1="72%" x2="80%" y2="85%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="18%" y1="85%" x2="35%" y2="88%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="35%" y1="88%" x2="50%" y2="82%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="50%" y1="82%" x2="65%" y2="90%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
          <line x1="65%" y1="90%" x2="80%" y2="85%" stroke="#6b7280" strokeWidth="0.5" opacity="0.6" />
        </svg>
      </div>

      {/* Cabeçalho */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      {/* Menu Lateral */}
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Card de Boas-vindas */}
          <div className={`rounded-2xl p-6 sm:p-12 shadow-lg mb-6 sm:mb-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <div className="text-center space-y-4 sm:space-y-8">
              <div className="space-y-2">
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Bem-vindo(a), {companyName}
                </h1>
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                </div>
              </div>
              
              <p className={`text-base sm:text-lg md:text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Gerencie suas oportunidades de forma simples e rápida
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-6">
                <Button
                  onClick={() => navigate("/create-job")}
                  className="w-full sm:w-auto bg-[#C1E1C1] hover:bg-[#B0D5B0] text-gray-900 px-8 sm:px-12 py-4 sm:py-6 rounded-xl text-base sm:text-lg font-semibold"
                >
                  Cadastre sua vaga
                </Button>
                
                <Button
                  onClick={() => navigate("/company-jobs")}
                  className="w-full sm:w-auto bg-[#C1E1C1] hover:bg-[#B0D5B0] text-gray-900 px-8 sm:px-12 py-4 sm:py-6 rounded-xl text-base sm:text-lg font-semibold"
                >
                  Acesse suas vagas
                </Button>
              </div>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className={`rounded-xl p-4 sm:p-6 shadow-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <h3 className={`text-xs sm:text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Vagas Ativas</h3>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.activeJobs}</p>
            </div>
            
            <div className={`rounded-xl p-4 sm:p-6 shadow-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <h3 className={`text-xs sm:text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Candidaturas</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.totalApplications}</p>
            </div>
            
            <div className={`rounded-xl p-4 sm:p-6 shadow-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <h3 className={`text-xs sm:text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Em Análise</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.pendingApplications}</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
