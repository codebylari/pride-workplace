import { useNavigate } from "react-router-dom";

export default function CompanyDeactivateAccount() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Desativar Conta</h1>
        <p className="text-gray-600 mb-6">
          Esta funcionalidade ainda não está disponível.
        </p>
        <button
          onClick={() => navigate("/company-account")}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
