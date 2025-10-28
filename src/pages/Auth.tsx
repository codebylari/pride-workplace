import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      if (roleData?.role === "company") {
        navigate("/company-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#6E4062] via-[#5a3452] to-[#6E4062]">
      {/* Logo no topo centralizado */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <img src={logo} alt="QueerCode Logo" className="w-40 h-auto brightness-0 invert opacity-80" />
      </div>

      {/* Elementos decorativos geométricos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos grandes com blur */}
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-[500px] h-[500px] rounded-full bg-pink-500/15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl"></div>
        
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
        
        {/* Linhas decorativas */}
        <div className="absolute top-40 left-1/3 w-48 h-0.5 bg-white/10 rotate-45"></div>
        <div className="absolute bottom-40 right-1/4 w-64 h-0.5 bg-white/10 -rotate-12"></div>
        <div className="absolute top-1/3 right-1/5 w-40 h-0.5 bg-white/10 rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/5 w-56 h-0.5 bg-white/10 -rotate-45"></div>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 relative z-10 px-4">
        {/* Left side - Welcome */}
        <div className="flex flex-col justify-center items-start space-y-8 text-white">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Bem-vindo!
            </h1>
            
            <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-pink-500"></div>
            
            <p className="text-lg text-purple-200 max-w-md leading-relaxed">
              Conectando talentos diversos com empresas que valorizam a inclusão e a diversidade no ambiente de trabalho.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-purple-200">Não possui conta?</p>
            <Button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-8 py-6 rounded-full text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              CADASTRAR-SE
            </Button>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-10 space-y-8 shadow-2xl border border-white/20 relative">
            {/* Efeito de brilho/reflexo de vidro */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="text-center space-y-2 relative z-10">
              <h2 className="text-3xl font-bold text-white">Sign in</h2>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/90 rounded-lg py-6 text-gray-900 placeholder:text-gray-500 border border-white/30 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                    className="bg-white/90 rounded-lg py-6 text-gray-900 placeholder:text-gray-500 pr-12 border border-white/30 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-white/80 text-sm hover:text-white transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
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
