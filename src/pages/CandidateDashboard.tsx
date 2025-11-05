import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MapPin, SlidersHorizontal } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidateName, setCandidateName] = useState<string>("Candidato");
  const jobsPerPage = 9;
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: [] as string[],
    salary: [] as string[],
    area: [] as string[],
    experience: [] as string[],
    published: [] as string[],
    workload: [] as string[],
    gender: [] as string[],
  });

  const handleFilterChange = (category: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: [],
      salary: [],
      area: [],
      experience: [],
      published: [],
      workload: [],
      gender: [],
    });
  };

  // Fetch candidate name
  useEffect(() => {
    const fetchCandidateName = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      
      if (data?.full_name) {
        const firstName = data.full_name.split(' ')[0];
        setCandidateName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
      }
    };
    
    fetchCandidateName();
  }, [user]);

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      // Buscar todas as vagas
      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar vagas:", error);
        return;
      }

      if (!jobsData) {
        setJobs([]);
        return;
      }

      // Buscar company_profiles separadamente para cada vaga
      const jobsWithCompanies = await Promise.all(
        jobsData.map(async (job) => {
          const { data: companyData } = await supabase
            .from("company_profiles")
            .select("fantasy_name, logo_url")
            .eq("user_id", job.company_id)
            .maybeSingle();

          return {
            ...job,
            company_profiles: companyData || { fantasy_name: "Empresa", logo_url: null },
          };
        })
      );
      
      setJobs(jobsWithCompanies);
    };
    fetchJobs();
  }, []);

  // Filter jobs based on filters
  const filteredJobs = jobs.filter(job => {
    // Search query filter
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !job.company_profiles?.fantasy_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Location filter
    if (filters.location.length > 0) {
      const hasMatch = filters.location.some(loc => {
        if (loc === "remoto") return job.location?.toLowerCase().includes("remoto");
        if (loc === "presencial") return job.location?.toLowerCase().includes("presencial");
        if (loc === "hibrido") return job.location?.toLowerCase().includes("híbrido") || job.location?.toLowerCase().includes("hibrido");
        return false;
      });
      if (!hasMatch) return false;
    }

    // Salary filter
    if (filters.salary.length > 0) {
      const hasMatch = filters.salary.some(sal => {
        if (sal === "combinar") return job.salary?.toLowerCase().includes("combinar") || !job.salary;
        if (sal === "ate2000") {
          const salaryNum = parseInt(job.salary?.replace(/\D/g, '') || "0");
          return salaryNum > 0 && salaryNum <= 2000;
        }
        if (sal === "2000-5000") {
          const salaryNum = parseInt(job.salary?.replace(/\D/g, '') || "0");
          return salaryNum >= 2000 && salaryNum <= 5000;
        }
        if (sal === "5000+") {
          const salaryNum = parseInt(job.salary?.replace(/\D/g, '') || "0");
          return salaryNum > 5000;
        }
        return false;
      });
      if (!hasMatch) return false;
    }

    // Job type/workload filter
    if (filters.workload.length > 0) {
      const hasMatch = filters.workload.some(work => {
        if (work === "full-time") return job.job_type?.toLowerCase().includes("tempo integral") || job.job_type?.toLowerCase().includes("full");
        if (work === "part-time") return job.job_type?.toLowerCase().includes("meio período") || job.job_type?.toLowerCase().includes("part");
        if (work === "flexivel") return job.job_type?.toLowerCase().includes("flexível") || job.job_type?.toLowerCase().includes("flexivel");
        return false;
      });
      if (!hasMatch) return false;
    }

    return true;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

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
          <div className="flex items-center gap-2 justify-end">
            <Input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full sm:w-64 rounded-lg ${darkMode ? "bg-gray-600 border-gray-500 text-white placeholder:text-gray-300" : "bg-green-100 border-green-300"}`}
            />
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={darkMode ? "bg-gray-600 border-gray-500 hover:bg-gray-500" : ""}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className={`overflow-y-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                <SheetHeader>
                  <SheetTitle className={darkMode ? "text-white" : ""}>Filtros de Busca</SheetTitle>
                  <SheetDescription className={darkMode ? "text-gray-300" : ""}>
                    Refine sua busca por vagas
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Localização */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Localização</h3>
                    <div className="space-y-2">
                      {[
                        { value: "remoto", label: "Remoto" },
                        { value: "presencial", label: "Presencial" },
                        { value: "hibrido", label: "Híbrido" }
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${item.value}`}
                            checked={filters.location.includes(item.value)}
                            onCheckedChange={() => handleFilterChange('location', item.value)}
                          />
                          <Label htmlFor={`location-${item.value}`} className={darkMode ? "text-gray-300" : ""}>
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className={darkMode ? "bg-gray-700" : ""} />

                  {/* Faixa Salarial */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Faixa Salarial</h3>
                    <div className="space-y-2">
                      {[
                        { value: "combinar", label: "A combinar" },
                        { value: "ate2000", label: "Até R$ 2.000" },
                        { value: "2000-5000", label: "R$ 2.000 – R$ 5.000" },
                        { value: "5000+", label: "R$ 5.000+" }
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`salary-${item.value}`}
                            checked={filters.salary.includes(item.value)}
                            onCheckedChange={() => handleFilterChange('salary', item.value)}
                          />
                          <Label htmlFor={`salary-${item.value}`} className={darkMode ? "text-gray-300" : ""}>
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className={darkMode ? "bg-gray-700" : ""} />

                  {/* Área de Atuação */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Área de Atuação</h3>
                    <div className="space-y-2">
                      {[
                        { value: "dev", label: "Desenvolvimento de Software" },
                        { value: "suporte", label: "Suporte Técnico" },
                        { value: "design", label: "Design / UI/UX" },
                        { value: "dados", label: "Dados / BI" },
                        { value: "gestao", label: "Gestão de Projetos" }
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`area-${item.value}`}
                            checked={filters.area.includes(item.value)}
                            onCheckedChange={() => handleFilterChange('area', item.value)}
                          />
                          <Label htmlFor={`area-${item.value}`} className={darkMode ? "text-gray-300" : ""}>
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className={darkMode ? "bg-gray-700" : ""} />

                  {/* Nível de Experiência */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Nível de Experiência</h3>
                    <div className="space-y-2">
                      {[
                        { value: "junior", label: "Júnior" },
                        { value: "pleno", label: "Pleno" },
                        { value: "senior", label: "Sênior" },
                        { value: "trainee", label: "Trainee" }
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`exp-${item.value}`}
                            checked={filters.experience.includes(item.value)}
                            onCheckedChange={() => handleFilterChange('experience', item.value)}
                          />
                          <Label htmlFor={`exp-${item.value}`} className={darkMode ? "text-gray-300" : ""}>
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className={darkMode ? "bg-gray-700" : ""} />

                  {/* Data da Publicação */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Data da Publicação</h3>
                    <div className="space-y-2">
                      {[
                        { value: "24h", label: "Últimas 24h" },
                        { value: "semana", label: "Última semana" },
                        { value: "30dias", label: "Últimos 30 dias" }
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`published-${item.value}`}
                            checked={filters.published.includes(item.value)}
                            onCheckedChange={() => handleFilterChange('published', item.value)}
                          />
                          <Label htmlFor={`published-${item.value}`} className={darkMode ? "text-gray-300" : ""}>
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className={darkMode ? "bg-gray-700" : ""} />

                  {/* Jornada */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Jornada</h3>
                    <div className="space-y-2">
                      {[
                        { value: "full-time", label: "Full-time (tempo integral)" },
                        { value: "part-time", label: "Part-time (meio período)" },
                        { value: "flexivel", label: "Horário flexível" }
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`workload-${item.value}`}
                            checked={filters.workload.includes(item.value)}
                            onCheckedChange={() => handleFilterChange('workload', item.value)}
                          />
                          <Label htmlFor={`workload-${item.value}`} className={darkMode ? "text-gray-300" : ""}>
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className={darkMode ? "bg-gray-700" : ""} />

                  {/* Gênero */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Gênero</h3>
                    <div className="space-y-2">
                      {[
                        { value: "mulher-cis", label: "Mulher cis" },
                        { value: "lgbt", label: "LGBT+" }
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`gender-${item.value}`}
                            checked={filters.gender.includes(item.value)}
                            onCheckedChange={() => handleFilterChange('gender', item.value)}
                          />
                          <Label htmlFor={`gender-${item.value}`} className={darkMode ? "text-gray-300" : ""}>
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="flex-1"
                    >
                      Limpar
                    </Button>
                    <Button 
                      onClick={() => setShowFilters(false)}
                      className="flex-1"
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        {/* Card de Boas-vindas */}
        <div className={`rounded-2xl p-6 sm:p-8 shadow-lg mb-6 sm:mb-8 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Bem-vindo(a),{candidateName}.
              </h1>
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </div>
            </div>
            
            <p className={`text-base sm:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Encontre as melhores oportunidades para sua carreira
            </p>
          </div>
        </div>

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
