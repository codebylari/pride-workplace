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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-primary/80 via-primary to-primary/90">
      {/* Conexões tecnológicas com brilho em todo o fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Filtro de brilho para os pontos */}
            <filter id="glow-auth">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Pontos com brilho */}
          <circle cx="10%" cy="15%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="25%" cy="12%" r="2" fill="#e5e7eb" />
          <circle cx="40%" cy="18%" r="5" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="55%" cy="10%" r="2" fill="#e5e7eb" />
          <circle cx="70%" cy="20%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="85%" cy="15%" r="2" fill="#e5e7eb" />
          
          <circle cx="15%" cy="30%" r="2" fill="#e5e7eb" />
          <circle cx="32%" cy="35%" r="5" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="48%" cy="28%" r="2" fill="#e5e7eb" />
          <circle cx="62%" cy="38%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="78%" cy="32%" r="2" fill="#e5e7eb" />
          <circle cx="90%" cy="35%" r="5" fill="#ffffff" filter="url(#glow-auth)" />
          
          <circle cx="8%" cy="50%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="22%" cy="48%" r="2" fill="#e5e7eb" />
          <circle cx="38%" cy="52%" r="5" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="52%" cy="45%" r="2" fill="#e5e7eb" />
          <circle cx="68%" cy="55%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="82%" cy="48%" r="2" fill="#e5e7eb" />
          
          <circle cx="12%" cy="68%" r="2" fill="#e5e7eb" />
          <circle cx="28%" cy="65%" r="5" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="45%" cy="70%" r="2" fill="#e5e7eb" />
          <circle cx="60%" cy="68%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="75%" cy="72%" r="2" fill="#e5e7eb" />
          <circle cx="88%" cy="65%" r="5" fill="#ffffff" filter="url(#glow-auth)" />
          
          <circle cx="18%" cy="85%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="35%" cy="88%" r="2" fill="#e5e7eb" />
          <circle cx="50%" cy="82%" r="5" fill="#ffffff" filter="url(#glow-auth)" />
          <circle cx="65%" cy="90%" r="2" fill="#e5e7eb" />
          <circle cx="80%" cy="85%" r="4" fill="#ffffff" filter="url(#glow-auth)" />
          
          {/* Linhas de conexão */}
          <line x1="10%" y1="15%" x2="25%" y2="12%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="25%" y1="12%" x2="40%" y2="18%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="40%" y1="18%" x2="55%" y2="10%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="55%" y1="10%" x2="70%" y2="20%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="70%" y1="20%" x2="85%" y2="15%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="10%" y1="15%" x2="15%" y2="30%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="25%" y1="12%" x2="32%" y2="35%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="40%" y1="18%" x2="48%" y2="28%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="55%" y1="10%" x2="62%" y2="38%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="70%" y1="20%" x2="78%" y2="32%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="85%" y1="15%" x2="90%" y2="35%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="15%" y1="30%" x2="32%" y2="35%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="32%" y1="35%" x2="48%" y2="28%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="48%" y1="28%" x2="62%" y2="38%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="62%" y1="38%" x2="78%" y2="32%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="78%" y1="32%" x2="90%" y2="35%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="15%" y1="30%" x2="8%" y2="50%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="32%" y1="35%" x2="22%" y2="48%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="48%" y1="28%" x2="38%" y2="52%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="62%" y1="38%" x2="52%" y2="45%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="78%" y1="32%" x2="68%" y2="55%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="90%" y1="35%" x2="82%" y2="48%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="8%" y1="50%" x2="22%" y2="48%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="22%" y1="48%" x2="38%" y2="52%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="38%" y1="52%" x2="52%" y2="45%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="52%" y1="45%" x2="68%" y2="55%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="68%" y1="55%" x2="82%" y2="48%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="8%" y1="50%" x2="12%" y2="68%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="22%" y1="48%" x2="28%" y2="65%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="38%" y1="52%" x2="45%" y2="70%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="52%" y1="45%" x2="60%" y2="68%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="68%" y1="55%" x2="75%" y2="72%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="82%" y1="48%" x2="88%" y2="65%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="12%" y1="68%" x2="28%" y2="65%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="28%" y1="65%" x2="45%" y2="70%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="45%" y1="70%" x2="60%" y2="68%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="60%" y1="68%" x2="75%" y2="72%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="75%" y1="72%" x2="88%" y2="65%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="12%" y1="68%" x2="18%" y2="85%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="28%" y1="65%" x2="35%" y2="88%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="45%" y1="70%" x2="50%" y2="82%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="60%" y1="68%" x2="65%" y2="90%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="75%" y1="72%" x2="80%" y2="85%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          
          <line x1="18%" y1="85%" x2="35%" y2="88%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="35%" y1="88%" x2="50%" y2="82%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="50%" y1="82%" x2="65%" y2="90%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
          <line x1="65%" y1="90%" x2="80%" y2="85%" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
        </svg>
      </div>

      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-16 bg-white rounded-3xl p-8 md:p-16 shadow-2xl border-4 border-primary relative z-10">
        {/* Left side - Welcome */}
        <div className="flex flex-col justify-center items-start space-y-10">
          <img src={logo} alt="QueerCode Logo" className="w-56 md:w-72 h-auto" />
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-800">Bem vindos à plataforma!</h1>
            <p className="text-lg md:text-xl text-gray-700">Conectando talentos com oportunidades</p>
          </div>
          <div className="space-y-5 pt-4">
            <p className="text-xl text-gray-800">Não possui conta?</p>
            <Button
              onClick={() => navigate("/register")}
              className="bg-[#C1E1C1] hover:bg-[#B0D5B0] text-gray-900 px-10 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              CADASTRAR-SE
            </Button>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-10 space-y-8 border-4 border-primary shadow-2xl relative z-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">Login</h2>
              <p className="text-gray-600">Entre com suas credenciais</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-700 text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 rounded-xl py-6 text-gray-800 border-2 border-gray-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                <label className="text-gray-700 text-sm font-medium">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-50 rounded-xl py-6 text-gray-800 pr-12 border-2 border-gray-200 focus:ring-2 focus:ring-primary"
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
                  className="text-primary text-sm underline hover:text-primary/80 transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
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
