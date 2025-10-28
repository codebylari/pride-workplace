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
    <div className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-primary/80 via-primary to-primary/90">
      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-16 bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-white/20">
        {/* Left side - Welcome */}
        <div className="flex flex-col justify-center items-start text-white space-y-10">
          <img src={logo} alt="QueerCode Logo" className="w-56 md:w-72 h-auto" />
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">Bem vindos à plataforma!</h1>
            <p className="text-lg md:text-xl text-white/90">Conectando talentos com oportunidades</p>
          </div>
          <div className="space-y-5 pt-4">
            <p className="text-xl text-white/95">Não possui conta?</p>
            <Button
              onClick={() => navigate("/register")}
              className="bg-white/90 hover:bg-white text-primary px-10 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              CADASTRAR-SE
            </Button>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/15 backdrop-blur-lg rounded-3xl p-10 space-y-8 border border-white/20 shadow-xl">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Login</h2>
              <p className="text-white/80">Entre com suas credenciais</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label className="text-white text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/95 rounded-xl py-6 text-gray-800 border-0 focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div className="space-y-3">
                <label className="text-white text-sm font-medium">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/95 rounded-xl py-6 text-gray-800 pr-12 border-0 focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-white/90 text-sm underline hover:text-white transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white/90 hover:bg-white text-primary py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "ENTRAR"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
