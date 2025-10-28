import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function AboutUs() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const isCompany = userRole === "company";

  // Redireciona para a página correta baseado no tipo de usuário
  useEffect(() => {
    if (userRole) {
      if (isCompany) {
        navigate("/company-about", { replace: true });
      } else {
        navigate("/candidate-about", { replace: true });
      }
    }
  }, [userRole, isCompany, navigate]);

  // Mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}
