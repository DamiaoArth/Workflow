import { useEffect, useState } from "react";
import ModeToggle from "./ModeToggle";

interface HeaderProps {
  mode: "plan" | "work";
  onModeChange: (mode: "plan" | "work") => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  const [username, setUsername] = useState("John Doe");
  const [initials, setInitials] = useState("JD");
  
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        <div className="flex items-center">
          <div className="font-semibold text-xl text-primary mr-8">
            <i className="fas fa-brain text-accent mr-2"></i>
            AI Workspace
          </div>
          
          <ModeToggle mode={mode} onModeChange={onModeChange} />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-primary">
            <i className="fas fa-bell"></i>
          </button>
          <button className="text-gray-600 hover:text-primary">
            <i className="fas fa-cog"></i>
          </button>
          <div className="flex items-center">
            <span className="hidden md:inline text-sm font-medium mr-2">{username}</span>
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
