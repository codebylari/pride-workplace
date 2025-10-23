import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ------------------- ESTADOS GERAIS -------------------
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"candidate" | "company" | "">("");
  const [loading, setLoading] = useState(false);

  // ------------------- CAMPOS CANDIDATO -------------------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ------------------- CAMPOS EMPRESA -------------------
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [diversity, setDiversity] = useState<"sim" | "nao" | null>(null);

  // ------------------- VERIFICA SESSÃO -------------------
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    checkSession();
  }, [navigate]);

  // ------------------- FUNÇÃO DE CADASTRO -------------------
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
            ...(role === "company" && {
              company_name: companyName,
              cnpj,
              city,
              state,
              phone,
              position,
              diversity,
            }),
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado!",
        description: "Você já pode fazer login na plataforma.",
      });

      navigate("/auth");
    } catch {
      toast({
        title: "Erro no cadastro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------- STEP 1 -------------------
  const Step1 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Quem é você na nossa plataforma?
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div
          onClick={() => setRole("candidate")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${role === "candidate"
            ? "bg-green-300 text-black"
            : "bg-white/20 text-white"
            }`}
        >
          <p className="text-5xl mb-2">👩‍💻</p>
          <p className="font-semibold">Sou um(a) candidato(a)</p>
        </div>

        <div
          onClick={() => setRole("company")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${role === "company"
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
      <h2 className="text-3xl font-bold">Qual o seu nível de experiência?</h2>
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
      {["Estágio", "CLT", "Freelancer", "Trainee", "Temporário", "Aprendiz"].map(
        (option) => (
          <Button
            key={option}
            onClick={() => setStep(5)}
            className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
          >
            {option}
          </Button>
        )
      )}
    </div>
  );

  const Step5Candidate = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">
        Qual é o seu nível de conhecimento em Git?
      </h2>
      {["Básico", "Intermediário", "Avançado", "Nenhum conhecimento"].map(
        (option) => (
          <Button
            key={option}
            onClick={() => setStep(6)}
            className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg"
          >
            {option}
          </Button>
        )
      )}
    </div>
  );
  // formulário
  const Step6Candidate = ({
    email,
    setEmail,
    handleRegister,
  }) => {
    const [fullName, setFullName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [birthDate, setBirthDate] = React.useState("");
    const [socialName, setSocialName] = React.useState("");
    const [cpf, setCpf] = React.useState("");
    const [rg, setRg] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");



    return (
      <form onSubmit={handleRegister} className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Cadastramento de Dados
        </h2>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-1">Nome</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Sobrenome</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-white mb-1">Nome Social (se tiver)</label>
              <input
                type="text"
                value={socialName}
                onChange={(e) => setSocialName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-white mb-1">RG</label>
              <input
                type="text"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Estado (UF)</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black"
              >
                <option value="">Selecione seu estado</option>
                <option value="AC">Acre (AC)</option>
                <option value="AL">Alagoas (AL)</option>
                <option value="AP">Amapá (AP)</option>
                <option value="AM">Amazonas (AM)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="CE">Ceará (CE)</option>
                <option value="DF">Distrito Federal (DF)</option>
                <option value="ES">Espírito Santo (ES)</option>
                <option value="GO">Goiás (GO)</option>
                <option value="MA">Maranhão (MA)</option>
                <option value="MT">Mato Grosso (MT)</option>
                <option value="MS">Mato Grosso do Sul (MS)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PA">Pará (PA)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="PE">Pernambuco (PE)</option>
                <option value="PI">Piauí (PI)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="RO">Rondônia (RO)</option>
                <option value="RR">Roraima (RR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="SE">Sergipe (SE)</option>
                <option value="TO">Tocantins (TO)</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-1">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Telefone/WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
          </div>

          {/* SEÇÃO DE EMAIL */}
          <div className="mt-4">
            <p className="text-white mb-2">Digite seu email e confirme abaixo:</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />

              <input
                type="email"
                placeholder="Confirme seu email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-white mb-1">Digite sua Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Repita sua Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
          </div>


          <button
            type="button"
            onClick={() => setStep(7)}  // antes chamava handleRegister
            className="w-full bg-green-300/80 hover:bg-green-400/80 text-green-900 py-4 rounded-full mt-4 font-semibold"
          >
            CONTINUAR E ENVIAR OS DADOS
          </button>
        </div>
      </form>
    );
  };

  const Step7Terms = () => (
    <div className="text-white space-y-6 max-w-3xl mx-auto text-justify">
      <h2 className="text-3xl font-bold text-center mb-6">
        📌 Termos e Condições – Candidatos
      </h2>

      <p>
        Bem-vindo(a)! <br /> <br /> Este é um espaço criado especialmente para mulheres e pessoas da comunidade LGBT+,
        com o objetivo de promover conexões profissionais seguras, respeitosas e transformadoras.
        Ao aceitar estes Termos, você se une a uma rede que acredita no poder da diversidade e no valor da sua trajetória.
      </p>

      <ol className="list-decimal pl-5 space-y-3">
        <li>
          <strong>Um Ambiente Acolhedor e Seguro</strong><br />
          Nosso compromisso é oferecer um espaço livre de preconceito, onde cada pessoa possa se apresentar de forma autêntica, sem medo de julgamento.
          Esta é uma plataforma feita para apoiar quem deseja mostrar sua história, suas habilidades e seu potencial profissional.

        </li>

        <li>
          <strong>Responsabilidade nas Informações Prestadas</strong><br />
          Ao criar seu perfil, é essencial que os dados fornecidos sejam verdadeiros e representem sua experiência e formação de maneira transparente.
          Informações falsas, plágio de currículos ou tentativas de se passar por outra pessoa não serão toleradas e podem resultar na exclusão da conta.
        </li>

        <li>
          <strong>Respeito na Comunicação</strong><br />
          Todas as interações devem ser pautadas pela cordialidade, respeito e profissionalismo.
          Acreditamos que oportunidades surgem de diálogos saudáveis, e que cada conversa é também uma forma de aprendizado e troca.
        </li>

        <li>
          <strong>Confidencialidade e Segurança</strong><br />
          Seus dados pessoais sensíveis não serão exibidos em seu perfil público.
          Toda comunicação deve ocorrer dentro da própria plataforma, garantindo maior proteção tanto para você quanto para a empresa.
        </li>

        <li>
          <strong>Valorização da Jornada</strong><br />
          Seu perfil é o reflexo da sua caminhada: suas formações, suas experiências, suas conquistas. Aqui você terá espaço para mostrar quem é profissionalmente e como chegou até aqui. Acreditamos que cada trajetória importa, e é por isso que a sua história tem lugar especial na nossa rede.
          Ao continuar, você declara estar de acordo com os termos acima e reafirma seu compromisso em construir, junto com outras pessoas, uma comunidade profissional inclusiva, respeitosa e transformadora.
        </li>
      </ol>

      <p className="mt-6 text-center">
        Ao continuar, você declara estar de acordo com os termos acima e reafirma seu compromisso com uma comunidade inclusiva e respeitosa.
      </p>

      <div className="text-center">
        <Button
          onClick={() => setStep(8)}
          className="bg-green-300/80 hover:bg-green-400/80 text-green-900 py-4 px-10 rounded-full font-semibold mt-4"
        >
          Li e aceito os termos para continuar
        </Button>
      </div>
    </div>
  );

  const Step8Photo = () => {
    const [photo, setPhoto] = useState<File | null>(null);

    const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setPhoto(event.target.files[0]);
      }
    };

    return (
      <div className="flex flex-col items-center text-white space-y-6">
        <h2 className="text-3xl font-bold">Escolha sua foto</h2>

        {photo ? (
          <img
            src={URL.createObjectURL(photo)}
            alt="Prévia da foto"
            className="w-40 h-40 rounded-full object-cover border-4 border-green-300 shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center text-4xl border-2 border-white/30">
            📷
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <label className="cursor-pointer bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full">
            🖼️ Escolher da galeria
            <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
          </label>

          <Button
            disabled={!photo}
            onClick={() => setStep(9)}
            className="bg-green-300/80 hover:bg-green-400/80 text-green-900 py-3 px-8 rounded-full font-semibold"
          >
            {photo ? "Cadastrar" : "Selecione uma foto primeiro"}
          </Button>
        </div>
      </div>
    );
  };

  const Step9Success = () => (
    <div className="flex flex-col items-center text-white space-y-6 text-center">
      <h2 className="text-4xl font-bold text-green-300">SUCESSO!</h2>
      <p className="text-lg max-w-md">
        Perfil criado com sucesso.<br />
        Agradecemos a sua confiança em nossa plataforma!
      </p>
      <Button
        onClick={() => navigate("/auth")}
        className="bg-green-300/80 hover:bg-green-400/80 text-green-900 py-4 px-10 rounded-full font-semibold"
      >
        Ir para página inicial
      </Button>
    </div>
  );




  // ------------------- FLUXO EMPRESA -------------------

  const Step2Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">Tipo de projeto</h2>
      {[
        "Novas ideias/projeto",
        "Reforçar equipe",
        "Experiência específica",
        "Novas competências",
        "Outros",
      ].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(3)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg transition-all"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step3Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">Competências essenciais</h2>
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
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg transition-all"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step4Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">Quanto tempo precisa do profissional?</h2>
      {["Decidir mais tarde", "< 1 semana", "1 semana - 6 meses", "+ 6 meses"].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(5)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg transition-all"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const Step5Company = () => (
    <div className="flex flex-col items-center space-y-6 text-center text-white">
      <h2 className="text-3xl font-bold">Experiência em Git?</h2>
      {["Sim, básico", "Sim, avançado", "Conhecimento teórico", "Não necessário"].map((option) => (
        <Button
          key={option}
          onClick={() => setStep(6)}
          className="w-80 py-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg transition-all"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  // CAMPOS OTIMIZADOS — DIGITAÇÃO FLUÍDA
  const Step6Company = ({
    email,
    setEmail,
    password,
    setPassword,
    handleRegister,
  }) => {
    const [companyName, setCompanyName] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [cnpj, setCnpj] = React.useState("");
    const [position, setPosition] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [diversity, setDiversity] = React.useState<"sim" | "nao" | null>(null);

    return (
      <form onSubmit={handleRegister} className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Cadastramento de Empresa
        </h2>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Seu Nome</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Cargo</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Estado (UF)</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-black"
              >
                <option value="">Selecione seu estado</option>
                <option value="AC">Acre (AC)</option>
                <option value="AL">Alagoas (AL)</option>
                <option value="AP">Amapá (AP)</option>
                <option value="AM">Amazonas (AM)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="CE">Ceará (CE)</option>
                <option value="DF">Distrito Federal (DF)</option>
                <option value="ES">Espírito Santo (ES)</option>
                <option value="GO">Goiás (GO)</option>
                <option value="MA">Maranhão (MA)</option>
                <option value="MT">Mato Grosso (MT)</option>
                <option value="MS">Mato Grosso do Sul (MS)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PA">Pará (PA)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="PE">Pernambuco (PE)</option>
                <option value="PI">Piauí (PI)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="RO">Rondônia (RO)</option>
                <option value="RR">Roraima (RR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="SE">Sergipe (SE)</option>
                <option value="TO">Tocantins (TO)</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-1">Telefone/WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
          </div>

          {/* EMAIL E SENHA */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="col-span-2">
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
          </div>

          {/* RADIO */}
          <div className="mt-4">
            <label className="block text-white mb-1">
              Sua empresa possui políticas de diversidade e inclusão?
            </label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 text-white">
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
              <label className="flex items-center gap-2 text-white">
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

          <button
            type="submit"
            className="w-full bg-green-300/80 hover:bg-green-400/80 text-green-900 py-4 rounded-full mt-4 font-semibold"
          >
            CONTINUAR E ENVIAR OS DADOS
          </button>
        </div>
      </form>
    );
  };

  const Step7Company = () => (
    <div className="text-white space-y-6 max-w-3xl mx-auto text-justify">
      <h2 className="text-3xl font-bold text-center mb-6">
        📌 Termos e Condições – Empresas Apoiadoras
      </h2>

      <p>
        Bem-vindo(a) à nossa plataforma. O cadastro e participação de empresas aqui representam
        um compromisso com um ambiente inclusivo, justo e respeitoso.
      </p>

      <ol className="list-decimal pl-5 space-y-3">
        <li><strong>Compromisso com o Respeito e a Inclusão:</strong> a empresa declara que todas as vagas e interações estarão alinhadas com princípios de igualdade e respeito.</li>
        <li><strong>Profissionalismo e Cordialidade:</strong> a comunicação com candidatos deve ser ética e transparente.</li>
        <li><strong>Clareza e Honestidade nas Vagas:</strong> descrições claras e verdadeiras, sem anúncios enganosos.</li>
        <li><strong>Valorização da Diversidade:</strong> incentivo à presença de mulheres e pessoas LGBT+ em seus processos seletivos.</li>
        <li><strong>Confiabilidade e Responsabilidade:</strong> manutenção dos dados institucionais atualizados e válidos.</li>
      </ol>

      <p className="mt-6 text-center">
        Ao prosseguir, a empresa declara ter lido e aceitado todos os termos acima.
      </p>

      <div className="text-center">
        <Button
          onClick={handleRegister}
          className="bg-green-300/80 hover:bg-green-400/80 text-green-900 py-4 px-10 rounded-full font-semibold mt-4 transition-all"
        >
          Concordo com os termos e quero apoiar
        </Button>
      </div>
    </div>
  );

  const Step8Company = () => {
    const [logo, setLogo] = useState<File | null>(null);

    const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setLogo(event.target.files[0]);
      }
    };

    return (
      <div className="flex flex-col items-center text-white space-y-6">
        <h2 className="text-3xl font-bold">Envie o logo da sua empresa</h2>

        {logo ? (
          <img
            src={URL.createObjectURL(logo)}
            alt="Prévia da logo"
            className="w-40 h-40 rounded-full object-cover border-4 border-green-300 shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center text-4xl border-2 border-white/30">
            🏢
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <label className="cursor-pointer bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full">
            🖼️ Escolher logo
            <input type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
          </label>

          <Button
            disabled={!logo}
            onClick={() => setStep(9)}
            className="bg-green-300/80 hover:bg-green-400/80 text-green-900 py-3 px-8 rounded-full font-semibold"
          >
            {logo ? "Finalizar cadastro" : "Selecione uma logo"}
          </Button>
        </div>
      </div>
    );
  };

  const Step9Company = () => (
    <div className="flex flex-col items-center text-white space-y-6 text-center">
      <h2 className="text-4xl font-bold text-green-300">Cadastro concluído!</h2>
      <p className="text-lg max-w-md">
        Sua empresa agora faz parte de uma rede que apoia a diversidade e a inclusão.
        Obrigado por se juntar a nós 💜
      </p>
      <Button
        onClick={() => navigate("/auth")}
        className="bg-green-300/80 hover:bg-green-400/80 text-green-900 py-4 px-10 rounded-full font-semibold"
      >
        Ir para login
      </Button>
    </div>
  );

  // ------------------- RENDER -------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        {step === 1 && <Step1 />}
        {role === "candidate" && step === 2 && <Step2Candidate />}
        {role === "candidate" && step === 3 && <Step3Candidate />}
        {role === "candidate" && step === 4 && <Step4Candidate />}
        {role === "candidate" && step === 5 && <Step5Candidate />}
        {role === "candidate" && step === 6 && (
          <Step6Candidate
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleRegister={handleRegister}
          />
        )}
        {role === "candidate" && step === 7 && <Step7Terms />}
        {role === "candidate" && step === 8 && <Step8Photo />}
        {role === "candidate" && step === 9 && <Step9Success />}

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