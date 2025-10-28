import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/change-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o email de recuperação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(to bottom right, hsl(315, 26%, 40%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}>
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Recebemos sua solicitação para redefinir sua senha.
            </h1>
            
            <div className="space-y-4 text-gray-700 text-lg">
              <p>Uma nova senha foi gerada e enviada para o seu e-mail.</p>
              <p>
                Por segurança, recomendamos que você altere esta senha após o primeiro acesso.
              </p>
              <p>
                Caso não tenha solicitado a redefinição, ignore esta mensagem ou entre em contato com nosso suporte.
              </p>
            </div>

            <div className="pt-6">
              <p className="text-gray-600">Atenciosamente,</p>
              <p className="text-2xl font-bold text-primary mt-2">QueerCode.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(to bottom right, hsl(315, 26%, 40%), hsl(315, 30%, 50%), hsl(320, 30%, 50%))' }}>
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <Lock className="w-10 h-10 text-gray-600" />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900">
            Esqueceu sua senha?
          </h1>

          <p className="text-center text-gray-600">
            Digite seu email e enviaremos um link para a nova senha.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="digite seu email"
                required
                className="w-full p-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-full bg-green-300 hover:bg-green-400 text-green-900 font-semibold text-lg"
            >
              {loading ? "ENVIANDO..." : "ENVIAR"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
