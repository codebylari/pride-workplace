import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "@/components/JobCard";
import AddJobDialog from "@/components/AddJobDialog";
import SearchBar from "@/components/SearchBar";
import { Heart, Briefcase, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Index = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);
  // Mock data - em uma aplicação real, isso viria de uma API/banco
  const jobs = [
    {
      title: "Desenvolvedor(a) Full Stack",
      company: "TechPride Solutions",
      location: "São Paulo, SP (Remoto)",
      type: "CLT",
      description: "Buscamos profissional para integrar nosso time diverso e inclusivo. Experiência com React, Node.js e bancos de dados.",
      postedAt: "2 dias atrás",
      tags: ["React", "Node.js", "TypeScript", "Remote"],
    },
    {
      title: "Designer UX/UI Pleno",
      company: "Rainbow Design Co.",
      location: "Rio de Janeiro, RJ",
      type: "PJ",
      description: "Empresa certificada em diversidade busca designer criativo para projetos inovadores. Domínio de Figma e Adobe XD.",
      postedAt: "1 semana atrás",
      tags: ["Figma", "Adobe XD", "UX Design", "Híbrido"],
    },
    {
      title: "Analista de Marketing Digital",
      company: "Diversity Media Group",
      location: "Belo Horizonte, MG",
      type: "CLT",
      description: "Oportunidade para profissional criativo em empresa que valoriza a diversidade. Experiência com redes sociais e SEO.",
      postedAt: "3 dias atrás",
      tags: ["Marketing", "SEO", "Social Media", "Presencial"],
    },
    {
      title: "Engenheiro(a) de Dados",
      company: "DataPride Analytics",
      location: "Florianópolis, SC",
      type: "CLT",
      description: "Empresa inclusiva busca profissional para arquitetura de dados. Python, SQL e experiência com cloud.",
      postedAt: "5 dias atrás",
      tags: ["Python", "SQL", "AWS", "Remote"],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border/50">
          <SidebarContent>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-8 h-8 text-primary fill-primary" />
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  QueerCode
                </h1>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Briefcase className="h-4 w-4" />
                      <span>Vagas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-6">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border/50 bg-background sticky top-0 z-50">
            <div className="px-6 py-4 flex justify-between items-center">
              <SidebarTrigger />
              {userRole === "company" && <AddJobDialog />}
            </div>
          </header>

      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Oportunidades para Todos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conectando talentos LGBTQIA+ com empresas inclusivas e diversas
          </p>
          <div className="pt-6">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">Vagas em Destaque</h3>
            <p className="text-muted-foreground">
              {jobs.length} oportunidades disponíveis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>
      </section>

          {/* Footer */}
          <footer className="border-t border-border/50 bg-background mt-auto">
            <div className="px-6 py-8 text-center text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> para a comunidade LGBTQIA+
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
