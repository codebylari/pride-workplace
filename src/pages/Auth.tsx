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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        {/* Left side - Welcome */}
        <div className="flex flex-col justify-center items-start text-white space-y-8">
          <img src={logo} alt="QueerCode Logo" className="w-64 h-auto" />
          <h1 className="text-5xl font-bold">Bem vindos a plataforma!</h1>
          <div className="space-y-4">
            <p className="text-xl">Não possui conta ?</p>
            <Button
              onClick={() => navigate("/register")}
              className="bg-green-300/80 hover:bg-green-400/80 text-green-900 px-12 py-6 rounded-full text-lg font-semibold"
            >
              CADASTRAR-SE
            </Button>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-sm">Digite seu email</label>
                <Input
                  type="email"
                  placeholder="renata.silva@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/90 rounded-xl py-6 text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm">Digite sua nova senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/90 rounded-xl py-6 text-gray-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="text-white text-sm underline hover:text-white/80">
                  esqueceu sua senha ?
                </a>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-300/80 hover:bg-pink-400/80 text-pink-900 py-6 rounded-full text-lg font-semibold"
              >
                {loading ? "Entrando..." : "LOGIN"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
