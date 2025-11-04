import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo-linkar.png";
import icon from "@/assets/icon-linkar.png";

export default function Auth(Auth: unknown) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"candidate" | "company" | "admin">("candidate");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check user role to redirect appropriately
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roleData?.role === "admin") {
          navigate("/admin-dashboard");
        } else if (roleData?.role === "company") {
          navigate("/company-dashboard");
        } else {
          navigate("/candidate-dashboard");
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.session) {
      // Check user role to redirect appropriately
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .single();

      if (roleData?.role === "admin") {
        navigate("/admin-dashboard");
      } else if (roleData?.role === "company") {
        navigate("/company-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-[#6E4062] via-[#5a3452] to-[#6E4062]">
      {/* Logo LINKA+ no topo centralizado */}
      <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
        <img src={logo} alt="Linka+ Logo" className="w-48 sm:w-64 h-auto drop-shadow-2xl" />
      </div>

      {/* Elementos decorativos sutis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos grandes com blur suave */}
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        
        {/* Formas geométricas decorativas - quadrados e retângulos */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-2xl rotate-45"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/2 w-16 h-40 bg-white/5 rounded-xl rotate-12"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-white/5 rounded-2xl -rotate-12"></div>
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/5 rounded-full"></div>
        
        {/* Mais formas geométricas distribuídas */}
        <div className="absolute top-20 right-1/4 w-20 h-20 bg-white/5 rounded-xl rotate-45"></div>
        <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/5 rounded-2xl -rotate-12"></div>
        <div className="absolute bottom-20 right-1/5 w-28 h-28 bg-white/5 rounded-xl rotate-12"></div>
        <div className="absolute top-1/4 right-1/5 w-12 h-32 bg-white/5 rounded-lg rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/2 w-18 h-18 bg-white/5 rounded-full"></div>
        <div className="absolute top-2/3 left-1/4 w-22 h-22 bg-white/5 rounded-xl -rotate-45"></div>
        <div className="absolute top-1/2 right-1/6 w-26 h-26 bg-white/5 rounded-2xl rotate-12"></div>
        <div className="absolute bottom-1/2 right-1/3 w-20 h-36 bg-white/5 rounded-lg -rotate-12"></div>
        
        {/* Mais formas no lado direito */}
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-white/5 rounded-xl -rotate-45"></div>
        <div className="absolute top-2/3 right-20 w-18 h-18 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-12 w-20 h-28 bg-white/5 rounded-lg rotate-45"></div>
        
        {/* Linhas decorativas */}
        <div className="absolute top-40 left-1/3 w-48 h-0.5 bg-white/10 rotate-45"></div>
        <div className="absolute bottom-40 right-1/4 w-64 h-0.5 bg-white/10 -rotate-12"></div>
      </div>

      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-8 lg:gap-16 relative z-10 px-4 sm:px-6 pt-24 sm:pt-8">
        {/* Left side - Welcome */}
        <div className="flex flex-col justify-center items-start space-y-8 sm:space-y-10 text-white animate-fade-in">
          <div className="space-y-6">
            {/* Ícone L+ acima do Bem-vindo */}
            <img src={icon} alt="Linka+ Icon" className="w-20 sm:w-28 md:w-32 h-auto mb-4 drop-shadow-2xl" />
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
              Bem-vindo!
            </h1>
            
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full"></div>
            
            <p className="text-base sm:text-xl text-white/90 max-w-lg leading-relaxed font-light">
              Conectando talentos diversos com empresas que valorizam a inclusão e a diversidade no ambiente de trabalho.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg sm:text-xl text-white/90 font-light">Ainda não possui conta?</p>
            <Button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-8 sm:px-10 py-5 sm:py-6 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              CADASTRAR-SE
            </Button>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Efeito de brilho sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
            
            <div className="text-center space-y-3 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Entrar</h2>
              <p className="text-white/70 text-sm">Acesse sua conta</p>
            </div>

            {/* User Type Selection */}
            <div className="flex gap-2 relative z-10">
              <button
                type="button"
                onClick={() => setUserType("candidate")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  userType === "candidate"
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg"
                    : "bg-white/20 text-white/70 hover:bg-white/30"
                }`}
              >
                Candidato
              </button>
              <button
                type="button"
                onClick={() => setUserType("company")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  userType === "company"
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg"
                    : "bg-white/20 text-white/70 hover:bg-white/30"
                }`}
              >
                Empresa
              </button>
              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  userType === "admin"
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg"
                    : "bg-white/20 text-white/70 hover:bg-white/30"
                }`}
              >
                Admin
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/95 rounded-xl py-6 text-gray-900 placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-pink-400 shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/95 rounded-xl py-6 text-gray-900 placeholder:text-gray-400 pr-12 border-0 focus:ring-2 focus:ring-pink-400 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-white/80 text-sm hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
