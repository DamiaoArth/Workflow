import { useState, useEffect } from "react";

export function useModeState() {
  const [mode, setMode] = useState<"plan" | "work">("plan");
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false);
  
  // Save preferences in localStorage
  useEffect(() => {
    localStorage.setItem("workspace-mode", mode);
  }, [mode]);
  
  return {
    mode,
    setMode,
    agentSettingsOpen,
    setAgentSettingsOpen
  };
}
