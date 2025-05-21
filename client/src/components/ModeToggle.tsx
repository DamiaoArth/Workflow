interface ModeToggleProps {
  mode: "plan" | "work";
  onModeChange: (mode: "plan" | "work") => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="hidden md:flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      <button 
        id="plan-mode-btn" 
        className={`mode-btn px-4 py-1.5 rounded-md font-medium ${
          mode === "plan" 
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
        onClick={() => onModeChange("plan")}
      >
        <i className="fas fa-tasks mr-2"></i>Plan
      </button>
      <button 
        id="work-mode-btn" 
        className={`mode-btn px-4 py-1.5 rounded-md font-medium ${
          mode === "work" 
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
        onClick={() => onModeChange("work")}
      >
        <i className="fas fa-comment-dots mr-2"></i>Work
      </button>
    </div>
  );
}
