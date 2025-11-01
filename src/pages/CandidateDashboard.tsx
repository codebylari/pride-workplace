import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MapPin } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<any[]>([]);
  const jobsPerPage = 9;

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select(`
          *,
          company_profiles!jobs_company_id_fkey(fantasy_name, logo_url)
        `)
        .order("created_at", { ascending: false });
      
      if (data) {
        setJobs(data);
      }
    };
    fetchJobs();
  }, []);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

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
          {currentJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Nenhuma vaga disponível no momento.
              </p>
            </div>
          ) : (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className={`rounded-xl shadow-md hover:shadow-lg transition p-4 sm:p-6 space-y-3 sm:space-y-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}
              >
                {/* Company Logo */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
                    {job.company_profiles?.logo_url ? (
                      <img src={job.company_profiles.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {job.company_profiles?.fantasy_name?.charAt(0) || "E"}
                      </span>
                    )}
                  </div>
                  {job.location?.toLowerCase().includes("remoto") && (
                    <div className="flex items-center gap-1 text-orange-500 text-xs sm:text-sm">
                      <MapPin size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Remoto</span>
                      <span className="sm:hidden">R</span>
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {job.company_profiles?.fantasy_name || "Empresa"}
                </h3>

                {/* Job Title */}
                <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {job.title}
                </p>

                {/* Job Type and Location */}
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {job.job_type} · {job.location}
                </p>

                {/* View Details Button */}
                <Button
                  onClick={() => navigate(`/job/${job.id}`)}
                  variant="link"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-xs sm:text-sm"
                >
                  → Ver detalhes
                </Button>
              </div>
            ))
          )}
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
