import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function CompanySupport() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Page Title */}
        <h1 className={`text-4xl font-bold text-center mb-16 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Suporte
        </h1>

        {/* Buttons Section */}
        <div className="space-y-6 mb-16">
          <Button 
            onClick={() => setChatOpen(true)}
            className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-8 rounded-full text-xl font-semibold shadow-lg"
          >
            Chat/Suporte
          </Button>

          <Button 
            onClick={() => navigate("/company-community-rules")}
            className="w-full bg-[#FFF8D6] hover:bg-[#FFF2A9] text-gray-800 py-8 rounded-full text-xl font-semibold shadow-lg"
          >
            Regras da Comunidade
          </Button>
        </div>
      </main>
      
      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
