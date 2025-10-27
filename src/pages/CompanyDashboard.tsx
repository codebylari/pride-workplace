import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  // Extract company name from user metadata
  const companyName = user?.user_metadata?.company_name || "Empresa";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Bell size={24} />
        </button>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">Menu</h2>
            <nav className="space-y-4">
              <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">
                Dashboard
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">
                Minhas Vagas
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">
                Candidatos
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">
                Configurações
              </button>
              <button 
                onClick={() => navigate("/")}
                className="w-full text-left p-3 hover:bg-gray-100 rounded-lg text-red-600"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white border-4 border-blue-500 rounded-2xl p-12 shadow-lg mb-8 relative">
            <div className="text-center space-y-8">
              <h1 className="text-4xl font-bold text-gray-800">
                Bem-vindo, {companyName}!
              </h1>
              
              <p className="text-xl text-gray-600">
                "Gerencie suas oportunidades de forma simples e rápida."
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-green-300/80 hover:bg-green-400/80 text-green-900 px-12 py-6 rounded-xl text-lg font-semibold"
                >
                  Cadastre sua vaga
                </Button>
                
                <Button
                  onClick={() => navigate("/")}
                  className="bg-green-200/80 hover:bg-green-300/80 text-green-900 px-12 py-6 rounded-xl text-lg font-semibold"
                >
                  Acesse suas vagas
                </Button>
              </div>
            </div>

            {/* Chatbot Icon */}
            <div className="absolute bottom-4 right-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition">
                <Bot size={40} className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Vagas Ativas</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Candidaturas</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Em Análise</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
