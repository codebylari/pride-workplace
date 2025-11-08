import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Áreas da tecnologia
const techAreas = [
  "Desenvolvimento Web",
  "Desenvolvimento Mobile",
  "DevOps",
  "Data Science",
  "Inteligência Artificial",
  "Machine Learning",
  "Banco de Dados",
  "Segurança da Informação",
  "UI/UX Design",
  "Cloud Computing",
  "Quality Assurance (QA)",
  "Suporte Técnico",
  "Análise de Sistemas",
  "Gestão de Projetos",
  "Infraestrutura de TI",
];

// Cidades por estado
const citiesByState: Record<string, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
  AL: ["Maceió", "Arapiraca", "Palmeira dos Índios"],
  AP: ["Macapá", "Santana", "Laranjal do Jari"],
  AM: ["Manaus", "Parintins", "Itacoatiara"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Ilhéus"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Sobral"],
  DF: ["Brasília"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde"],
  MA: ["São Luís", "Imperatriz", "São José de Ribamar", "Timon"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá"],
  PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru"],
  PI: ["Teresina", "Parnaíba", "Picos", "Floriano"],
  RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
  RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Cacoal"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó"],
  SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santos", "Ribeirão Preto"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional"],
};

export default function CompanyCreateJob() {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyState, setCompanyState] = useState<string>("");
  const [companyCity, setCompanyCity] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);

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

  // Buscar estado e cidade da empresa
  useEffect(() => {
    const fetchCompanyLocation = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("company_profiles")
        .select("state, city")
        .eq("user_id", user.id)
        .single();

      if (data) {
        if (data.state) {
          setCompanyState(data.state);
          setAvailableCities(citiesByState[data.state] || []);
        }
        if (data.city) {
          setCompanyCity(data.city);
        }
      }
    };

    fetchCompanyLocation();
  }, [user]);

  // Atualizar cidade automaticamente quando modelo de trabalho mudar
  useEffect(() => {
    if (workModel === "Presencial" || workModel === "Híbrido") {
      setCity(companyCity);
    } else if (workModel === "Remoto") {
      setCity("Remoto");
    }
  }, [workModel, companyCity]);

  // Verificar autenticação e role
  useEffect(() => {
    if (!loading && (!user || userRole !== "company")) {
      toast({
        title: "Acesso negado",
        description: "Apenas empresas podem cadastrar vagas.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, userRole, loading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de autenticação
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar uma vaga.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Validação de campos obrigatórios
    if (!title || !description || !area || !benefits || !salary || !workModel || !city || !experience || !period) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from("jobs").insert({
        company_id: user.id,
        title: title.trim(),
        description: `${description.trim()}\n\nÁrea: ${area.trim()}\nBenefícios: ${benefits.trim()}\nExperiência: ${experience.trim()}\nPeríodo: ${period.trim()}`,
        job_type: workModel.trim(),
        location: city.trim(),
        salary: salary.trim(),
        requirements: benefits.trim(),
      }).select();

      if (error) {
        console.error("Erro ao cadastrar vaga:", error);
        throw error;
      }

      toast({
        title: "Vaga cadastrada!",
        description: "A vaga foi cadastrada com sucesso.",
      });

      // Limpar formulário
      setTitle("");
      setDescription("");
      setArea("");
      setBenefits("");
      setSalary("");
      setWorkModel("");
      setCity("");
      setExperience("");
      setPeriod("");

      // Redirecionar para lista de vagas
      setTimeout(() => navigate("/company-jobs"), 1500);
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      
      let errorMessage = "Erro ao cadastrar vaga. Tente novamente.";
      
      if (error.message?.includes("permission denied")) {
        errorMessage = "Você não tem permissão para cadastrar vagas. Verifique se está logado como empresa.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao cadastrar vaga",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Cadastrar Vagas
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título da Vaga */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Título da Vaga
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`${darkMode ? "bg-gray-700 text-white border-gray-600" : "border-blue-400"} focus:border-blue-500 focus:ring-blue-500`}
              />
            </div>

            {/* Descrição da Vaga */}
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

            {/* Área */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Área
              </label>
              <Select value={area} onValueChange={setArea} required>
                <SelectTrigger className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white dark:bg-gray-700">
                  {techAreas.map((techArea) => (
                    <SelectItem key={techArea} value={techArea}>
                      {techArea}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Benefícios/Informações Extras */}
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

            {/* Piso Salarial e Modelo de Trabalho */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Piso Salarial
                </label>
                <Input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                  placeholder="3000"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Modelo de Trabalho
                </label>
                <Select value={workModel} onValueChange={setWorkModel} required>
                  <SelectTrigger className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white dark:bg-gray-700">
                    <SelectItem value="Remoto">Remoto</SelectItem>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cidade e Experiência Necessária */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Cidade {(workModel === "Presencial" || workModel === "Híbrido") && "(Localização da empresa)"}
                </label>
                <Input
                  value={city}
                  disabled={true}
                  onChange={(e) => setCity(e.target.value)}
                  required={workModel === "Presencial" || workModel === "Híbrido"}
                  className={`${darkMode ? "bg-gray-700 text-white border-gray-600" : ""} opacity-70 cursor-not-allowed`}
                  placeholder="Selecione o modelo de trabalho primeiro"
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

            {/* Período */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Tipo de Contratação
              </label>
              <Select value={period} onValueChange={setPeriod} required>
                <SelectTrigger className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white dark:bg-gray-700">
                  <SelectItem value="CLT - Full-time">CLT - Full-time</SelectItem>
                  <SelectItem value="CLT - Part-time">CLT - Part-time</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                  <SelectItem value="PJ">PJ (Pessoa Jurídica)</SelectItem>
                  <SelectItem value="Estágio">Estágio</SelectItem>
                  <SelectItem value="Temporário">Temporário</SelectItem>
                  <SelectItem value="Contrato">Contrato por tempo determinado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão de Cadastrar */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-6 bg-green-300 hover:bg-green-400 text-green-900 font-semibold text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar a Vaga"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
