import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Star, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  const companyName = user?.user_metadata?.company_name || "Nome da Empresa";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/company-dashboard")}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Bell size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Logo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {companyName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                  <Edit size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} size={24} className="fill-green-400 text-green-400" />
              ))}
              <Star size={24} className="fill-gray-300 text-gray-300" />
              <span className="ml-2 text-gray-600 font-semibold">4.5</span>
            </div>

            {/* Company Name */}
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
              Nome Empresa: {companyName}
            </h1>

            {/* Action Buttons */}
            <div className="space-y-4 max-w-md mx-auto">
              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Conheça a Empresa
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                O que buscamos
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Relatos
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Formação
              </Button>

              <Button
                onClick={() => {}}
                className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md"
              >
                Vagas Disponíveis
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
