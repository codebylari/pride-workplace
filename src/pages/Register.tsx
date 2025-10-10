import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Etapas do cadastro
  const [step, setStep] = useState(1);

  // Campos principais
  const [role, setRole] = useState<"candidate" | "company" | "">("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [experience, setExperience] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [independent, setIndependent] = useState("");
  const [incomeEstimate, setIncomeEstimate] = useState("");
  const [reason, setReason] = useState("");
  const [availability, setAvailability] = useState("");
  const [remoteProjects, setRemoteProjects] = useState("");
  const [contactMethod, setContactMethod] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Campos de empresa
  const [fantasyName, setFantasyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");

  const [loading, setLoading] = useState(false);

  // Verifica sessão ativa
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    checkSession();
  }, [navigate]);

  // Cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role,
            gender,
            orientation,
            experience,
            experienceYears,
            areas,
            independent,
            incomeEstimate,
            reason,
            availability,
            remoteProjects,
            contactMethod,
          },
        },
      });

      if (error) throw error;

      if (data.user && role === "company") {
        const { error: companyError } = await supabase.from("company_profiles").insert({
          user_id: data.user.id,
          fantasy_name: fantasyName,
          cnpj,
          description,
          sector,
        });
        if (companyError) throw companyError;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Você já pode fazer login na plataforma.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------- TELAS ---------
  const Step1 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Quem é você na nossa plataforma?
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div onClick={() => setRole("candidate")} className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${role === "candidate" ? "bg-green-300 text-black" : "bg-white/20 text-white"}`}>
          <p className="text-5xl mb-2">👩‍💻</p>
          <p className="font-semibold">Sou um(a) candidato(a)</p>
        </div>
        <div onClick={() => setRole("company")} className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${role === "company" ? "bg-green-300 text-black" : "bg-white/20 text-white"}`}>
          <p className="text-5xl mb-2">🏢</p>
          <p className="font-semibold">Sou uma empresa</p>
        </div>
      </div>
      <Button onClick={() => role && setStep(2)} disabled={!role} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  const Step2 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Com qual gênero você se identifica?
      </h2>
      <div className="flex flex-col gap-4">
        {["Mulher", "Homem", "Pessoa não binária", "Prefiro não informar"].map(option => (
          <Button
            key={option}
            variant="outline"
            onClick={() => setGender(option)}
            className={`py-6 rounded-full text-lg font-semibold ${gender === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
          >
            {option}
          </Button>
        ))}
      </div>
      <Button onClick={() => gender && setStep(2.5)} disabled={!gender} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  // Tela de orientação sexual para verificar se pode continuar
  const Step2_5 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Com qual orientação sexual você se identifica?
      </h2>
      <div className="flex flex-col gap-4">
        {["Heterossexual", "Homossexual", "Bissexual", "Outro", "Prefiro não informar"].map(option => (
          <Button
            key={option}
            variant="outline"
            onClick={() => setOrientation(option)}
            className={`py-6 rounded-full text-lg font-semibold ${orientation === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
          >
            {option}
          </Button>
        ))}
      </div>
      {gender === "Homem" && orientation === "Heterossexual" && (
        <p className="text-red-400 text-center font-semibold mt-4">
          Desculpe, esta plataforma é somente para mulheres e pessoas da comunidade LGBTQIA+.
        </p>
      )}
      <Button
        onClick={() => orientation && setStep(3)}
        disabled={!orientation || (gender === "Homem" && orientation === "Heterossexual")}
        className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10"
      >
        PRÓXIMO
      </Button>
    </div>
  );

  const Step3 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Qual sua experiência no mercado de trabalho?
      </h2>
      <div className="flex flex-col gap-4">
        {["<1 ano de experiência", "1 a 2 anos de experiência", "3 a 5 anos de experiência", ">6 anos de experiência"].map(option => (
          <Button
            key={option}
            variant="outline"
            onClick={() => setExperienceYears(option)}
            className={`py-6 rounded-full text-lg font-semibold ${experienceYears === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
          >
            {option}
          </Button>
        ))}
      </div>
      <Button onClick={() => experienceYears && setStep(4)} disabled={!experienceYears} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  const Step4 = () => {
    const areasOptions = [
      "Ciências de Dados","Testes","Cibersegurança","Infraestrutura",
      "Desenvolvimento de Software","Blockchain","Inteligência Artificial",
      "Arquitetura","Engenharia de Dados","Suporte Técnico","Design",
      "Análise de Dados","Nuvens","Outros"
    ];

    return (
      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-3xl font-bold text-center text-white">
          Selecione suas áreas de especialização
        </h2>
        <div className="flex flex-col gap-2">
          {areasOptions.map(area => (
            <Label key={area} className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                value={area}
                checked={areas.includes(area)}
                onChange={(e) => {
                  if(e.target.checked) setAreas([...areas, area]);
                  else setAreas(areas.filter(a => a !== area));
                }}
              />
              <span>{area}</span>
            </Label>
          ))}
        </div>
        <Button onClick={() => areas.length > 0 && setStep(5)} disabled={areas.length === 0} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
          PRÓXIMO
        </Button>
      </div>
    );
  };

  const Step5 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Tenho maior facilidade em desempenhar minhas atividades de forma independente do que em trabalho em equipe
      </h2>
      {["Sim", "Talvez", "Não"].map(option => (
        <Button
          key={option}
          variant="outline"
          onClick={() => setIndependent(option)}
          className={`py-6 rounded-full text-lg font-semibold ${independent === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
        >
          {option}
        </Button>
      ))}
      <Button onClick={() => independent && setStep(6)} disabled={!independent} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  const Step6 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Qual estimativa de ganhos projeta para atividades independentes?
      </h2>
      {["Menos de 1500 R$", "1500 - 2000 R$", ">2000 R$", "Sem especificação"].map(option => (
        <Button
          key={option}
          variant="outline"
          onClick={() => setIncomeEstimate(option)}
          className={`py-6 rounded-full text-lg font-semibold ${incomeEstimate === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
        >
          {option}
        </Button>
      ))}
      <Button onClick={() => incomeEstimate && setStep(7)} disabled={!incomeEstimate} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  const Step7 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Tem alguma razão específica para estar buscando trabalho extra?
      </h2>
      {["Rendimento Extra", "Mudar para um novo local", "Transição para trabalho remoto", "Desenvolvimento de novas competências", "Outros"].map(option => (
        <Button
          key={option}
          variant="outline"
          onClick={() => setReason(option)}
          className={`py-6 rounded-full text-lg font-semibold ${reason === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
        >
          {option}
        </Button>
      ))}
      <Button onClick={() => reason && setStep(8)} disabled={!reason} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  const Step8 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Qual sua disposição para o trabalho extra?
      </h2>
      {["<2 horas / semana","2-4 horas / semana","4-8 horas / semana",">8 horas por semana","Sem especificação"].map(option => (
        <Button
          key={option}
          variant="outline"
          onClick={() => setAvailability(option)}
          className={`py-6 rounded-full text-lg font-semibold ${availability === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
        >
          {option}
        </Button>
      ))}
      <Button onClick={() => availability && setStep(9)} disabled={!availability} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  const Step9 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Busco oportunidades de projetos remotos ao redor do mundo
      </h2>
      {["Sim","Não","Talvez"].map(option => (
        <Button
          key={option}
          variant="outline"
          onClick={() => setRemoteProjects(option)}
          className={`py-6 rounded-full text-lg font-semibold ${remoteProjects === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
        >
          {option}
        </Button>
      ))}
      <Button onClick={() => remoteProjects && setStep(10)} disabled={!remoteProjects} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  const Step10 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Qual sua melhor forma de contato?
      </h2>
      {["Ligação","Whatsapp","Email"].map(option => (
        <Button
          key={option}
          variant="outline"
          onClick={() => setContactMethod(option)}
          className={`py-6 rounded-full text-lg font-semibold ${contactMethod === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"}`}
        >
          {option}
        </Button>
      ))}
      <Button onClick={() => contactMethod && setStep(11)} disabled={!contactMethod} className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10">
        PRÓXIMO
      </Button>
    </div>
  );

  // --------- TELA FINAL: Cadastro ---------
  const Step11 = () => (
    <form onSubmit={handleRegister} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Última etapa: preencha seus dados
      </h2>
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-white text-sm">Nome Completo</label>
          <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-white/90 rounded-xl py-6 text-gray-800" />
        </div>
        <div>
          <label className="text-white text-sm">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/90 rounded-xl py-6 text-gray-800" />
        </div>
        <div>
          <label className="text-white text-sm">Senha</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-white/90 rounded-xl py-6 text-gray-800"
          />
        </div>

        {role === "company" && (
          <>
            <div>
              <label className="text-white text-sm">Nome Fantasia</label>
              <Input
                type="text"
                value={fantasyName}
                onChange={(e) => setFantasyName(e.target.value)}
                required
                className="bg-white/90 rounded-xl py-6 text-gray-800"
              />
            </div>
            <div>
              <label className="text-white text-sm">CNPJ</label>
              <Input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
                className="bg-white/90 rounded-xl py-6 text-gray-800"
              />
            </div>
            <div>
              <label className="text-white text-sm">Setor</label>
              <Input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="bg-white/90 rounded-xl py-6 text-gray-800"
              />
            </div>
            <div>
              <label className="text-white text-sm">Descrição</label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/90 rounded-xl py-6 text-gray-800"
              />
            </div>
          </>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold"
      >
        {loading ? "Cadastrando..." : "FINALIZAR CADASTRO"}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="QueerCode Logo" className="w-40 h-auto mb-4" />
        </div>
        {/* Renderização condicional das etapas */}
        {step === 1 && <Step1 />}
        {step === 2 && role === "candidate" && <Step2 />}
        {step === 2.5 && role === "candidate" && <Step2_5 />}
        {step === 3 && role === "candidate" && <Step3 />}
        {step === 4 && role === "candidate" && <Step4 />}
        {step === 5 && role === "candidate" && <Step5 />}
        {step === 6 && role === "candidate" && <Step6 />}
        {step === 7 && role === "candidate" && <Step7 />}
        {step === 8 && role === "candidate" && <Step8 />}
        {step === 9 && role === "candidate" && <Step9 />}
        {step === 10 && role === "candidate" && <Step10 />}
        {step === 11 && <Step11 />}
      </div>
    </div>
  );
}