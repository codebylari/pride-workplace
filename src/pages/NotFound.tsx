import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const { darkMode } = useTheme();

  return (
    <div className={`flex min-h-screen items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      <div className="text-center">
        <h1 className={`mb-4 text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>404</h1>
        <p className={`mb-4 text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Oops! Page not found</p>
        <Link to="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
