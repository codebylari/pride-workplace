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
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Termos e Condições de Uso
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Candidatos
          </p>
          <div className="w-24 h-1 mx-auto mt-6" style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }}></div>
        </div>

        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 space-y-8 border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className={`space-y-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <p className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
              Prezado(a) Candidato(a),
            </p>

            <p className="leading-relaxed">
              A presente plataforma foi desenvolvida com o propósito de promover conexões profissionais seguras, respeitosas e transformadoras, destinadas especialmente a mulheres e pessoas da comunidade LGBTIAPN+. Ao utilizar nossos serviços, você declara ter lido, compreendido e aceito integralmente os termos e condições aqui estabelecidos.
            </p>
          </div>

          <div className={`h-px ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}></div>

          <div className="space-y-8">
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                1. Ambiente Seguro e Inclusivo
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Comprometemo-nos a oferecer um ambiente livre de discriminação, no qual cada pessoa possa se apresentar de forma autêntica e profissional. Esta plataforma foi concebida para apoiar a valorização de sua história, habilidades e potencial no mercado de trabalho.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                2. Veracidade das Informações
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                O candidato declara que todos os dados fornecidos em seu perfil são verdadeiros, precisos e atualizados, representando de forma fidedigna sua experiência profissional e formação acadêmica. A prestação de informações falsas, plágio de currículos ou tentativa de falsidade ideológica resultará na exclusão imediata da conta, sem prejuízo das medidas legais cabíveis.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                3. Conduta Profissional
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Todas as interações realizadas na plataforma devem ser pautadas pelos princípios de cordialidade, respeito mútuo e profissionalismo. O candidato compromete-se a manter comunicação adequada e ética com as empresas e demais usuários.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                4. Proteção de Dados e Privacidade
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Seus dados pessoais sensíveis (CPF, endereço residencial completo, telefone pessoal) não serão exibidos publicamente. Toda comunicação entre candidatos e empresas deve ocorrer preferencialmente dentro da plataforma, garantindo maior segurança e rastreabilidade das interações.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                5. Direitos e Responsabilidades
              </h2>
              <p className={`leading-relaxed mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                O candidato possui o direito de atualizar, modificar ou excluir seu perfil a qualquer momento. É de sua responsabilidade manter suas informações atualizadas e garantir que seu perfil reflita adequadamente suas qualificações profissionais.
              </p>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Ao prosseguir, você declara estar ciente e de acordo com todos os termos aqui estabelecidos, comprometendo-se a contribuir para a construção de uma comunidade profissional inclusiva, respeitosa e transformadora.
              </p>
            </section>
          </div>

          <div className={`h-px ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}></div>

          <div className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p>Última atualização: Janeiro de 2025</p>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
