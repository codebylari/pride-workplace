import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Building2, FileText, LogOut, TrendingUp, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { StatsCard } from "@/components/admin/StatsCard";
import { GrowthChart } from "@/components/admin/GrowthChart";
import { JobsDistributionChart } from "@/components/admin/JobsDistributionChart";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { SystemAlerts } from "@/components/admin/SystemAlerts";
import { ApplicationsRateChart } from "@/components/admin/ApplicationsRateChart";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userRole, loading, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    avgApplicationsPerJob: 0,
  });

  const [growthData, setGrowthData] = useState<Array<{ month: string; candidatos: number; empresas: number }>>([]);
  const [jobsDistribution, setJobsDistribution] = useState<Array<{ name: string; value: number }>>([]);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [applicationsRate, setApplicationsRate] = useState<Array<{ name: string; candidaturas: number; vagas: number }>>([]);

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      navigate("/");
      return;
    }

    if (userRole === "admin") {
      fetchStats();
    }
  }, [userRole, loading, navigate]);

  const fetchStats = async () => {
    try {
      // Fetch basic counts
      const [candidates, companies, jobs, applications] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("company_profiles").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }),
      ]);

      const totalJobs = jobs.count || 0;
      const totalApplications = applications.count || 0;

      setStats({
        totalCandidates: candidates.count || 0,
        totalCompanies: companies.count || 0,
        totalJobs,
        totalApplications,
        activeJobs: totalJobs,
        avgApplicationsPerJob: totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0,
      });

      // Fetch growth data (last 6 months)
      await fetchGrowthData();
      
      // Fetch jobs distribution by type
      await fetchJobsDistribution();
      
      // Fetch recent activity
      await fetchRecentActivity();
      
      // Fetch applications rate
      await fetchApplicationsRate();
      
      // Generate system alerts
      generateSystemAlerts(totalJobs, totalApplications);
      
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchGrowthData = async () => {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const [candidatesData, companiesData] = await Promise.all([
        supabase
          .from("profiles")
          .select("created_at")
          .gte("created_at", sixMonthsAgo.toISOString()),
        supabase
          .from("company_profiles")
          .select("created_at")
          .gte("created_at", sixMonthsAgo.toISOString()),
      ]);

      // Group by month
      const monthlyData: { [key: string]: { candidatos: number; empresas: number } } = {};
      
      const formatMonth = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      };

      candidatesData.data?.forEach((item) => {
        const month = formatMonth(new Date(item.created_at));
        if (!monthlyData[month]) monthlyData[month] = { candidatos: 0, empresas: 0 };
        monthlyData[month].candidatos++;
      });

      companiesData.data?.forEach((item) => {
        const month = formatMonth(new Date(item.created_at));
        if (!monthlyData[month]) monthlyData[month] = { candidatos: 0, empresas: 0 };
        monthlyData[month].empresas++;
      });

      const chartData = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      }));

      setGrowthData(chartData);
    } catch (error) {
      console.error("Error fetching growth data:", error);
    }
  };

  const fetchJobsDistribution = async () => {
    try {
      const { data: jobs } = await supabase
        .from("jobs")
        .select("job_type");

      const distribution: { [key: string]: number } = {};
      
      jobs?.forEach((job) => {
        const type = job.job_type || "Outros";
        distribution[type] = (distribution[type] || 0) + 1;
      });

      const chartData = Object.entries(distribution).map(([name, value]) => ({
        name,
        value,
      }));

      setJobsDistribution(chartData);
    } catch (error) {
      console.error("Error fetching jobs distribution:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const [candidates, companies, jobs] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, created_at, photo_url")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("company_profiles")
          .select("user_id, fantasy_name, created_at, logo_url")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("jobs")
          .select("id, title, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setRecentCandidates(
        candidates.data?.map((c) => ({
          id: c.id,
          name: c.full_name,
          type: 'candidate',
          created_at: c.created_at,
          photo_url: c.photo_url,
        })) || []
      );

      setRecentCompanies(
        companies.data?.map((c) => ({
          id: c.user_id,
          name: c.fantasy_name,
          type: 'company',
          created_at: c.created_at,
          logo_url: c.logo_url,
        })) || []
      );

      setRecentJobs(
        jobs.data?.map((j) => ({
          id: j.id,
          name: j.title,
          type: 'job',
          created_at: j.created_at,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const fetchApplicationsRate = async () => {
    try {
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title, applications(id)")
        .limit(10);

      const chartData = (jobs || []).map((job: any) => ({
        name: job.title.substring(0, 20) + (job.title.length > 20 ? '...' : ''),
        candidaturas: job.applications?.length || 0,
        vagas: 1,
      }));

      setApplicationsRate(chartData);
    } catch (error) {
      console.error("Error fetching applications rate:", error);
    }
  };

  const generateSystemAlerts = (totalJobs: number, totalApplications: number) => {
    const alerts = [];

    if (totalJobs === 0) {
      alerts.push({
        id: '1',
        type: 'warning' as const,
        message: 'Nenhuma vaga cadastrada no sistema.',
      });
    }

    if (totalApplications === 0) {
      alerts.push({
        id: '2',
        type: 'info' as const,
        message: 'Ainda não há candidaturas registradas.',
      });
    }

    if (totalJobs > 0 && totalApplications / totalJobs < 2) {
      alerts.push({
        id: '3',
        type: 'warning' as const,
        message: `Baixa taxa de candidaturas (${(totalApplications / totalJobs).toFixed(1)} por vaga). Considere promover as vagas.`,
      });
    }

    setSystemAlerts(alerts);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard Administrativo</h1>
            <p className="text-muted-foreground">Visão geral da plataforma Linka+</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Candidatos"
            value={stats.totalCandidates}
            description="Total de candidatos cadastrados"
            icon={Users}
            onClick={() => navigate("/admin-candidates")}
          />
          <StatsCard
            title="Empresas"
            value={stats.totalCompanies}
            description="Total de empresas cadastradas"
            icon={Building2}
            onClick={() => navigate("/admin-companies")}
          />
          <StatsCard
            title="Vagas Ativas"
            value={stats.activeJobs}
            description="Vagas publicadas no momento"
            icon={Briefcase}
            onClick={() => navigate("/admin-jobs")}
          />
          <StatsCard
            title="Candidaturas"
            value={stats.totalApplications}
            description="Total de candidaturas"
            icon={FileText}
            onClick={() => navigate("/admin-applications")}
          />
        </div>


        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            title="Média de Candidaturas"
            value={stats.avgApplicationsPerJob}
            description="Candidaturas por vaga"
            icon={TrendingUp}
          />
          <StatsCard
            title="Taxa de Conversão"
            value={`${stats.totalJobs > 0 ? ((stats.totalApplications / stats.totalJobs) * 100).toFixed(1) : 0}%`}
            description="Candidaturas vs. vagas abertas"
            icon={UserCheck}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GrowthChart data={growthData} />
          <JobsDistributionChart data={jobsDistribution} />
        </div>

        {/* Applications Rate Chart */}
        <ApplicationsRateChart data={applicationsRate} />

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentActivity
            title="Últimos Candidatos"
            items={recentCandidates}
            onViewAll={() => navigate("/admin-candidates")}
          />
          <RecentActivity
            title="Últimas Empresas"
            items={recentCompanies}
            onViewAll={() => navigate("/admin-companies")}
          />
          <RecentActivity
            title="Últimas Vagas"
            items={recentJobs}
            onViewAll={() => navigate("/admin-jobs")}
          />
        </div>

        {/* System Alerts */}
        <SystemAlerts alerts={systemAlerts} />
      </div>
    </div>
  );
}
