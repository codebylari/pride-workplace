import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";

export default function CandidateSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { darkMode, setDarkMode } = useTheme();

  // Toggle dark mode via global ThemeContext
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
  };

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
      <CandidateSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Configurações
          </h1>

          <div className="space-y-6">
            {/* Notificações */}
            <div className={`flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Notificações
              </span>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            {/* Notificações Email */}
            <div className={`flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Notificações Email
              </span>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {/* Dark Mode */}
            <div className={`flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Dark mode
              </span>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>

            {/* Conta */}
            <button 
              onClick={() => navigate("/account")}
              className={`w-full flex justify-between items-center py-4 border-b ${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"} transition text-left`}
            >
              <span className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Conta
              </span>
            </button>
          </div>
        </div>
      </main>
      
      <ChatBot />
    </div>
  );
}
