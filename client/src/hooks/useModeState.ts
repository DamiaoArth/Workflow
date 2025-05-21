import { useState, useEffect } from "react";

// Define the work mode tabs type
export type WorkTab = "chat" | "coding";

export function useModeState() {
  const [mode, setMode] = useState<"plan" | "work">("plan");
  const [workTab, setWorkTab] = useState<WorkTab>("chat");
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false);
  
  // Save preferences in localStorage
  useEffect(() => {
    localStorage.setItem("workspace-mode", mode);
    localStorage.setItem("workspace-work-tab", workTab);
  }, [mode, workTab]);
  
  return {
    mode,
    setMode,
    workTab,
    setWorkTab,
    agentSettingsOpen,
    setAgentSettingsOpen
  };
}
