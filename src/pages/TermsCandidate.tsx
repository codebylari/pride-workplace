import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function TermsCandidate() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  

  const userName = user?.user_metadata?.full_name || "Usuário";


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

      {/* Main Content */}
      <main className="container mx-auto px-8 py-12 max-w-5xl">
        <h1 className={`text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
          <span className="text-red-500">📌</span>
          Termos e Condições – Candidatos
        </h1>

        <div className={`rounded-lg shadow-sm p-8 space-y-6 text-justify leading-relaxed ${darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-700"}`}>
          <p className="font-semibold">Bem-vindo(a)!!</p>

          <p>
            Este é um espaço criado especialmente para mulheres e pessoas da comunidade LGBT+, com o objetivo de promover conexões profissionais seguras, respeitosas e transformadoras. Ao aceitar estes Termos, você se une a uma rede que acredita no poder da diversidade e no valor da sua trajetória.
          </p>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>1. Um Ambiente Acolhedor e Seguro</h2>
            <p>
              Nosso compromisso é oferecer um espaço livre de preconceito, onde cada pessoa possa se apresentar de forma autêntica, sem medo de julgamento. Esta é uma plataforma feita para apoiar quem deseja mostrar sua história, suas habilidades e seu potencial profissional.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>2. Responsabilidade nas Informações Prestadas</h2>
            <p>
              Ao criar seu perfil, é essencial que os dados fornecidos sejam verdadeiros e representem sua experiência e formação de maneira transparente. Informações falsas, plágio de currículos ou tentativas de se passar por outra pessoa não serão toleradas e podem resultar na exclusão da conta.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>3. Respeito na Comunicação</h2>
            <p>
              Todas as interações com empresas ou outros participantes devem ser pautadas pela cordialidade, respeito e profissionalismo. Acreditamos que oportunidades surgem de diálogos saudáveis, e que cada conversa é também uma forma de aprendizado e troca.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>4. Confidencialidade e Segurança</h2>
            <p>
              Seus dados pessoais sensíveis (como CPF, endereço ou telefone) não serão exibidos em seu perfil público. Toda comunicação deve ocorrer dentro da própria plataforma, garantindo maior proteção tanto para você quanto para a empresa.
            </p>
          </div>

          <div>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>5. Valorização da Jornada</h2>
            <p>
              Seu perfil é o reflexo da sua caminhada: suas formações, suas experiências, suas conquistas. Aqui você terá espaço para mostrar quem é profissionalmente e como chegou até aqui. Acreditamos que cada trajetória importa, e é por isso que a sua história tem lugar especial na nossa rede.
            </p>
            <p>
              Ao continuar, você declara estar de acordo com os termos acima e reafirma seu compromisso em construir, junto com outras pessoas, uma comunidade profissional inclusiva, respeitosa e transformadora.
            </p>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
