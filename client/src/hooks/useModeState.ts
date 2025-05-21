import { useState } from "react";

export function useModeState() {
  const [mode, setMode] = useState<"plan" | "work">("plan");
  
  return {
    mode,
    setMode
  };
}
