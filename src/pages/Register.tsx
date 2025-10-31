import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Check, ArrowLeft } from "lucide-react";
import { PhotoEditor } from "@/components/PhotoEditor";

interface City {
  id: number;
  nome: string;
}

interface State {
  id: number;
  sigla: string;
  nome: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ------------------- ESTADOS GERAIS -------------------
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"candidate" | "company" | "">("");
  
  // Debug logs
  useEffect(() => {
    console.log("Current step:", step);
    console.log("Current role:", role);
  }, [step, role]);
  const [loading, setLoading] = useState(false);

  // ------------------- API IBGE -------------------
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // ------------------- CAMPOS CANDIDATO -------------------
  const [gender, setGender] = useState<"feminino" | "masculino" | "outros" | "">("");
  const [customGender, setCustomGender] = useState("");
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [socialName, setSocialName] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // ------------------- CAMPOS EMPRESA -------------------
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [position, setPosition] = useState("");
  const [companyContactLastName, setCompanyContactLastName] = useState("");
  const [diversity, setDiversity] = useState<"sim" | "nao" | null>(null);

  // ------------------- CARREGAR ESTADOS -------------------
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Erro ao carregar estados:", err));
  }, []);

  // ------------------- CARREGAR CIDADES AO SELECIONAR ESTADO -------------------
  useEffect(() => {
    if (!state) {
      setCities([]);
      setCity("");
      return;
    }

    setLoadingCities(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`)
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        setLoadingCities(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar cidades:", err);
        setLoadingCities(false);
      });
  }, [state]);

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

    // Validação de senha - deve conter pelo menos uma letra
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasLetter) {
      setPasswordError("A senha deve conter pelo menos uma letra");
      toast({
        title: "Erro",
        description: "A senha deve conter pelo menos uma letra.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: role === "candidate" ? `${fullName} ${lastName}` : `${fullName} ${companyContactLastName}`,
            role,
            state,
            city,
            ...(role === "company" && {
              company_name: companyName,
              cnpj,
              phone,
              position,
              diversity,
            }),
            ...(role === "candidate" && {
              birth_date: birthDate,
              social_name: socialName,
              cpf,
              rg,
              phone,
            }),
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado!",
        description: "Você já pode fazer login na plataforma.",
      });

      // Redirect based on role
      if (role === "company") {
        navigate("/company-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao realizar o cadastro.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------- STEP 1 -------------------
  const Step1 = () => (
    <div className="flex flex-col items-center space-y-6 md:space-y-8 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
        Quem é você na nossa plataforma?
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
        <div
          onClick={() => setRole("candidate")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-full md:w-56 transition-all ${
            role === "candidate"
              ? "bg-success text-success-foreground border-2 border-success scale-105"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <p className="text-4xl md:text-5xl mb-2">👩‍💻</p>
          <p className="font-semibold text-sm md:text-base">Sou um(a) candidato(a)</p>
        </div>

        <div
          onClick={() => setRole("company")}
          className={`cursor-pointer p-6 rounded-2xl text-center w-full md:w-56 transition-all ${
            role === "company"
              ? "bg-success text-success-foreground border-2 border-success scale-105"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <p className="text-4xl md:text-5xl mb-2">🏢</p>
          <p className="font-semibold text-sm md:text-base">Sou uma empresa</p>
        </div>
      </div>

      <Button
        onClick={() => role && setStep(2)}
        disabled={!role}
        className="mt-4 md:mt-8 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-auto"
      >
        PRÓXIMO
      </Button>
    </div>
  );

  // ------------------- FLUXO CANDIDATO -------------------
  const Step2Candidate = () => {
    const [localGender, setLocalGender] = useState<"feminino" | "masculino" | "outros" | "">(gender);
    const [localCustomGender, setLocalCustomGender] = useState(customGender);

    const handleGenderSelect = (selectedGender: "feminino" | "masculino") => {
      setLocalGender(selectedGender);
      setGender(selectedGender);
      setCustomGender("");
    };

    const handleOthersClick = () => {
      setLocalGender("outros");
      setGender("outros");
    };

    const handleContinue = () => {
      if (localGender === "outros") {
        setCustomGender(localCustomGender);
      }
      setStep(2.5);
    };

    return (
      <div className="flex flex-col items-center space-y-4 md:space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(1)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold">Qual é o seu gênero?</h2>
        
        <Button
          onClick={() => handleGenderSelect("feminino")}
          className={`w-full md:w-80 py-5 md:py-6 rounded-full text-base md:text-lg transition-all ${
            localGender === "feminino"
              ? "bg-success hover:bg-success/90 text-success-foreground"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          Feminino
        </Button>
        
        <Button
          onClick={() => handleGenderSelect("masculino")}
          className={`w-full md:w-80 py-5 md:py-6 rounded-full text-base md:text-lg transition-all ${
            localGender === "masculino"
              ? "bg-success hover:bg-success/90 text-success-foreground"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          Masculino
        </Button>
        
        <div className="w-full md:w-80 space-y-3">
          <Button
            onClick={handleOthersClick}
            className={`w-full py-5 md:py-6 rounded-full text-base md:text-lg transition-all ${
              localGender === "outros"
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            Outros
          </Button>
          
          {localGender === "outros" && (
            <div className="space-y-3 animate-fade-in">
              <input
                type="text"
                value={localCustomGender}
                onChange={(e) => setLocalCustomGender(e.target.value)}
                placeholder="Especifique seu gênero"
                autoFocus
                className="w-full py-4 px-6 rounded-full bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-success focus:bg-white/30 text-base md:text-lg transition-all"
              />
            </div>
          )}
        </div>
        
        {localGender && (localGender !== "outros" || localCustomGender.trim()) && (
          <Button
            onClick={handleContinue}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step2_5Candidate = () => {
    const [selectedExperience, setSelectedExperience] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-6 md:space-y-8 text-center text-white px-4">
        <button
          onClick={() => setStep(2)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold">Qual a sua experiência no mercado de trabalho?</h2>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { emoji: "👨‍💻", label: "1 a 2 anos de Experiência", value: "1-2-anos" },
            { emoji: "👨‍💻", label: "3 a 5 anos de Experiência", value: "3-5-anos" },
            { emoji: "👨‍💻", label: "4 ano de Experiência", value: "4-anos" },
            { emoji: "👨‍💻", label: "+6 anos de Experiência", value: "6-mais-anos" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedExperience(option.value)}
              className={`p-6 rounded-2xl transition-all ${
                selectedExperience === option.value
                  ? "bg-success text-success-foreground scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <div className="text-4xl md:text-5xl mb-2">{option.emoji}</div>
              <p className="text-sm font-medium">{option.label}</p>
            </button>
          ))}
        </div>
        
        {selectedExperience && (
          <Button
            onClick={() => setStep(2.7)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step2_7Candidate = () => {
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    
    const toggleArea = (area: string) => {
      setSelectedAreas(prev => 
        prev.includes(area) 
          ? prev.filter(a => a !== area)
          : [...prev, area]
      );
    };
    
    return (
      <div className="flex flex-col items-center space-y-6 md:space-y-8 text-center text-white px-4">
        <button
          onClick={() => setStep(2.5)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold">Selecione as suas áreas de especialização</h2>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
          {[
            "Ciências de Dados",
            "Testes",
            "Cibersegurança",
            "Infraestrutura",
            "Desenvolvimento de Software",
            "Blockchain",
            "Inteligência Artificial",
            "Arquitetura",
            "Engenharia de Dados",
            "Suporte Técnico",
            "Desing",
            "Análise de Dados",
            "Nuvens",
            "Outros",
          ].map((area) => (
            <Button
              key={area}
              onClick={() => toggleArea(area)}
              className={`py-5 md:py-6 rounded-2xl text-sm md:text-base transition-all ${
                selectedAreas.includes(area)
                  ? "bg-success hover:bg-success/90 text-success-foreground scale-105"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              {area}
            </Button>
          ))}
        </div>
        
        {selectedAreas.length > 0 && (
          <Button
            onClick={() => setStep(3)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step3Candidate = () => {
    const [selectedArea, setSelectedArea] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-4 md:space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(2.7)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold">Em qual área você atua?</h2>
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
            onClick={() => setSelectedArea(option)}
            className={`w-full md:w-80 py-5 md:py-6 rounded-full text-base md:text-lg transition-all ${
              selectedArea === option
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {option}
          </Button>
        ))}
        
        {selectedArea && (
          <Button
            onClick={() => setStep(4)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step4Candidate = () => {
    const [selectedLevel, setSelectedLevel] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-4 md:space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(3)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold">Qual o seu nível de experiência?</h2>
        {["Júnior", "Pleno", "Sênior", "Especialista"].map((option) => (
          <Button
            key={option}
            onClick={() => setSelectedLevel(option)}
            className={`w-full md:w-80 py-5 md:py-6 rounded-full text-base md:text-lg transition-all ${
              selectedLevel === option
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {option}
          </Button>
        ))}
        
        {selectedLevel && (
          <Button
            onClick={() => setStep(5)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step5Candidate = () => {
    const [selectedType, setSelectedType] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-4 md:space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(4)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold">Qual tipo de oportunidade procura?</h2>
        {["Estágio", "CLT", "Freelancer", "Trainee", "Temporário", "Aprendiz"].map(
          (option) => (
            <Button
              key={option}
              onClick={() => setSelectedType(option)}
              className={`w-full md:w-80 py-5 md:py-6 rounded-full text-base md:text-lg transition-all ${
                selectedType === option
                  ? "bg-success hover:bg-success/90 text-success-foreground"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              {option}
            </Button>
          )
        )}
        
        {selectedType && (
          <Button
            onClick={() => setStep(6)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step6Candidate = () => {
    const [selectedGit, setSelectedGit] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-4 md:space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(5)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold">
          Qual é o seu nível de conhecimento em Git?
        </h2>
        {["Básico", "Intermediário", "Avançado", "Nenhum conhecimento"].map(
          (option) => (
            <Button
              key={option}
              onClick={() => setSelectedGit(option)}
              className={`w-full md:w-80 py-5 md:py-6 rounded-full text-base md:text-lg transition-all ${
                selectedGit === option
                  ? "bg-success hover:bg-success/90 text-success-foreground"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              {option}
            </Button>
          )
        )}
        
        {selectedGit && (
          <Button
            onClick={() => setStep(7)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-5 md:py-6 rounded-full text-base md:text-lg font-semibold px-8 md:px-10 w-full md:w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  // Função para verificar se o email já está em uso (validação básica local)
  const checkEmailAvailability = async (emailToCheck: string) => {
    setCheckingEmail(true);
    setEmailError("");
    try {
      if (!emailToCheck) return;
      const basicEmailRegex = /.+@.+\..+/;
      if (!basicEmailRegex.test(emailToCheck)) {
        setEmailError("Email inválido. Verifique e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao validar email:", error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const Step7Candidate = React.useMemo(() => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Limpar erros anteriores
      setPasswordError("");
      setConfirmPasswordError("");
      
      // Validação de senha - deve conter pelo menos uma letra
      const hasLetter = /[a-zA-Z]/.test(password);
      if (!hasLetter) {
        setPasswordError("A senha deve conter pelo menos uma letra");
        toast({
          title: "Erro na senha",
          description: "A senha deve conter pelo menos uma letra.",
          variant: "destructive",
        });
        return;
      }

      // Validação de senhas iguais
      if (password !== confirmPassword) {
        setConfirmPasswordError("As senhas não coincidem");
        toast({
          title: "Erro",
          description: "As senhas não coincidem.",
          variant: "destructive",
        });
        return;
      }
      
      // Verifica o email antes de avançar
      await checkEmailAvailability(email);
      
      // Se houver erro de email, não avança
      if (emailError) {
        return;
      }
      
      setStep(8);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-4xl mx-auto px-4">
        <button
          type="button"
          onClick={() => setStep(6)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-4"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4 md:mb-6">
          Cadastramento de Dados
        </h2>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-1">Nome</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Sobrenome</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-1 md:col-span-3">
              <label className="block text-white mb-1">Nome Social (se tiver)</label>
              <input
                type="text"
                value={socialName}
                onChange={(e) => setSocialName(e.target.value)}
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-white mb-1">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCpf(value);
                }}
                required
                maxLength={11}
                placeholder="00000000000"
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-white mb-1">RG</label>
              <input
                type="text"
                value={rg}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setRg(value);
                }}
                required
                maxLength={15}
                placeholder="000000000"
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Estado (UF)</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione seu estado</option>
                {states.map((st) => (
                  <option key={st.id} value={st.sigla}>
                    {st.nome} ({st.sigla})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-1">Cidade</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!state || loadingCities}
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">
                  {loadingCities ? "Carregando..." : !state ? "Selecione o estado primeiro" : "Selecione sua cidade"}
                </option>
                {cities.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-1">Telefone/WhatsApp</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">+55</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPhone(value);
                  }}
                  required
                  maxLength={11}
                  placeholder="11999999999"
                  className="w-full p-3 pl-14 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              onBlur={(e) => checkEmailAvailability(e.target.value)}
              required
              className={`w-full p-3 rounded-lg bg-white text-black focus:ring-2 ${
                emailError ? "ring-2 ring-red-500" : "focus:ring-primary"
              }`}
            />
            {checkingEmail && (
              <p className="text-yellow-300 text-sm mt-1">Verificando email...</p>
            )}
            {emailError && (
              <p className="text-red-300 text-sm mt-1 font-semibold">{emailError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-white mb-1">Digite sua Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                  minLength={6}
                  className={`w-full p-3 pr-10 rounded-lg bg-white text-black focus:ring-2 ${
                    passwordError ? "ring-2 ring-red-500" : "focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 z-10"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ul className="text-white/80 text-xs mt-2 space-y-1">
                <li className="flex items-center gap-1">
                  <span className={password.length >= 6 ? "text-green-300" : "text-white/60"}>✓</span>
                  Mínimo 6 caracteres
                </li>
                <li className="flex items-center gap-1">
                  <span className={/[a-zA-Z]/.test(password) ? "text-green-300" : "text-white/60"}>✓</span>
                  Pelo menos uma letra
                </li>
              </ul>
              {passwordError && (
                <p className="text-red-300 text-sm mt-1 font-semibold">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-1">Repita sua Senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                  required
                  minLength={6}
                  className={`w-full p-3 pr-10 rounded-lg bg-white text-black focus:ring-2 ${
                    confirmPasswordError ? "ring-2 ring-red-500" : "focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 z-10"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs mt-2 ${password === confirmPassword ? "text-green-300" : "text-red-300"}`}>
                  {password === confirmPassword ? "✓ Senhas coincidem" : "✗ Senhas não coincidem"}
                </p>
              )}
              {confirmPasswordError && (
                <p className="text-red-300 text-sm mt-1 font-semibold">{confirmPasswordError}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={checkingEmail || !!emailError || !!passwordError || !!confirmPasswordError}
            className="w-full bg-success hover:bg-success/90 text-success-foreground py-4 rounded-full mt-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingEmail ? "VERIFICANDO..." : "CONTINUAR E ENVIAR OS DADOS"}
          </button>
        </div>
      </form>
    );
  }, [fullName, lastName, birthDate, socialName, cpf, rg, email, password, confirmPassword, phone, state, city, states, cities, loadingCities, checkingEmail, emailError, passwordError, confirmPasswordError, showPassword, showConfirmPassword]);

  const Step8Terms = () => (
    <div className="text-white space-y-6 max-w-3xl mx-auto text-justify px-4">
      <button
        onClick={() => setStep(7)}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-4"
      >
        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
        <span className="font-medium">Voltar</span>
      </button>
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
        </li>
      </ol>

      <p className="mt-6 text-center">
        Ao continuar, você declara estar de acordo com os termos acima e reafirma seu compromisso com uma comunidade inclusiva e respeitosa.
      </p>

      <div className="text-center px-4">
        <Button
          onClick={() => setStep(9)}
          className="bg-success hover:bg-success/90 text-success-foreground py-4 px-8 md:px-10 rounded-full font-semibold mt-4 w-full md:w-auto"
        >
          Li e aceito os termos para continuar
        </Button>
      </div>
    </div>
  );

  const Step9Photo = () => {
    const [photo, setPhoto] = useState<File | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setPhoto(event.target.files[0]);
      }
    };

    const handleRegisterWithPhoto = async () => {
      if (!photo) {
        toast({
          title: "Foto obrigatória",
          description: "Por favor, selecione uma foto antes de continuar.",
          variant: "destructive",
        });
        return;
      }

      setUploadingPhoto(true);

      try {
        // 1) Tenta cadastrar usuário
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: role === "candidate" ? `${fullName} ${lastName}` : `${fullName} ${companyContactLastName}`,
              role,
              state,
              city,
              ...(role === "company" && {
                company_name: companyName,
                cnpj,
                phone,
                position,
                diversity,
              }),
              ...(role === "candidate" && {
                birth_date: birthDate,
                social_name: socialName,
                cpf,
                rg,
                phone,
                gender: gender === 'outros' ? customGender : gender,
              }),
            },
          },
        });

        // 2) Se já for cadastrado, faz login para obter sessão
        if (authError && (authError.message?.includes('already') || authError.message?.includes('registered'))) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) throw signInError;
        } else if (authError) {
          throw authError;
        }

        // 3) Garante que temos sessão antes de subir a foto
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          throw new Error("Não foi possível confirmar o login. Verifique seu email e tente novamente.");
        }

        const userId = sessionData.session.user.id;

        // 4) Upload da foto
        const fileExt = photo.name.split('.').pop();
        const fileName = `${userId}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, photo, {
            upsert: true,
            contentType: photo.type
          });

        if (uploadError) throw uploadError;

        // 5) URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        // 6) Salva URL e gênero na tabela de perfis
        const finalGender = gender === 'outros' ? customGender : gender;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            photo_url: publicUrl,
            gender: finalGender
          })
          .eq('id', userId);

        if (updateError) throw updateError;

        setStep(10);
        toast({ title: "Cadastro realizado!", description: "Foto salva com sucesso." });
      } catch (error: any) {
        console.error('Erro no cadastro com foto:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message || "Ocorreu um erro ao realizar o cadastro.",
          variant: "destructive",
        });
      } finally {
        setUploadingPhoto(false);
      }
    };

    return (
      <div className="flex flex-col items-center text-white space-y-6 px-4">
        <button
          onClick={() => setStep(8)}
          className="self-start flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-2"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-3xl font-bold">Escolha sua foto</h2>

        {photo ? (
          <img
            src={URL.createObjectURL(photo)}
            alt="Prévia da foto"
            className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg"
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
            disabled={!photo || uploadingPhoto}
            onClick={handleRegisterWithPhoto}
            className="bg-success hover:bg-success/90 text-success-foreground py-3 px-8 rounded-full font-semibold w-full md:w-auto"
          >
            {uploadingPhoto ? "Cadastrando..." : photo ? "Cadastrar" : "Selecione uma foto primeiro"}
          </Button>
        </div>
      </div>
    );
  };

  const Step10Success = () => (
    <div className="flex flex-col items-center text-white space-y-6 text-center">
      <h2 className="text-4xl font-bold text-green-300">SUCESSO!</h2>
      <p className="text-lg max-w-md">
        Perfil criado com sucesso.<br />
        Agradecemos a sua confiança em nossa plataforma!
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-success hover:bg-success/90 text-success-foreground py-4 px-8 md:px-10 rounded-full font-semibold w-full md:w-auto"
      >
        Ir para página inicial
      </Button>
    </div>
  );

  // ------------------- FLUXO EMPRESA -------------------

  const Step2Company = () => {
    const [selectedProject, setSelectedProject] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(1)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
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
            onClick={() => setSelectedProject(option)}
            className={`w-80 py-6 rounded-full text-lg transition-all ${
              selectedProject === option
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {option}
          </Button>
        ))}
        
        {selectedProject && (
          <Button
            onClick={() => setStep(3)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-6 rounded-full text-lg font-semibold px-10 w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step3Company = () => {
    const [selectedSkill, setSelectedSkill] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(2)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
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
            onClick={() => setSelectedSkill(option)}
            className={`w-80 py-6 rounded-full text-lg transition-all ${
              selectedSkill === option
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {option}
          </Button>
        ))}
        
        {selectedSkill && (
          <Button
            onClick={() => setStep(4)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-6 rounded-full text-lg font-semibold px-10 w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step4Company = () => {
    const [selectedTime, setSelectedTime] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(3)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-3xl font-bold">Quanto tempo precisa do profissional?</h2>
        {["Decidir mais tarde", "< 1 semana", "1 semana - 6 meses", "+ 6 meses"].map((option) => (
          <Button
            key={option}
            onClick={() => setSelectedTime(option)}
            className={`w-80 py-6 rounded-full text-lg transition-all ${
              selectedTime === option
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {option}
          </Button>
        ))}
        
        {selectedTime && (
          <Button
            onClick={() => setStep(5)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-6 rounded-full text-lg font-semibold px-10 w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step5Company = () => {
    const [selectedGit, setSelectedGit] = useState("");
    
    return (
      <div className="flex flex-col items-center space-y-6 text-center text-white px-4">
        <button
          onClick={() => setStep(4)}
          className="self-start mb-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-3xl font-bold">Experiência em Git?</h2>
        {["Sim, básico", "Sim, avançado", "Conhecimento teórico", "Não necessário"].map((option) => (
          <Button
            key={option}
            onClick={() => setSelectedGit(option)}
            className={`w-80 py-6 rounded-full text-lg transition-all ${
              selectedGit === option
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {option}
          </Button>
        ))}
        
        {selectedGit && (
          <Button
            onClick={() => setStep(6)}
            className="mt-4 bg-success hover:bg-success/90 text-success-foreground py-6 rounded-full text-lg font-semibold px-10 w-80"
          >
            PRÓXIMO
          </Button>
        )}
      </div>
    );
  };

  const Step6Company = React.useMemo(() => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Limpar erros anteriores
      setPasswordError("");
      setConfirmPasswordError("");
      
      // Validação de senha - deve conter pelo menos uma letra
      const hasLetter = /[a-zA-Z]/.test(password);
      if (!hasLetter) {
       // setPasswordError("A senha deve conter pelo menos uma letra");
        toast({
          title: "Erro na senha",
          description: "A senha deve conter pelo menos uma letra.",
          variant: "destructive",
        });
        return;
      }

      // Validação de senhas iguais
      if (password !== confirmPassword) {
        setConfirmPasswordError("As senhas não coincidem");
        toast({
          title: "Erro",
          description: "As senhas não coincidem.",
          variant: "destructive",
        });
        return;
      }
      
      // Verifica o email antes de avançar
      await checkEmailAvailability(email);
      
      // Se houver erro de email, não avança
      if (emailError) {
        return;
      }
      
      setStep(7);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto px-4">
        <button
          type="button"
          onClick={() => setStep(5)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-4"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Cadastramento de Empresa
        </h2>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-white mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-1">Seu Nome</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Seu Sobrenome</label>
              <input
                type="text"
                value={companyContactLastName}
                onChange={(e) => setCompanyContactLastName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-1">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCnpj(value);
                }}
                required
                maxLength={14}
                placeholder="00000000000000"
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Seu cargo na empresa</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Estado (UF)</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione o estado da empresa</option>
                {states.map((st) => (
                  <option key={st.id} value={st.sigla}>
                    {st.nome} ({st.sigla})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-1">Cidade da empresa</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!state || loadingCities}
                className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">
                  {loadingCities ? "Carregando..." : !state ? "Selecione o estado primeiro" : "Selecione a cidade"}
                </option>
                {cities.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-1">Telefone/WhatsApp</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">+55</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPhone(value);
                  }}
                  required
                  maxLength={11}
                  placeholder="11999999999"
                  className="w-full p-3 pl-14 rounded-lg bg-white text-black focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                onBlur={(e) => checkEmailAvailability(e.target.value)}
                required
                className={`w-full p-3 rounded-lg bg-white text-black focus:ring-2 ${
                  emailError ? "ring-2 ring-red-500" : "focus:ring-primary"
                }`}
              />
              {checkingEmail && (
                <p className="text-yellow-300 text-sm mt-1">Verificando email...</p>
              )}
              {emailError && (
                <p className="text-red-300 text-sm mt-1 font-semibold">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                  minLength={6}
                  className={`w-full p-3 pr-10 rounded-lg bg-white text-black focus:ring-2 ${
                    passwordError ? "ring-2 ring-red-500" : "focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 z-10"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ul className="text-white/80 text-xs mt-2 space-y-1">
                <li className="flex items-center gap-1">
                  <span className={password.length >= 6 ? "text-green-300" : "text-white/60"}>✓</span>
                  Mínimo 6 caracteres
                </li>
                <li className="flex items-center gap-1">
                  <span className={/[a-zA-Z]/.test(password) ? "text-green-300" : "text-white/60"}>✓</span>
                  Pelo menos uma letra
                </li>
              </ul>
              {passwordError && (
                <p className="text-red-300 text-sm mt-1 font-semibold">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-1">Confirmar Senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                  required
                  minLength={6}
                  className={`w-full p-3 pr-10 rounded-lg bg-white text-black focus:ring-2 ${
                    confirmPasswordError ? "ring-2 ring-red-500" : "focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 z-10"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs mt-2 ${password === confirmPassword ? "text-green-300" : "text-red-300"}`}>
                  {password === confirmPassword ? "✓ Senhas coincidem" : "✗ Senhas não coincidem"}
                </p>
              )}
              {confirmPasswordError && (
                <p className="text-red-300 text-sm mt-1 font-semibold">{confirmPasswordError}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-white mb-1">
              Sua empresa possui políticas de diversidade e inclusão? *
            </label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="radio"
                  name="diversity"
                  value="sim"
                  checked={diversity === "sim"}
                  onChange={() => setDiversity("sim")}
                  required
                  className="accent-primary"
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
                  required
                  className="accent-primary"
                />
                Não
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={checkingEmail || !!emailError || !!passwordError || !!confirmPasswordError}
            className="w-full bg-success hover:bg-success/90 text-success-foreground py-4 rounded-full mt-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingEmail ? "VERIFICANDO..." : "CONTINUAR E ENVIAR OS DADOS"}
          </button>
        </div>
      </form>
    );
  }, [companyName, fullName, companyContactLastName, cnpj, position, state, city, phone, email, password, confirmPassword, diversity, states, cities, loadingCities, checkingEmail, emailError, passwordError, confirmPasswordError, showPassword, showConfirmPassword]);

  const Step7Company = () => (
    <div className="text-white space-y-6 max-w-3xl mx-auto text-justify px-4">
      <button
        onClick={() => setStep(6)}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-4"
      >
        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
        <span className="font-medium">Voltar</span>
      </button>
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

      <div className="text-center px-4">
        <Button
          onClick={() => setStep(8)}
          className="bg-success hover:bg-success/90 text-success-foreground py-4 px-8 md:px-10 rounded-full font-semibold mt-4 transition-all w-full md:w-auto"
        >
          Concordo com os termos e quero apoiar
        </Button>
      </div>
    </div>
  );

  const Step8Company = () => {
    const [logo, setLogo] = useState<File | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setLogo(event.target.files[0]);
      }
    };

    const handleRegisterWithLogo = async () => {
      if (!logo) {
        toast({
          title: "Logo obrigatório",
          description: "Por favor, selecione um logo antes de continuar.",
          variant: "destructive",
        });
        return;
      }

      setUploadingLogo(true);

      try {
        // First, register the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: `${fullName} ${companyContactLastName}`,
              role,
              state,
              city,
              company_name: companyName,
              cnpj,
              phone,
              position,
              diversity,
            },
          },
        });

        if (authError) throw authError;

        const userId = authData.user?.id;
        if (!userId) throw new Error("Erro ao obter ID do usuário");

        // Upload logo to storage
        const fileExt = logo.name.split('.').pop();
        const fileName = `${userId}/logo.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, logo, {
            upsert: true,
            contentType: logo.type
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        // Update company profile with logo URL
        const { error: updateError } = await supabase
          .from('company_profiles')
          .update({ logo_url: publicUrl })
          .eq('user_id', userId);

        if (updateError) throw updateError;

        setStep(9);

        toast({
          title: "Cadastro realizado!",
          description: "Sua empresa agora faz parte da plataforma.",
        });

      } catch (error: any) {
        toast({
          title: "Erro no cadastro",
          description: error.message || "Ocorreu um erro ao realizar o cadastro.",
          variant: "destructive",
        });
      } finally {
        setUploadingLogo(false);
      }
    };

    return (
      <div className="flex flex-col items-center text-white space-y-6 px-4">
        <button
          onClick={() => setStep(7)}
          className="self-start flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-2"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="font-medium">Voltar</span>
        </button>
        <h2 className="text-3xl font-bold">Envie o logo da sua empresa</h2>

        {logo ? (
          <img
            src={URL.createObjectURL(logo)}
            alt="Prévia da logo"
            className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg"
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
            disabled={!logo || uploadingLogo}
            onClick={handleRegisterWithLogo}
            className="bg-success hover:bg-success/90 text-success-foreground py-3 px-8 rounded-full font-semibold w-full md:w-auto"
          >
            {uploadingLogo ? "Cadastrando..." : logo ? "Finalizar cadastro" : "Selecione uma logo"}
          </Button>
        </div>
      </div>
    );
  };

  const Step9Company = () => (
    <div className="flex flex-col items-center text-white space-y-6 text-center">
      <h2 className="text-4xl font-bold text-primary">Cadastro concluído!</h2>
      <p className="text-lg max-w-md">
        Sua empresa agora faz parte de uma rede que apoia a diversidade e a inclusão.
        Obrigado por se juntar a nós 💜
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-success hover:bg-success/90 text-success-foreground py-4 px-8 md:px-10 rounded-full font-semibold w-full md:w-auto"
      >
        Ir para login
      </Button>
    </div>
  );

  // ------------------- RENDER -------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6E4062] via-[#5a3452] to-[#6E4062] p-3 md:p-8 lg:p-12">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl">
      {step === 1 && <Step1 />}
      {role === "candidate" && step === 2 && <Step2Candidate />}
      {role === "candidate" && step === 2.5 && <Step2_5Candidate />}
      {role === "candidate" && step === 2.7 && <Step2_7Candidate />}
      {role === "candidate" && step === 3 && <Step3Candidate />}
      {role === "candidate" && step === 4 && <Step4Candidate />}
      {role === "candidate" && step === 5 && <Step5Candidate />}
      {role === "candidate" && step === 6 && <Step6Candidate />}
      {role === "candidate" && step === 7 && Step7Candidate}
      {role === "candidate" && step === 8 && <Step8Terms />}
      {role === "candidate" && step === 9 && <Step9Photo />}
        {role === "candidate" && step === 10 && <Step10Success />}

        {role === "company" && step === 2 && <Step2Company />}
        {role === "company" && step === 3 && <Step3Company />}
        {role === "company" && step === 4 && <Step4Company />}
        {role === "company" && step === 5 && <Step5Company />}
        {role === "company" && step === 6 && Step6Company}
        {role === "company" && step === 7 && <Step7Company />}
        {role === "company" && step === 8 && <Step8Company />}
        {role === "company" && step === 9 && <Step9Company />}
      </div>
    </div>
  );
}
