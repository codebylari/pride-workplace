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
      {/* Elementos decorativos geométricos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {/* Círculos grandes */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-purple-400/30 blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 rounded-full bg-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl"></div>
        
        {/* Elementos geométricos menores */}
        <div className="absolute top-40 right-1/4 w-32 h-32 bg-white/10 rounded-lg rotate-45"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-48 bg-white/5 rounded-lg"></div>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 relative z-10 px-4">
        {/* Left side - Welcome */}
        <div className="flex flex-col justify-center items-start space-y-8 text-white">
          <img src={logo} alt="QueerCode Logo" className="w-48 md:w-64 h-auto" />
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Bem-vindo!
            </h1>
            
            <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-pink-500"></div>
            
            <p className="text-lg text-purple-200 max-w-md leading-relaxed">
              Conectando talentos diversos com empresas que valorizam a inclusão e a diversidade no ambiente de trabalho.
            </p>
          </div>
          
          <Button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-8 py-6 rounded-full text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            CADASTRAR-SE
          </Button>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-purple-800/40 backdrop-blur-lg rounded-3xl p-10 space-y-8 shadow-2xl border border-purple-700/50">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Sign in</h2>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-purple-200 text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-purple-900/50 backdrop-blur-sm rounded-lg py-6 text-white placeholder:text-purple-300 border border-purple-700/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-purple-200 text-sm font-medium">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-purple-900/50 backdrop-blur-sm rounded-lg py-6 text-white placeholder:text-purple-300 pr-12 border border-purple-700/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-purple-300 text-sm hover:text-white transition-colors"
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
