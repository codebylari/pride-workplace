import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export default function CreateJob() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const companyName = user?.user_metadata?.company_name || "Empresa";

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

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    if (!title || !description || !area || !benefits || !salary || !workModel || !city || !experience || !period) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você salvaria no banco de dados
    // Por enquanto, apenas mostra mensagem de sucesso
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
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 animate-fade-in">
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
            className="absolute left-0 top-0 h-full w-80 shadow-xl text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {companyName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{companyName}</h2>
                  <p className="text-sm text-white/80">empresa</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-dashboard");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/create-job");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Cadastrar Vagas</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-profile");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Meu Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/company-settings");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Configurações</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/support");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Suporte</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/about");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Quem Somos</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/terms-company");
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left"
              >
                <span className="text-lg">Termos de Uso</span>
              </button>
            </nav>

            <div className="p-4 border-t border-white/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg transition text-left text-red-500"
              >
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
              />
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

            {/* Cidade e Experiência Necessária */}
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

            {/* Período */}
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

            {/* Botão de Cadastrar */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="px-12 py-6 bg-green-300 hover:bg-green-400 text-green-900 font-semibold text-lg rounded-full"
              >
                Cadastrar a Vaga
              </Button>
            </div>
          </form>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
