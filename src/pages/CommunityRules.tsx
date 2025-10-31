import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Users, Heart, AlertCircle, HandshakeIcon, UserCheck } from "lucide-react";

export default function CommunityRules() {
  const navigate = useNavigate();

  const rules = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Quem Pode Participar",
      description: "A comunidade é destinada apenas a mulheres e pessoas LGBT+. É necessário ter interesse ou atuação na área de TI (trabalhos, freelances ou projetos). Perfis que não se encaixarem nesses critérios não serão aceitos na plataforma."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Respeito e Inclusão",
      description: "Tratamos todos com respeito, independentemente de gênero, orientação sexual, raça, religião ou origem. Discriminação não é tolerada."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Diversidade e Igualdade",
      description: "Nossa plataforma é dedicada a promover oportunidades para mulheres e a comunidade LGBTQIA+ no mercado de tecnologia."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Ambiente Seguro",
      description: "Mantemos um espaço seguro e acolhedor. Assédio, bullying ou comportamento abusivo resultarão em suspensão imediata."
    },
    {
      icon: <HandshakeIcon className="w-8 h-8" />,
      title: "Honestidade e Transparência",
      description: "Seja honesto em suas informações de perfil, currículos e vagas. A veracidade é fundamental para a confiança da comunidade."
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Denúncias",
      description: "Se você presenciar comportamento inadequado, denuncie imediatamente. Investigamos todas as denúncias com seriedade."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-8 md:p-12 shadow-lg">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-smooth group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar ao Início</span>
        </button>

        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🌈</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Regras da Comunidade
          </h1>
          <p className="text-xl text-gray-700">
            Juntos construímos um espaço inclusivo e respeitoso
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div className="text-purple-600 flex-shrink-0">
                  {rule.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {rule.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            ⚠️ Consequências de Violações
          </h3>
          <ul className="text-gray-700 space-y-2 list-disc list-inside">
            <li>Primeira violação: Aviso formal</li>
            <li>Segunda violação: Suspensão temporária da conta</li>
            <li>Violações graves ou repetidas: Banimento permanente</li>
          </ul>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-success hover:bg-success/90 text-success-foreground py-6 rounded-full text-lg font-semibold px-12 transition-smooth"
          >
            Li e Compreendo as Regras
          </Button>
        </div>
      </div>
    </div>
  );
}
