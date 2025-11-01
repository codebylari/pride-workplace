import { useState } from "react";
import { Menu } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function TermsCompany() {
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);

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
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Termos e Condições de Uso
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Empresas Parceiras
          </p>
          <div className="w-24 h-1 mx-auto mt-6" style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }}></div>
        </div>

        <div className={`rounded-3xl shadow-lg p-8 sm:p-12 space-y-8 border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className={`space-y-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <p className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
              Prezada Empresa,
            </p>

            <p className="leading-relaxed">
              O cadastro e a participação nesta plataforma representam um compromisso institucional com a promoção de um ambiente de trabalho inclusivo, justo e respeitoso. Ao aceitar os presentes termos, sua organização passa a integrar uma rede que reconhece e valoriza a diversidade, comprometendo-se com a oferta de oportunidades seguras e igualitárias para mulheres e pessoas da comunidade LGBTIAPN+.
            </p>
          </div>

          <div className={`h-px ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}></div>

          <div className="space-y-8">
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                1. Compromisso com a Inclusão e o Respeito
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                A empresa declara que todas as vagas divulgadas e as interações realizadas dentro da plataforma estarão em conformidade com os princípios de inclusão, igualdade e respeito à diversidade. É expressamente vedada a publicação de anúncios discriminatórios, o uso de linguagem preconceituosa ou a imposição de restrições que não possuam justificativa técnica ou legal.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                2. Conduta Ética e Profissional
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                A comunicação com os candidatos deve ser conduzida com ética, transparência e profissionalismo em todas as etapas do processo seletivo. A empresa reconhece que cada candidato possui uma trajetória única e merece ser tratado com consideração e respeito durante todo o processo de recrutamento e seleção.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                3. Transparência nas Oportunidades Oferecidas
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                A empresa compromete-se a fornecer descrições de vagas completas, claras e verdadeiras, incluindo informações essenciais como: título do cargo, principais atribuições, requisitos obrigatórios e desejáveis, tipo de contratação, faixa salarial ou remuneração, benefícios oferecidos e modalidade de trabalho (presencial, remoto ou híbrido). É proibido o uso da plataforma para fins diversos da oferta legítima de oportunidades de trabalho.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                4. Valorização da Diversidade
              </h2>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Ao utilizar esta plataforma, a empresa reconhece estar em um espaço dedicado ao fortalecimento de grupos historicamente marginalizados no mercado de trabalho. Compromete-se, portanto, não apenas a respeitar, mas também a promover ativamente a participação de mulheres e pessoas LGBTIAPN+ em seus processos seletivos, contribuindo para a construção de um mercado de trabalho mais equitativo e diverso.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                5. Responsabilidade e Conformidade Legal
              </h2>
              <p className={`leading-relaxed mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                A empresa deve manter seus dados cadastrais atualizados e disponibilizar informações institucionais verificáveis (tais como CNPJ ativo e identificação do representante legal). O descumprimento dos princípios e normas estabelecidos nestes termos poderá resultar em advertência, suspensão temporária ou exclusão definitiva da conta, sem prejuízo das medidas legais cabíveis.
              </p>
              <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Ao prosseguir com o cadastro, a empresa declara ter lido, compreendido e aceito integralmente todos os termos aqui estabelecidos, assumindo o compromisso de manter um ambiente profissional seguro, respeitoso e inclusivo dentro da plataforma.
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
