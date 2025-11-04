import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function EditCompanyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [benefits, setBenefits] = useState("");
  const [salary, setSalary] = useState("");
  const [workModel, setWorkModel] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("company_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setWorkModel(data.job_type);
        setCity(data.location);
        setSalary(data.salary || "");
        setBenefits(data.requirements || "");
        
        // Parse description to extract fields
        const descParts = data.description.split("\n\n");
        setDescription(descParts[0] || "");
        
        descParts.slice(1).forEach((part: string) => {
          if (part.startsWith("Área: ")) setArea(part.replace("Área: ", ""));
          if (part.startsWith("Experiência: ")) setExperience(part.replace("Experiência: ", ""));
          if (part.startsWith("Período: ")) setPeriod(part.replace("Período: ", ""));
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vaga",
        description: error.message,
        variant: "destructive",
      });
      navigate("/company-jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !area || !benefits || !salary || !workModel || !city || !experience || !period) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          title,
          description: `${description}\n\nÁrea: ${area}\nBenefícios: ${benefits}\nExperiência: ${experience}\nPeríodo: ${period}`,
          job_type: workModel,
          location: city,
          salary,
          requirements: benefits,
        })
        .eq("id", jobId)
        .eq("company_id", user?.id);

      if (error) throw error;

      toast({
        title: "Vaga atualizada!",
        description: "A vaga foi atualizada com sucesso.",
      });

      setTimeout(() => navigate("/company-jobs"), 1500);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar vaga",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <p className={darkMode ? "text-white" : "text-gray-800"}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Editar Vaga
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Título da Vaga
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Descrição da Vaga
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Área
              </label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Benefícios/Informações Extras
              </label>
              <Textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                required
                rows={6}
                className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Piso Salarial
                </label>
                <Input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                  placeholder="Ex: R$ 3.000,00"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Modelo de Trabalho
                </label>
                <Input
                  value={workModel}
                  onChange={(e) => setWorkModel(e.target.value)}
                  required
                  className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                  placeholder="Ex: Remoto, Presencial, Híbrido"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Cidade (se for presencial ou híbrido)
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                  placeholder="Ex: São Paulo - SP"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Experiência Necessária
                </label>
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                  placeholder="Ex: Júnior, Pleno, Sênior"
                />
              </div>
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Período
              </label>
              <Input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                required
                className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                placeholder="Ex: Full-time, Part-time, Freelancer"
              />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="button"
                onClick={() => navigate("/company-jobs")}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-12 py-6 bg-green-300 hover:bg-green-400 text-green-900 font-semibold text-lg rounded-full"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
