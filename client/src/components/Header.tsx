import { useEffect, useState } from "react";
import ModeToggle from "./ModeToggle";
import { useTheme } from "@/components/ui/ThemeProvider";

interface HeaderProps {
  mode: "plan" | "work";
  onModeChange: (mode: "plan" | "work") => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  const [username, setUsername] = useState("John Doe");
  const [initials, setInitials] = useState("JD");
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    // Get initials from username
    if (username) {
      const nameParts = username.split(' ');
      if (nameParts.length >= 2) {
        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
      } else if (nameParts.length === 1) {
        setInitials(nameParts[0][0]);
      }
    }
  }, [username]);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        <div className="flex items-center">
          <div className="font-semibold text-xl text-primary dark:text-blue-400 mr-8">
            <i className="fas fa-brain text-accent dark:text-indigo-400 mr-2"></i>
            AI Workspace
          </div>
          
          <ModeToggle mode={mode} onModeChange={onModeChange} />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme toggle button */}
          <button 
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </button>
          
          <button className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400">
            <i className="fas fa-bell"></i>
          </button>
          
          <button className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400">
            <i className="fas fa-cog"></i>
          </button>
          
          <div className="flex items-center">
            <span className="hidden md:inline text-sm font-medium mr-2 dark:text-gray-200">{username}</span>
            <div className="w-8 h-8 rounded-full bg-accent dark:bg-indigo-600 text-white flex items-center justify-center">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
