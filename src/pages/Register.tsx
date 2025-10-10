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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"candidate" | "company">("candidate");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Company specific fields
  const [fantasyName, setFantasyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

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
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user && role === "company") {
        // Insert company profile
        const { error: companyError } = await supabase
          .from("company_profiles")
          .insert({
            user_id: data.user.id,
            fantasy_name: fantasyName,
            cnpj: cnpj,
            description: description,
            sector: sector,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="QueerCode Logo" className="w-48 h-auto mb-4" />
          <h1 className="text-4xl font-bold text-white">Cadastre-se</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <RadioGroup value={role} onValueChange={(value: "candidate" | "company") => setRole(value)}>
              <div className="flex gap-6 justify-center">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="candidate" id="candidate" className="border-white text-white" />
                  <Label htmlFor="candidate" className="text-white text-lg cursor-pointer">
                    Candidato
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="company" className="border-white text-white" />
                  <Label htmlFor="company" className="text-white text-lg cursor-pointer">
                    Empresa
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm">Nome Completo</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/90 rounded-xl py-6 text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/90 rounded-xl py-6 text-gray-800"
              />
            </div>

            <div className="space-y-2">
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
                <div className="space-y-2">
                  <label className="text-white text-sm">Nome Fantasia</label>
                  <Input
                    type="text"
                    value={fantasyName}
                    onChange={(e) => setFantasyName(e.target.value)}
                    required
                    className="bg-white/90 rounded-xl py-6 text-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm">CNPJ</label>
                  <Input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                    className="bg-white/90 rounded-xl py-6 text-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm">Setor</label>
                  <Input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="bg-white/90 rounded-xl py-6 text-gray-800"
                  />
                </div>

                <div className="space-y-2">
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

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => navigate("/auth")}
              variant="outline"
              className="flex-1 py-6 rounded-full text-lg font-semibold bg-white/20 text-white border-white hover:bg-white/30"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold"
            >
              {loading ? "Cadastrando..." : "CADASTRAR"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ------------------- ESTADOS -------------------
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"candidate" | "company" | "">("");

  // Candidato
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [independent, setIndependent] = useState("");
  const [incomeEstimate, setIncomeEstimate] = useState("");
  const [reason, setReason] = useState("");
  const [availability, setAvailability] = useState("");
  const [remoteProjects, setRemoteProjects] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Empresa
  const [fantasyName, setFantasyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [projectType, setProjectType] = useState("");

  const [loading, setLoading] = useState(false);

  // ------------------- VERIFICA SESSÃO -------------------
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    checkSession();
  }, [navigate]);

  // ------------------- CADASTRO -------------------
  const handleRegisterCandidate = async (e: React.FormEvent) => {
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

  const handleRegisterCompanyStep12 = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      // Atualiza projeto da empresa
      const { error: projectError } = await supabase
        .from("company_profiles")
        .update({ project_type: projectType })
        .eq("user_id", userData?.id);
      if (projectError) throw projectError;

      toast({
        title: "Cadastro de empresa concluído!",
        description: "Você já pode fazer login na plataforma.",
      });

      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------- STEPS -------------------
  const Step1 = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Quem é você na nossa plataforma?
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div
          onClick={() => setRole("candidate")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${
            role === "candidate" ? "bg-green-300 text-black" : "bg-white/20 text-white"
          }`}
        >
          <p className="text-5xl mb-2">👩‍💻</p>
          <p className="font-semibold">Sou um(a) candidato(a)</p>
        </div>
        <div
          onClick={() => setRole("company")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-56 transition ${
            role === "company" ? "bg-green-300 text-black" : "bg-white/20 text-white"
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

  // ------------------- STEP11 CANDIDATO -------------------
  const Step11Candidate = () => (
    <form onSubmit={handleRegisterCandidate} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Última etapa: preencha seus dados
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

  // ------------------- STEP11 EMPRESA -------------------
  const Step11Company = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Última etapa: preencha os dados da empresa
      </h2>
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-white text-sm">Nome Fantasia</label>
          <Input type="text" value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} required className="bg-white/90 rounded-xl py-6 text-gray-800" />
        </div>
        <div>
          <label className="text-white text-sm">CNPJ</label>
          <Input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required className="bg-white/90 rounded-xl py-6 text-gray-800" />
        </div>
        <div>
          <label className="text-white text-sm">Setor</label>
          <Input type="text" value={sector} onChange={(e) => setSector(e.target.value)} className="bg-white/90 rounded-xl py-6 text-gray-800" />
        </div>
        <div>
          <label className="text-white text-sm">Descrição</label>
          <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white/90 rounded-xl py-6 text-gray-800" />
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setStep(12)}
        className="w-full bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold"
      >
        PRÓXIMO
      </Button>
    </div>
  );

  // ------------------- STEP12 EMPRESA -------------------
  const Step12Company = () => (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-center text-white">
        Para que tipo de projeto você está contratando?
      </h2>
      <div className="flex flex-col gap-4">
        {[
          "Novas ideias/projeto",
          "Reforçar equipe em um projeto existente",
          "É necessário experiência altamente específica",
          "Desenvolvimento de novas competências",
          "Outros",
        ].map((option) => (
          <Button
            key={option}
            variant="outline"
            onClick={() => setProjectType(option)}
            className={`py-6 rounded-full text-lg font-semibold ${
              projectType === option ? "bg-green-300 text-green-900" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {option}
          </Button>
        ))}
      </div>

      <Button
        onClick={handleRegisterCompanyStep12}
        disabled={!projectType || loading}
        className="mt-8 bg-green-300/80 hover:bg-green-400/80 text-green-900 py-6 rounded-full text-lg font-semibold px-10"
      >
        FINALIZAR CADASTRO
      </Button>
    </div>
  );

  // ------------------- RENDER -------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        {step === 1 && <Step1 />}
        {step === 11 && role === "candidate" && <Step11Candidate />}
        {step === 11 && role === "company" && <Step11Company />}
        {step === 12 && role === "company" && <Step12Company />}
      </div>
    </div>
  );
}
