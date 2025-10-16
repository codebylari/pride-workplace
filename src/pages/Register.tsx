import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";


export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ------------------- ESTADOS -------------------
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"candidate" | "company" | "">("");
  const [loading, setLoading] = useState(false);

  // ------------------- CAMPOS COMUNS -------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // ------------------- VERIFICA SESSÃO -------------------
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    checkSession();
  }, [navigate]);

  // ------------------- CADASTRO -------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName, role },
        },
      });

      if (error) throw error;

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

  // ------------------- STEP 1 (ESCOLHA) -------------------
  const Step1 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Quem é você na nossa plataforma?
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div
          onClick={() => setRole("candidate")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${
            role === "candidate"
              ? "bg-green-300 text-black"
              : "bg-white/20 text-white"
          }`}
        >
          <p className="text-5xl mb-2">👩‍💻</p>
          <p className="font-semibold">Sou um(a) candidato(a)</p>
        </div>

        <div
          onClick={() => setRole("company")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${
            role === "company"
              ? "bg-green-300 text-black"
              : "bg-white/20 text-white"
          }`}
        >
          <p className="text-5xl mb-2">🏢</p>
          <p className="font-semibold">Sou uma empresa</p>
        </div>
      </div>

      <Button
        onClick={() => role && setStep(2)}
        disabled={!role}
        className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10"
      >
        PRÓXIMO
      </Button>
    </div>
  );


  // ------------------- FLUXO CANDIDATO -------------------
  const Step2Candidate = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">Em qual área você atua?</h2>
      {[
        "Desenvolvimento de Software",
        "Design",
        "Ciência de Dados",
        "Cibersegurança",
        "Infraestrutura",
        "Inteligência Artificial",
        "Blockchain",
        "Outros",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(3)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step3Candidate = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        Qual o seu nível de experiência na área?
      </h2>
      {["Júnior", "Pleno", "Sênior", "Especialista"].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(4)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step4Candidate = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">Qual tipo de oportunidade procura?</h2>
      {[
        "Estágio",
        "CLT",
        "Freelancer",
        "Trainee",
        "Temporário",
        "Aprendiz",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(5)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step5Candidate = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        Qual é o seu nível de conhecimento em Git e versionamento?
      </h2>
      {[
        "Básico",
        "Intermediário",
        "Avançado",
        "Nenhum conhecimento",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(6)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step6Candidate = () => (
    <form onSubmit={handleRegister} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Última etapa: dados de acesso
      </h2>
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-white text-sm">Nome Completo</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-white/90 rounded-xl py-6 text-gray-800"
          />
        </div>
        <div>
          <label className="text-white text-sm">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/90 rounded-xl py-6 text-gray-800"
          />
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

  // ------------------- FLUXO EMPRESA -------------------

  const Step2Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        Para que tipo de projeto você está contratando?
      </h2>
      {[
        "Novas ideias/projeto",
        "Reforçar equipe em um projeto existente",
        "É necessário experiência altamente específica",
        "Desenvolvimento de novas competências",
        "Outros",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(3)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step3Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        Quais competências técnicas e habilidades você considera essenciais?
      </h2>
      {[
        "Ciência de Dados",
        "Testes",
        "Cibersegurança",
        "Infraestrutura",
        "Desenvolvimento de Software",
        "Blockchain",
        "Inteligência Artificial",
        "Arquitetura",
        "Engenharia de Dados",
        "Suporte Técnico",
        "Design",
        "Análise de Dados",
        "Nuvem",
        "Outros",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(4)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step4Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        Quanto tempo precisa do profissional?
      </h2>
      {[
        "Decidir mais tarde",
        "< 1 semana",
        "1 semana - 6 meses",
        "+ 6 meses",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(5)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step5Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        O candidato precisa ter experiência em versionamento de código (Git)?
      </h2>
      {[
        "Sim, básico",
        "Sim, avançado",
        "Conhecimento teórico suficiente",
        "Não é necessário",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(6)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step6Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        O que vocês valorizam mais em um candidato a longo prazo?
      </h2>
      {[
        "Potencial de crescimento e aprendizado",
        "Especialização técnica em determinada área",
        "Flexibilidade e adaptabilidade",
        "Comprometimento e estabilidade",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(7)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step7Company = () => {
  const [companyName, setCompanyName] = React.useState("");
  const [cnpj, setCnpj] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [diversity, setDiversity] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    // Aqui você adiciona a lógica de envio dos dados
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Cadastramento de Dados
      </h2>
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm">Nome da Empresa</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div>
            <label className="text-white text-sm">Digite seu nome</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div>
            <label className="text-white text-sm">Cadastro Nacional da Pessoa Jurídica (CNPJ)</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div>
            <label className="text-white text-sm">Cargo na empresa</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div>
            <label className="text-white text-sm">Cidade</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div>
            <label className="text-white text-sm">Estado (UF)</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div className="col-span-2">
            <label className="text-white text-sm">Telefone/WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div className="col-span-2">
            <label className="text-white text-sm">Endereço de E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
            />
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm">Digite sua Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
              />
            </div>
            <div>
              <label className="text-white text-sm">Repita sua Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white/90 rounded-xl py-3 px-4 text-gray-800"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-white text-sm">Diversidade e inclusão</label>
            <p className="text-white text-xs mb-1">Sua empresa possui políticas de diversidade e inclusão?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="diversity"
                  value="sim"
                  checked={diversity === "sim"}
                  onChange={() => setDiversity("sim")}
                  className="accent-green-500"
                />
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="diversity"
                  value="nao"
                  checked={diversity === "nao"}
                  onChange={() => setDiversity("nao")}
                  className="accent-green-500"
                />
                Não
              </label>
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-300/80 hover:bg-green-400/80 text-green-900 py-4 rounded-full text-lg font-semibold mt-4"
      >
        {loading ? "Enviando..." : "CONTINUAR E ENVIAR OS DADOS"}
      </button>
    </form>
  );
};


  // ------------------- RENDERIZAÇÃO -------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        {step === 1 && <Step1 />}

        {/* FLUXO CANDIDATO */}
        {role === "candidate" && step === 2 && <Step2Candidate />}
        {role === "candidate" && step === 3 && <Step3Candidate />}
        {role === "candidate" && step === 4 && <Step4Candidate />}
        {role === "candidate" && step === 5 && <Step5Candidate />}
        {role === "candidate" && step === 6 && <Step6Candidate />}

        {/* FLUXO EMPRESA */}
        {role === "company" && step === 2 && <Step2Company />}
        {role === "company" && step === 3 && <Step3Company />}
        {role === "company" && step === 4 && <Step4Company />}
        {role === "company" && step === 5 && <Step5Company />}
        {role === "company" && step === 6 && <Step6Company />}
        {role === "company" && step === 7 && <Step7Company />}
      </div>
    </div>
  );
}
