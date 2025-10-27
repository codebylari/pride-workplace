import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Star, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  // Get user data
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Usuário";
  const rating = 4.5;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={() => navigate("/candidate-dashboard")}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Bell size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header Background */}
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Photo */}
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition shadow-lg">
                  <Edit2 size={18} />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} size={24} fill="#22c55e" className="text-green-500" />
              ))}
              <Star size={24} fill="#22c55e" className="text-green-500" fillOpacity={0.5} />
              <span className="ml-2 text-gray-600 font-semibold">{rating}</span>
            </div>

            {/* Name and Gender */}
            <div className="text-center mb-8 space-y-1">
              <h1 className="text-2xl font-bold text-gray-800">
                Nome: {userName}
              </h1>
              <p className="text-lg text-gray-600">
                Gênero: Feminino
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 max-w-md mx-auto">
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Sobre mim
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Experiências
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Formação
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Minha Jornada
              </Button>
              
              <Button className="w-full bg-pink-300 hover:bg-pink-400 text-white py-6 rounded-full text-lg font-medium shadow-md">
                Currículo
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
