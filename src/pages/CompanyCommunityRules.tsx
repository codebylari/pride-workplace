import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Menu, Shield, Users, Heart, AlertCircle, HandshakeIcon, Briefcase, UserCheck } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";

export default function CompanyCommunityRules() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);

  const rules = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Quem Pode Participar",
      description: "A comunidade é destinada apenas a mulheres e pessoas LGBT+. É necessário ter interesse ou atuação na área de TI (trabalhos, freelances ou projetos). Perfis que não se encaixarem nesses critérios não serão aceitos na plataforma."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Respeito e Inclusão",
      description: "Tratamos todos os candidatos com respeito, independentemente de gênero, orientação sexual, raça, religião ou origem. Discriminação não é tolerada."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Compromisso com a Diversidade",
      description: "Empresas na nossa plataforma devem demonstrar compromisso genuíno com a diversidade e inclusão no ambiente de trabalho."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Ambiente de Trabalho Seguro",
      description: "As vagas oferecidas devem garantir um ambiente de trabalho seguro, acolhedor e livre de qualquer forma de discriminação ou assédio."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Vagas Transparentes",
      description: "Todas as informações sobre vagas devem ser verdadeiras e completas: salário, benefícios, requisitos e descrição das atividades."
    },
    {
      icon: <HandshakeIcon className="w-8 h-8" />,
      title: "Processo Seletivo Justo",
      description: "Conduza processos seletivos de forma justa, respeitosa e com feedback aos candidatos. A transparência é essencial."
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Denúncias e Compliance",
      description: "Empresas que violarem as regras da comunidade estarão sujeitas a investigação e possível remoção da plataforma."
    }
  ];

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
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`rounded-3xl p-8 md:p-12 shadow-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🏢</div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Regras da Comunidade para Empresas
            </h1>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Compromisso com inclusão e ética profissional
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {rules.map((rule, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 transition-all border ${darkMode ? "bg-gray-600/50 hover:bg-gray-600 border-gray-500" : "bg-gray-50 hover:bg-gray-100 border-gray-200"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-purple-600 flex-shrink-0">
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {rule.title}
                    </h3>
                    <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`rounded-2xl p-6 mb-8 border ${darkMode ? "bg-orange-900/30 border-orange-700" : "bg-orange-50 border-orange-200"}`}>
            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              ⚠️ Consequências de Violações
            </h3>
            <ul className={`space-y-2 list-disc list-inside ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <li>Primeira violação: Aviso formal e revisão das vagas publicadas</li>
              <li>Segunda violação: Suspensão temporária e impossibilidade de publicar novas vagas</li>
              <li>Violações graves ou repetidas: Banimento permanente da plataforma</li>
              <li>Casos de discriminação comprovada: Remoção imediata sem aviso prévio</li>
            </ul>
          </div>

          <div className={`rounded-2xl p-6 border ${darkMode ? "bg-green-900/30 border-green-700" : "bg-green-50 border-green-200"}`}>
            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              💼 Boas Práticas para Empresas
            </h3>
            <ul className={`space-y-2 list-disc list-inside ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <li>Seja transparente sobre a cultura organizacional e valores da empresa</li>
              <li>Ofereça feedback construtivo aos candidatos após entrevistas</li>
              <li>Mantenha as informações das vagas sempre atualizadas</li>
              <li>Respeite os prazos e compromissos estabelecidos com candidatos</li>
              <li>Promova ativamente a diversidade dentro da sua organização</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
