import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function InitAdmin() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const createAdminUser = async () => {
      try {
        console.log("Calling create-admin-user function...");
        
        const { data, error } = await supabase.functions.invoke('create-admin-user', {
          body: {}
        });

        if (error) {
          console.error("Error calling function:", error);
          throw error;
        }

        console.log("Function response:", data);
        
        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/auth");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Erro ao criar usuário admin");
        }
      } catch (err: any) {
        console.error("Error:", err);
        setStatus("error");
        setMessage(err.message || "Erro ao criar usuário admin");
      }
    };

    createAdminUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Criando Usuário Admin</h2>
              <p className="text-muted-foreground">Aguarde um momento...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-600">Sucesso!</h2>
              <p className="text-muted-foreground mb-4">{message}</p>
              <p className="text-sm text-muted-foreground">
                Email: <strong>admLinka@gmail.com</strong><br />
                Senha: <strong>Adm@123</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Redirecionando para o login...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-600">Erro</h2>
              <p className="text-muted-foreground mb-4">{message}</p>
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ir para Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
