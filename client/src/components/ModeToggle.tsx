interface ModeToggleProps {
  mode: "plan" | "work";
  onModeChange: (mode: "plan" | "work") => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
      <button 
        id="plan-mode-btn" 
        className={`mode-btn px-4 py-1.5 rounded-md font-medium ${
          mode === "plan" 
            ? "bg-white text-text shadow-sm" 
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => onModeChange("plan")}
      >
        <i className="fas fa-tasks mr-2"></i>Plan
      </button>
      <button 
        id="work-mode-btn" 
        className={`mode-btn px-4 py-1.5 rounded-md font-medium ${
          mode === "work" 
            ? "bg-white text-text shadow-sm" 
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => onModeChange("work")}
      >
        <i className="fas fa-comment-dots mr-2"></i>Work
      </button>
    </div>
  );
}
