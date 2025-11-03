import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanySidebar } from "@/components/CompanySidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ChatBot } from "@/components/ChatBot";

interface Testimonial {
  id: string;
  candidate_id: string;
  job_title: string;
  comment: string;
  status: string;
  created_at: string;
  candidate?: {
    full_name: string;
    photo_url: string | null;
  };
}

export default function CompanyTestimonials() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      let query = supabase
        .from("testimonials")
        .select("*")
        .eq("company_id", user.id);

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar dados dos candidatos
      const testimonialsWithCandidates = await Promise.all(
        (data || []).map(async (testimonial) => {
          const { data: candidateData } = await supabase
            .from("profiles")
            .select("full_name, photo_url")
            .eq("id", testimonial.candidate_id)
            .single();

          return {
            ...testimonial,
            candidate: candidateData || { full_name: "Candidato", photo_url: null },
          };
        })
      );

      setTestimonials(testimonialsWithCandidates);
    } catch (error) {
      console.error("Erro ao carregar depoimentos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os depoimentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (testimonialId: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ status: newStatus })
        .eq("id", testimonialId);

      if (error) throw error;

      toast({
        title: newStatus === "approved" ? "Depoimento Aprovado" : "Depoimento Rejeitado",
        description: newStatus === "approved" 
          ? "O depoimento agora está visível no seu perfil público"
          : "O depoimento foi rejeitado e não aparecerá no perfil",
      });

      fetchTestimonials();
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Carregando depoimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      <CompanySidebar showSidebar={sidebarOpen} setShowSidebar={setSidebarOpen} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Depoimentos
          </h1>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Gerencie os depoimentos dos candidatos que trabalharam na sua empresa
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Todos
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
            className={filter === "approved" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Aprovados
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            onClick={() => setFilter("rejected")}
            className={filter === "rejected" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Rejeitados
          </Button>
        </div>

        {/* Lista de Depoimentos */}
        {testimonials.length === 0 ? (
          <Card className={`p-12 text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Nenhum depoimento {filter !== "all" ? filter : "encontrado"}.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className={`p-6 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    {testimonial.candidate?.photo_url ? (
                      <img
                        src={testimonial.candidate.photo_url}
                        alt={testimonial.candidate.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                        {testimonial.candidate?.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {testimonial.candidate?.full_name}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {testimonial.job_title}
                      </p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        {new Date(testimonial.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(testimonial.status)}
                </div>

                <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {testimonial.comment}
                </p>

                {testimonial.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(testimonial.id, "approved")}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(testimonial.id, "rejected")}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeitar
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
}